import "server-only";
import type { PracticeRow } from "@/lib/supabase/types";
import type { ExtractionData, ExtractedPerson, ExtractedImmobile } from "@/lib/extraction";
import { valoreCatastaleFabbricato, valoreCatastaleTerreno } from "@/lib/catasto";

/*
  Generatore del file telematico della dichiarazione di successione
  (fornitura SUC13). Struttura e namespace RICALCATI sui file .suc REALI
  prodotti dal software AdE per lo studio Armellin (esempi analizzati l'11/07:
  busta tm:Messaggio > tm:Intestazione + tm:Contenuto[CodiceFornitura=SUC13] >
  suc:Fornitura > suc:Dichiarazione[identificativo] > Frontespizio + quadri).

  Produce una BOZZA: prima dell'invio va SEMPRE aperta/controllata con il
  modulo di controllo "Dichiarazione di successione" del Desktop Telematico
  (percorso previsto dalle stesse specifiche per i software di terzi).

  Copertura: Frontespizio (defunto, presentatore/dichiarante, firme, impegno a
  trasmettere), EA (eredi), EB (terreni) ed EC (fabbricati) con VALORI calcolati
  da rendita x coefficienti standard, EE (riepilogo), EG (allegati PDF/TIFF in
  base64), EH (dichiarazioni sostitutive), ER (conti correnti/crediti).
  NON generati (segnalati nei warnings): ED (passivita), EF (liquidazione
  imposte, la calcola il software AdE), EO (titoli/fondi), volture.
*/

const NS = {
  tm: "www.agenziaentrate.gov.it:specificheTecniche:telent:v1",
  cm: "urn:www.agenziaentrate.gov.it:specificheTecniche:common:v2",
  reg: "urn:www.agenziaentrate.gov.it:specificheTecniche:sco:reg:v2",
  sc: "urn:www.agenziaentrate.gov.it:specificheTecniche:sco:common:v3",
  suc: "urn:www.agenziaentrate.gov.it:specificheTecniche:sco:suc:v1",
};

/* ------------------------------ util XML ---------------------------------- */

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Elemento foglia, omesso se vuoto.
function el(name: string, value: string | null | undefined, indent: string): string {
  const v = (value ?? "").trim();
  if (!v) return "";
  return `${indent}<${name}>${esc(v)}</${name}>\n`;
}

function wrap(name: string, inner: string, indent: string, attrs = ""): string {
  if (!inner.trim()) return "";
  return `${indent}<${name}${attrs}>\n${inner}${indent}</${name}>\n`;
}

// "GG/MM/AAAA" o "AAAA-MM-GG" -> "GGMMAAAA" (formato dei file reali).
function dateToSuc(value: string | null | undefined): string | null {
  const v = (value ?? "").trim();
  if (!v) return null;
  let m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[1].padStart(2, "0")}${m[2].padStart(2, "0")}${m[3]}`;
  m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}${m[2]}${m[1]}`;
  if (/^\d{8}$/.test(v)) return v;
  return null;
}

const upper = (v: string | null | undefined) => (v ?? "").trim().toUpperCase();

// Sesso da CF italiano (giorno di nascita +40 per le donne).
function sexFromCf(cf: string | null | undefined): string | null {
  const v = upper(cf);
  if (!/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/.test(v)) return null;
  const dayMap: Record<string, string> = { L: "0", M: "1", N: "2", P: "3", Q: "4", R: "5", S: "6", T: "7", U: "8", V: "9" };
  const raw = v.slice(9, 11).split("").map((c) => dayMap[c] ?? c).join("");
  const day = Number(raw);
  if (!Number.isFinite(day)) return null;
  return day > 40 ? "F" : "M";
}

/*
  Grado di parentela -> codice tabellare AdE. Confermati dai file reali:
  02 = figlio/figlia, 10 = sorella/fratello. Gli altri dalla tabella generale
  del modello (01 coniuge, 03 genitore, 05A/05B nonni, 08 nipote in linea retta).
*/
function gradoParentelaCode(label: string | null | undefined): string | null {
  const v = (label ?? "").toLowerCase();
  if (!v) return null;
  if (/coniuge|moglie|marito|unione civile/.test(v)) return "01";
  if (/figli/.test(v)) return "02";
  if (/genitor|madre|padre/.test(v)) return "03";
  if (/fratell|sorell/.test(v)) return "10";
  if (/nipote/.test(v)) return "08";
  return null;
}

// Stato civile -> codice (dai file reali: 4 = vedovo/a).
function statoCivileCode(label: string | null | undefined): string | null {
  const v = (label ?? "").toLowerCase();
  if (!v) return null;
  if (/celib|nubil/.test(v)) return "1";
  if (/coniugat|sposat/.test(v)) return "2";
  if (/vedov/.test(v)) return "4";
  if (/separat/.test(v)) return "5";
  if (/divorziat|scioglimento/.test(v)) return "6";
  if (/unione civile/.test(v)) return "3";
  return null;
}

// "1/2", "50%", vuoto -> frazione (default: parti uguali tra gli eredi).
function parseQuota(raw: string | null | undefined, heirs: number): { num: number; den: number } {
  const v = (raw ?? "").trim();
  const frac = v.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (frac) return { num: Number(frac[1]), den: Number(frac[2]) };
  const perc = v.match(/^(\d+(?:[.,]\d+)?)\s*%$/);
  if (perc) {
    const n = Math.round(Number(perc[1].replace(",", ".")));
    if (n > 0 && n <= 100) return { num: n, den: 100 };
  }
  return { num: 1, den: Math.max(1, heirs) };
}

// Importo "1.234,56" / "1234.56" -> numero (euro), null se non leggibile.
function parseAmount(raw: string | null | undefined): number | null {
  const v = (raw ?? "").trim();
  if (!v) return null;
  const normalized = v.replace(/[€\s]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

// Formato importi con virgola e 2 decimali (come nei file reali: "26517,67").
function fmtAmount(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

/* ------------------------- anagrafiche e devoluzioni ----------------------- */

function anagrafica(
  p: {
    cognome?: string | null;
    nome?: string | null;
    sesso?: string | null;
    cf?: string | null;
    dataNascita?: string | null;
    comuneNascita?: string | null;
    provinciaNascita?: string | null;
  },
  indent: string,
): string {
  const i2 = indent + "  ";
  const sesso = upper(p.sesso).slice(0, 1) || sexFromCf(p.cf);
  const inner =
    el("reg:Cognome", upper(p.cognome), i2) +
    el("reg:Nome", upper(p.nome), i2) +
    el("reg:Sesso", sesso, i2) +
    el("reg:DataNascita", dateToSuc(p.dataNascita), i2) +
    el("reg:ComuneNascita", upper(p.comuneNascita), i2) +
    el("reg:ProvinciaNascita", upper(p.provinciaNascita).slice(0, 2) || null, i2);
  return wrap("suc:DatiAnagrafici", inner, indent);
}

/*
  Sezione devoluzione di un bene (come nei file reali): un rigo per erede,
  con riferimento (Rigo/Modulo) alla posizione del soggetto nel Quadro EA,
  quota di devoluzione e valore quota = valore bene * quota.
*/
function devoluzione(
  name: string,
  eredi: ExtractedPerson[],
  beneValore: number | null,
  indent: string,
): string {
  const i2 = indent + "  ";
  const i3 = i2 + "  ";
  const rows = eredi
    .map((e, idx) => {
      const q = parseQuota(e.quota_eredita, eredi.length);
      const quotaValore =
        beneValore !== null ? fmtAmount((beneValore * q.num) / q.den) : null;
      const inner =
        wrap(
          "suc:IdentificazioneSoggetto",
          el("suc:Rigo", String(idx + 1), i3 + "  ") +
            el("suc:Modulo", "1", i3 + "  "),
          i3,
        ) +
        wrap(
          "suc:Quota",
          wrap(
            "suc:QuotaElementi",
            el("suc:QuotaNumeratore", String(q.num), i3 + "    ") +
              el("suc:QuotaDenominatore", String(q.den), i3 + "    "),
            i3 + "  ",
          ) + el("suc:QuotaValore", quotaValore, i3 + "  "),
          i3,
        ) +
        el("suc:CodiceDiritto_Rip", "1", i3);
      return wrap("suc:Devoluzione", inner, i2);
    })
    .join("");
  return wrap(`suc:${name}`, rows, indent);
}

/* --------------------------- valori immobili ------------------------------- */

/*
  Valore ai fini dell'imposta: logica condivisa in lib/catasto.ts (usata anche
  dal calcolatore pubblico /strumenti/valore-catastale). Moltiplicatori
  verificati sul file reale: A2 e C6 x120.
*/
function valoreFabbricato(
  rendita: string | null | undefined,
  categoria: string | null | undefined,
  primaCasa: boolean,
): number | null {
  const r = parseAmount(rendita);
  if (r === null) return null;
  return valoreCatastaleFabbricato(r, categoria, primaCasa);
}

function valoreTerreno(redditoDominicale: string | null | undefined): number | null {
  const rd = parseAmount(redditoDominicale);
  if (rd === null) return null;
  return valoreCatastaleTerreno(rd);
}

/* -------------------------------- build ----------------------------------- */

// Allegato per il Quadro EG (il tracciato accetta SOLO pdf e tif/tiff).
export type SucAllegato = {
  category: "Testamento" | "AlberoGenealogico" | "DocumentiIdentita" | "Altro";
  fileName: string;
  description: string;
  base64: string;
  mime: "application/pdf" | "image/tif" | "image/tiff";
};

export type SucBuildResult = {
  xml: string;
  fileName: string;
  warnings: string[];
};

export function buildSucXml(
  practice: PracticeRow,
  data: ExtractionData,
  options: { cfFornitore?: string; allegati?: SucAllegato[] } = {},
): SucBuildResult {
  const warnings: string[] = [];
  const d = data.defunto;
  const cfDefunto = upper(d.codice_fiscale) || upper(practice.deceased_cf);
  if (!cfDefunto) warnings.push("Codice fiscale del defunto mancante (obbligatorio).");

  const eredi = data.eredi.filter((e) => e.cognome || e.nome || e.codice_fiscale);
  if (eredi.length === 0) warnings.push("Nessun erede nei dati: il Quadro EA risulta vuoto.");
  for (const e of eredi) {
    const nome = [e.cognome, e.nome].filter(Boolean).join(" ") || "senza nome";
    if (!e.codice_fiscale) warnings.push(`Erede ${nome}: codice fiscale mancante.`);
    if (!gradoParentelaCode(e.grado_parentela))
      warnings.push(
        `Erede ${nome}: grado di parentela non mappato ("${e.grado_parentela ?? ""}"), impostarlo nel software AdE.`,
      );
  }

  // Presentatore/dichiarante = cliente/erede referente (match sul nome, best-effort).
  const clientName = practice.client_name.toLowerCase();
  const presentatore =
    eredi.find((e) =>
      [e.nome, e.cognome]
        .filter(Boolean)
        .every((part) => clientName.includes((part as string).toLowerCase())),
    ) ?? eredi[0];
  if (!presentatore) warnings.push("Presentatore non individuato tra gli eredi.");

  const oggi = dateToSuc(new Date().toISOString().slice(0, 10));
  const cfFornitore = upper(options.cfFornitore);
  if (!cfFornitore)
    warnings.push("CF dell'intermediario Entratel mancante: impostare SUC_CF_FORNITORE.");

  const i = "  ";
  const iF = i + i + i + i; // indent dentro Frontespizio
  const iQ = i + i + i; // indent dei quadri

  /* --- Frontespizio ---------------------------------------------------------- */

  const presentatoreXml = presentatore
    ? wrap(
        "suc:Presentatore",
        el("suc:CodiceFiscale", upper(presentatore.codice_fiscale), iF + "  ") +
          el("suc:CodiceCarica", "1", iF + "  ") + // 1 = erede
          anagrafica(
            {
              cognome: presentatore.cognome,
              nome: presentatore.nome,
              sesso: presentatore.sesso,
              cf: presentatore.codice_fiscale,
              dataNascita: presentatore.data_nascita,
              comuneNascita: presentatore.comune_nascita,
              provinciaNascita: presentatore.provincia_nascita,
            },
            iF + "  ",
          ) +
          el("suc:Telefono", practice.client_phone.replace(/\D/g, "") || null, iF + "  ") +
          el("suc:Email", upper(practice.client_email), iF + "  "),
        iF,
      )
    : "";

  const terreni = data.immobili.filter((im) => (im.catasto ?? "").toLowerCase().includes("terr"));
  const fabbricati = data.immobili.filter((im) => !(im.catasto ?? "").toLowerCase().includes("terr"));
  const rendite = data.rapporti_bancari;

  // Caselle firma: una per ogni quadro effettivamente presente nel file
  // (nei file reali sono barrate solo quelle dei quadri compilati).
  const firmaModello =
    wrap(
      "suc:FirmaModello",
      (eredi.length ? el("suc:CasellaEA", "1", iF + "  ") : "") +
        (terreni.length ? el("suc:CasellaEB", "1", iF + "  ") : "") +
        (fabbricati.length ? el("suc:CasellaEC", "1", iF + "  ") : "") +
        el("suc:CasellaEE", "1", iF + "  ") +
        ((options.allegati?.length ?? 0) > 0 ? el("suc:CasellaEG", "1", iF + "  ") : "") +
        (presentatore ? el("suc:CasellaEH", "1", iF + "  ") : "") +
        (rendite.length ? el("suc:CasellaER", "1", iF + "  ") : "") +
        el("suc:FirmaDichiarante", "1", iF + "  "),
      iF,
    );

  const frontespizio = wrap(
    "suc:Frontespizio",
    el("suc:CodiceFiscaleDefunto", cfDefunto, iF) +
      wrap(
        "suc:TipoDichiarazione",
        el("suc:PrimaDichiarazione", "1", iF + "  ") +
          wrap(
            "suc:Devoluzione",
            el(
              data.testamento.presente ? "suc:DevoluzionePerTestamento" : "suc:DevoluzionePerLegge",
              "1",
              iF + "    ",
            ),
            iF + "  ",
          ),
        iF,
      ) +
      wrap("suc:Beneficiari", el("suc:NumeroEredi", String(eredi.length || 1), iF + "  "), iF) +
      wrap(
        "suc:DatiDefunto",
        anagrafica(
          {
            cognome: d.cognome ?? practice.deceased_name.split(" ").slice(-1)[0],
            nome: d.nome,
            sesso: d.sesso,
            cf: cfDefunto,
            dataNascita: d.data_nascita,
            comuneNascita: d.comune_nascita,
            provinciaNascita: d.provincia_nascita,
          },
          iF + "  ",
        ) +
          wrap(
            "suc:UlterioriDati",
            el("suc:DataDecesso", dateToSuc(d.data_decesso ?? practice.date_of_death), iF + "    ") +
              el("suc:StatoCivile", statoCivileCode(d.stato_civile), iF + "    "),
            iF + "  ",
          ),
        iF,
      ) +
      presentatoreXml +
      firmaModello +
      wrap(
        "suc:CasiParticolari",
        el("suc:CopiaConforme", "1", iF + "  ") + el("suc:FirmaDichiarante", "1", iF + "  "),
        iF,
      ) +
      wrap(
        "suc:ImpegnoATrasmettere",
        el("reg:CFintermediario", cfFornitore, iF + "  ") +
          el("reg:ImpegnoATrasmettere", "2", iF + "  ") + // 2 = dich. predisposta dall'intermediario
          el("reg:DataImpegno", oggi, iF + "  ") +
          el("reg:FirmaIntermediario", "1", iF + "  "),
        iF,
      ),
    iQ,
  );

  /* --- Quadro EA (eredi) ------------------------------------------------------ */

  const soggetti = eredi
    .map((e) =>
      wrap(
        "suc:Soggetto",
        el("suc:CodiceFiscale", upper(e.codice_fiscale), iF + "  ") +
          el("suc:TipoSoggetto", "1", iF + "  ") + // 1 = erede
          el("suc:GradoParentela", gradoParentelaCode(e.grado_parentela), iF + "  ") +
          anagrafica(
            {
              cognome: e.cognome,
              nome: e.nome,
              sesso: e.sesso,
              cf: e.codice_fiscale,
              dataNascita: e.data_nascita,
              comuneNascita: e.comune_nascita,
              provinciaNascita: e.provincia_nascita,
            },
            iF + "  ",
          ),
        iF,
      ),
    )
    .join("");
  const quadroEA = wrap("suc:QuadroEA", wrap("suc:Modulo", soggetti, iF.slice(2)), iQ);

  /* --- Quadri EB (terreni) / EC (fabbricati) ---------------------------------- */

  function luogoXml(im: ExtractedImmobile, indent: string): string {
    const i2 = indent + "  ";
    return wrap(
      "suc:Luogo",
      el("reg:Provincia", upper(im.provincia).slice(0, 2) || null, i2) +
        wrap(
          "reg:Italia",
          el("reg:ComuneAmministrativo", upper(im.comune), i2 + "  ") +
            el("reg:CodiceComune", upper(im.codice_comune), i2 + "  ") +
            el("reg:Indirizzo", upper(im.indirizzo), i2 + "  ") +
            el("reg:CodiceComuneAmministrativo", upper(im.codice_comune), i2 + "  "),
          i2,
        ),
      indent,
    );
  }

  function possessoXml(im: ExtractedImmobile, indent: string): string {
    const q = parseQuota(im.quota_possesso, 1);
    return wrap(
      "suc:Possesso",
      el("suc:PossessoNumeratore", fmtAmount(q.num), indent + "  ") +
        el("suc:PossessoDenominatore", String(q.den), indent + "  "),
      indent,
    );
  }

  // "2 are 40 ca" / "2.40" / "240 mq" -> are + centiare (come nel file reale).
  function parseSuperficie(raw: string | null | undefined): { are: string; centiare: string } | null {
    const v = (raw ?? "").toLowerCase().trim();
    if (!v) return null;
    let m = v.match(/(\d+)\s*ar?e?\D+(\d+)\s*(?:ca|centiare)?/);
    if (m) return { are: m[1], centiare: m[2] };
    m = v.match(/^(\d+)[.,](\d{1,2})$/);
    if (m) return { are: m[1], centiare: m[2] };
    m = v.match(/^(\d+)\s*(?:mq|m2)?$/);
    if (m) {
      const mq = Number(m[1]);
      return { are: String(Math.floor(mq / 100)), centiare: String(mq % 100) };
    }
    return null;
  }

  let totaleImmobili = 0;

  function terrenoXml(im: ExtractedImmobile, indent: string): string {
    const i2 = indent + "  ";
    const rif = `Terreno fg.${im.foglio ?? "?"} part.${im.particella ?? "?"}`;
    if (!im.codice_comune) warnings.push(`${rif}: codice comune catastale mancante.`);
    const valore = parseAmount(im.valore) !== null
      ? Math.round(parseAmount(im.valore) as number)
      : valoreTerreno(im.rendita);
    if (valore === null) {
      warnings.push(`${rif}: reddito dominicale mancante, VALORE da inserire nel software AdE.`);
    } else if (parseAmount(im.valore) === null) {
      warnings.push(
        `${rif}: valore ${valore} EUR calcolato come non edificabile (RD x1,25 x90). Se edificabile va indicato il valore venale.`,
      );
    }
    if (valore !== null) totaleImmobili += valore;
    const superficie = parseSuperficie(im.consistenza);
    const inner =
      luogoXml(im, i2) +
      wrap(
        "suc:DatiTerreni",
        wrap(
          "reg:DatiCatastali",
          el("reg:Foglio", im.foglio, i2 + "    ") +
            el("reg:Particella", im.particella, i2 + "    ") +
            el("reg:Subalterno", im.subalterno, i2 + "    "),
          i2 + "  ",
        ) +
          wrap(
            "reg:DatiTerreni",
            (superficie
              ? wrap(
                  "reg:Superficie",
                  el("reg:SuperficieAre", superficie.are, i2 + "      ") +
                    el("reg:SuperficieCentiare", superficie.centiare, i2 + "      "),
                  i2 + "    ",
                )
              : "") +
              el("reg:Natura", upper(im.categoria).slice(0, 1) || "T", i2 + "    ") +
              el("reg:RedditoDominicale", im.rendita, i2 + "    "),
            i2 + "  ",
          ),
        i2,
      ) +
      possessoXml(im, i2) +
      el("suc:CodiceDiritto_P", "1", i2) +
      el("suc:TipologiaTerreno", "3", i2) + // 3 = non edificabile (default prudente)
      (valore !== null ? el("suc:Valore", String(valore), i2) : "") +
      devoluzione("DevoluzioneEB", eredi, valore, i2);
    return wrap("suc:Terreni", inner, indent);
  }

  function fabbricatoXml(im: ExtractedImmobile, indent: string): string {
    const i2 = indent + "  ";
    const rif = `Fabbricato ${im.comune ?? ""} fg.${im.foglio ?? "?"} part.${im.particella ?? "?"} sub.${im.subalterno ?? "-"}`;
    if (!im.codice_comune) warnings.push(`${rif}: codice comune catastale mancante.`);
    const primaCasa = /^s[iì]/i.test((im.prima_casa ?? "").trim());
    const valore = parseAmount(im.valore) !== null
      ? Math.round(parseAmount(im.valore) as number)
      : valoreFabbricato(im.rendita, im.categoria, primaCasa);
    if (valore === null) {
      warnings.push(`${rif}: rendita catastale mancante, VALORE da inserire nel software AdE.`);
    } else if (parseAmount(im.valore) === null) {
      warnings.push(
        `${rif}: valore ${valore} EUR calcolato (rendita x1,05 x${primaCasa ? "110 prima casa - ricordati l'agevolazione P nel software AdE" : "coefficiente standard di categoria"}).`,
      );
    }
    if (valore !== null) totaleImmobili += valore;
    const inner =
      luogoXml(im, i2) +
      wrap(
        "suc:DatiFabbricati",
        wrap(
          "reg:DatiCatastali",
          el("reg:Foglio", im.foglio, i2 + "    ") +
            el("reg:Particella", im.particella, i2 + "    ") +
            el("reg:Subalterno", im.subalterno, i2 + "    "),
          i2 + "  ",
        ) +
          wrap(
            "reg:DatiFabbricati",
            el("reg:CategoriaCatastale", upper(im.categoria).replace("/", ""), i2 + "    ") +
              el("reg:Classe", im.classe, i2 + "    ") +
              el("reg:Consistenza", im.consistenza, i2 + "    ") +
              el("reg:RenditaCatastale", im.rendita, i2 + "    "),
            i2 + "  ",
          ),
        i2,
      ) +
      possessoXml(im, i2) +
      el("suc:CodiceDiritto_P", "1", i2) +
      (valore !== null ? el("suc:Valore", String(valore), i2) : "") +
      devoluzione("DevoluzioneEC", eredi, valore, i2);
    return wrap("suc:Fabbricati", inner, indent);
  }

  const quadroEB = wrap(
    "suc:QuadroEB",
    terreni.length ? wrap("suc:Modulo", terreni.map((t) => terrenoXml(t, iF)).join(""), iF.slice(2)) : "",
    iQ,
  );
  const quadroEC = wrap(
    "suc:QuadroEC",
    fabbricati.length
      ? wrap("suc:Modulo", fabbricati.map((f) => fabbricatoXml(f, iF)).join(""), iF.slice(2))
      : "",
    iQ,
  );

  /* --- Quadro ER (conti correnti, libretti, crediti) --------------------------- */

  const renditeXml = rendite
    .map((r) => {
      const valore = parseAmount(r.saldo);
      const descr = [r.tipo, r.riferimento ? `N. ${r.riferimento}` : null, r.istituto]
        .filter(Boolean)
        .join(" ")
        .toUpperCase();
      if (valore === null)
        warnings.push(`Rapporto "${descr || "senza descrizione"}": saldo non leggibile, valore da inserire nel software AdE.`);
      const inner =
        el("suc:TipoCespite", "CR", iF + "  ") + // CR = crediti/conti (dai file reali)
        el("suc:Descrizione", descr.slice(0, 100) || "RAPPORTO BANCARIO", iF + "  ") +
        wrap(
          "suc:Possesso",
          el("suc:PossessoNumeratore", "1,00", iF + "    ") +
            el("suc:PossessoDenominatore", "1", iF + "    "),
          iF + "  ",
        ) +
        el("suc:CodiceDiritto_P", "1", iF + "  ") +
        (valore !== null ? el("suc:Valore", String(Math.round(valore)), iF + "  ") : "") +
        devoluzione("DevoluzioneER", eredi, valore, iF + "  ");
      return wrap("suc:Rendite", inner, iF);
    })
    .join("");
  const quadroER = wrap("suc:QuadroER", wrap("suc:Modulo", renditeXml, iF.slice(2)), iQ);

  /* --- Quadro EE (riepilogo attivo) -------------------------------------------- */

  const totaleRendite = rendite.reduce((sum, r) => sum + (parseAmount(r.saldo) ?? 0), 0);
  const altriBeniTot = data.altri_beni.reduce((sum, b) => sum + (parseAmount(b.valore) ?? 0), 0);
  if (data.altri_beni.length > 0)
    warnings.push(`${data.altri_beni.length} "altri beni" rilevati: inserirli nel quadro pertinente del software AdE.`);
  warnings.push("Quadri NON generati automaticamente: ED (passivita es. spese funebri) ed EF (liquidazione imposte): completarli/calcolarli nel software AdE.");

  const totAltri = Math.round(totaleRendite + altriBeniTot);
  const totAttivo = totaleImmobili + totAltri;
  const quadroEE = totAttivo
    ? wrap(
        "suc:QuadroEE",
        (totaleImmobili ? el("suc:TotaleValoreImmobili", String(totaleImmobili), iF) : "") +
          (totAltri ? el("suc:TotaleValoreAltriBeni", String(totAltri), iF) : "") +
          el("suc:TotaleAttivo", String(totAttivo), iF) +
          el("suc:TotaleValoreAsseEreditarioNetto", String(totAttivo), iF),
        iQ,
      )
    : "";

  /* --- Quadro EG (allegati) ------------------------------------------------------
     Il tracciato accetta solo application/pdf e image/tif(f): i JPG/PNG vanno
     convertiti (segnalato a monte, in exportSucXml). Categorie in ordine XSD. */

  const allegati = options.allegati ?? [];

  function categoriaEG(cat: SucAllegato["category"]): string {
    const items = allegati.filter((a) => a.category === cat);
    if (items.length === 0) return "";
    const i2 = iF + "  ";
    const inner =
      el(`suc:${cat}Num`, String(items.length), i2) +
      items
        .map((a) =>
          wrap(
            `suc:${cat}All`,
            el("reg:FileType", a.mime, i2 + "  ") +
              el("reg:FileName", a.fileName.slice(0, 100).toUpperCase(), i2 + "  ") +
              el("reg:FileDescription", a.description.slice(0, 100).toUpperCase(), i2 + "  ") +
              el("reg:ImageData", a.base64, i2 + "  "),
            i2,
          ),
        )
        .join("");
    return wrap(`suc:${cat}`, inner, iF);
  }

  const quadroEG = wrap(
    "suc:QuadroEG",
    categoriaEG("Testamento") +
      categoriaEG("AlberoGenealogico") +
      categoriaEG("DocumentiIdentita") +
      categoriaEG("Altro"),
    iQ,
  );

  /* --- Quadro EH (dichiarazioni sostitutive) -------------------------------------
     Ricalcato sui file reali: presentatore (anagrafica reg + CF), defunto con
     luogo del decesso, flag di assenza testamento/interdetti/rinuncia. */

  const comuneDecesso = upper(d.comune_decesso) || upper(d.comune_ultima_residenza);
  const provDecesso = (upper(d.provincia_decesso) || upper(d.provincia_ultima_residenza)).slice(0, 2);
  if (!upper(d.comune_decesso) && comuneDecesso)
    warnings.push("Quadro EH: luogo del decesso non estratto, usata l'ultima residenza del defunto: verificare col certificato di morte.");
  if (!comuneDecesso)
    warnings.push("Quadro EH: comune del decesso mancante (obbligatorio): integrarlo nel software AdE.");

  const eh = iF + "  "; // dentro SezioneI_DichSost
  const anagraficaReg = (p: {
    cognome?: string | null; nome?: string | null; sesso?: string | null; cf?: string | null;
    dataNascita?: string | null; comuneNascita?: string | null; provinciaNascita?: string | null;
  }, indent: string) =>
    el("reg:Cognome", upper(p.cognome), indent) +
    el("reg:Nome", upper(p.nome), indent) +
    el("reg:Sesso", upper(p.sesso).slice(0, 1) || sexFromCf(p.cf), indent) +
    el("reg:DataNascita", dateToSuc(p.dataNascita), indent) +
    el("reg:ComuneNascita", upper(p.comuneNascita), indent) +
    el("reg:ProvinciaNascita", upper(p.provinciaNascita).slice(0, 2) || null, indent);

  const ehEredi = eredi.filter((e) => e !== presentatore);
  if (ehEredi.length > 3)
    warnings.push(`Quadro EH: il tracciato accetta al massimo 3 eredi oltre al dichiarante (qui ${ehEredi.length}): gli eccedenti vanno gestiti nel software AdE.`);

  const quadroEH = presentatore
    ? wrap(
        "suc:QuadroEH",
        wrap(
          "suc:PrimoModulo",
          wrap(
            "suc:SezioneI_DichSost",
            wrap(
              "suc:Presentatore",
              anagraficaReg(
                {
                  cognome: presentatore.cognome, nome: presentatore.nome, sesso: presentatore.sesso,
                  cf: presentatore.codice_fiscale, dataNascita: presentatore.data_nascita,
                  comuneNascita: presentatore.comune_nascita, provinciaNascita: presentatore.provincia_nascita,
                },
                eh + "  ",
              ) +
                el("suc:CodiceFiscale", upper(presentatore.codice_fiscale), eh + "  ") +
                el("suc:CodiceCarica", "1", eh + "  "),
              eh,
            ) +
              wrap(
                "suc:DatiDefunto",
                wrap(
                  "suc:DatiAnagrafici",
                  anagraficaReg(
                    {
                      cognome: d.cognome ?? practice.deceased_name.split(" ").slice(-1)[0],
                      nome: d.nome, sesso: d.sesso, cf: cfDefunto, dataNascita: d.data_nascita,
                      comuneNascita: d.comune_nascita, provinciaNascita: d.provincia_nascita,
                    },
                    eh + "    ",
                  ),
                  eh + "  ",
                ) +
                  wrap(
                    "suc:Decesso",
                    el("suc:FlagDeceduto", "1", eh + "    ") +
                      el("suc:DataDecesso", dateToSuc(d.data_decesso ?? practice.date_of_death), eh + "    ") +
                      el("suc:Comune", comuneDecesso, eh + "    ") +
                      el("suc:Provincia", provDecesso || null, eh + "    "),
                    eh + "  ",
                  ),
                eh,
              ) +
              wrap("suc:Dichiarante", el("suc:PresenzaDichiarante", "1", eh + "  "), eh) +
              ehEredi
                .slice(0, 3)
                .map((e) =>
                  wrap(
                    "suc:Eredi",
                    el("suc:CodiceFiscale", upper(e.codice_fiscale), eh + "  ") +
                      el("suc:GradoParentela", gradoParentelaCode(e.grado_parentela), eh + "  ") +
                      wrap("suc:DatiAnagrafici", anagraficaReg(
                        {
                          cognome: e.cognome, nome: e.nome, sesso: e.sesso, cf: e.codice_fiscale,
                          dataNascita: e.data_nascita, comuneNascita: e.comune_nascita,
                          provinciaNascita: e.provincia_nascita,
                        },
                        eh + "    ",
                      ), eh + "  "),
                    eh,
                  ),
                )
                .join("") +
              wrap(
                "suc:Testamento",
                data.testamento.presente
                  ? wrap("suc:PresenzaTestamento", el("suc:FlagTestamento", "1", eh + "    "), eh + "  ")
                  : el("suc:FlagAssenzaTestamento", "1", eh + "  "),
                eh,
              ) +
              wrap("suc:Interdetti", el("suc:FlagAssenzaInterdetti", "1", eh + "  "), eh) +
              wrap("suc:Rinuncia", el("suc:FlagAssenzaRinuncia", "1", eh + "  "), eh) +
              el("suc:FirmaDichiarante", "1", eh),
            iF + "",
          ),
          iF.slice(2) + "",
        ),
        iQ,
      )
    : "";
  if (quadroEH)
    warnings.push("Quadro EH generato con flag standard (nessun interdetto, nessuna rinuncia): verificare che corrispondano al caso reale.");

  /* --- busta finale ------------------------------------------------------------ */

  const dichiarazione = wrap(
    "suc:Dichiarazione",
    frontespizio + quadroEA + quadroEB + quadroEC + quadroEE + quadroEG + quadroEH + quadroER,
    i + i,
    ' identificativo="00001"',
  );

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<tm:Messaggio xmlns:tm="${NS.tm}" xmlns:cm="${NS.cm}" xmlns:reg="${NS.reg}" xmlns:sc="${NS.sc}" xmlns:suc="${NS.suc}">\n` +
    wrap(
      "tm:Intestazione",
      el("tm:CodiceFiscaleFornitore", cfFornitore, i + "  "),
      i,
    ) +
    wrap(
      "tm:Contenuto",
      wrap(
        "suc:Fornitura",
        wrap("suc:Intestazione", el("suc:TipoFornitore", "10", i + i + i + "  "), i + i + i) +
          dichiarazione,
        i + i,
      ),
      i,
      ' CodiceFornitura="SUC13"',
    ) +
    `</tm:Messaggio>\n`;

  const fileName = `${cfDefunto || "SENZA_CF"}_SUC13.suc`;
  return { xml, fileName, warnings: [...new Set(warnings)] };
}
