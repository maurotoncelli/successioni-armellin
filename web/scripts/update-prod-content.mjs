/*
  One-shot: allinea i contenuti in DATABASE (faqs, packages) alle correzioni
  di Lorenzo gia applicate alle fixture locali:
  - via "senza ricarichi", "imposte di Stato" -> "imposte"
  - "lo recuperiamo noi" -> "lo possiamo recuperare noi"
  - accenti mancanti (piu/più, e/è, ecc.)
  - nuova FAQ "agevolazione prima casa"
  Le pagine leggono queste tabelle su Supabase: senza questo script le
  correzioni varrebbero solo per i fallback locali.
  Uso: node scripts/update-prod-content.mjs [--dry]
*/
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

// Env da .env.local (script fuori da Next).
const envFile = readFileSync(resolve(import.meta.dirname, "..", ".env.local"), "utf8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l.includes("=") && !l.trimStart().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Config Supabase mancante in .env.local");
  process.exit(1);
}
const admin = createClient(url, key, { auth: { persistSession: false } });
const dry = process.argv.includes("--dry");

/* ------------------------------- FAQ ---------------------------------- */

// Match sulla domanda attuale (com'e nel seed) -> testi corretti.
const faqUpdates = [
  {
    match: "Cos'e la dichiarazione di successione?",
    question: "Cos'è la dichiarazione di successione?",
    answer:
      "È l'adempimento fiscale con cui si comunica all'Agenzia delle Entrate il patrimonio del defunto trasferito agli eredi. Va presentata di norma entro 12 mesi dal decesso.",
    sort_order: 1,
  },
  {
    match: "Entro quando va presentata?",
    question: "Entro quando va presentata?",
    answer:
      "Generalmente entro 12 mesi dalla data del decesso. Presentarla in ritardo può comportare sanzioni: ce ne occupiamo noi nei tempi corretti.",
    sort_order: 2,
  },
  {
    match: "Quanto costa il vostro servizio?",
    question: "Quanto costa il vostro servizio?",
    answer:
      "Paghi un onorario fisso in base al pacchetto. Le imposte sono separate, a carico dell'erede, e te le calcoliamo e comunichiamo prima dell'invio.",
    sort_order: 3,
  },
  {
    match: "Le imposte sono comprese nel prezzo?",
    question: "Le imposte sono comprese nel prezzo?",
    answer:
      "No: il prezzo del pacchetto è l'onorario professionale. Le imposte (successione, ipotecaria, catastale, bolli) si versano con F24 e sono separate. Te le calcoliamo noi prima.",
    sort_order: 4,
  },
  {
    match: "Posso farla gratis da solo sul sito dell'Agenzia?",
    question: "Posso farla gratis da solo sul sito dell'Agenzia?",
    answer:
      "Sì, esiste la successione precompilata gratuita ed è un'opzione onesta. Richiede però SPID e competenza: non valida i dati catastali e gli eventuali errori (e le sanzioni) restano a tuo carico.",
    category: "Perché non da soli",
    sort_order: 6,
  },
  {
    match: "Devo andare in qualche ufficio?",
    question: "Devo andare in qualche ufficio?",
    answer:
      "No. Questionario, documenti, comunicazioni e invio all'Agenzia avvengono online. C'è sempre una chiamata con Lorenzo per spiegarti tutto.",
    sort_order: 7,
  },
  {
    match: "Quali documenti servono?",
    question: "Quali documenti servono?",
    answer:
      "Dipende dal tuo caso: ti diamo una lista personalizzata. Se ti manca qualcosa, spesso lo possiamo recuperare noi (visure, atti di provenienza).",
    sort_order: 8,
  },
  {
    match: "Cosa ricevo a fine pratica?",
    question: "Cosa ricevo a fine pratica?",
    answer:
      "Ricevuta di presentazione/registrazione, copia della dichiarazione, esito F24 e, dove prevista, esito della voltura catastale, oltre alla nostra fattura.",
    sort_order: 9,
  },
];

const newFaq = {
  locale: "it",
  question: "Cos'è l'agevolazione prima casa in successione?",
  answer:
    "Se almeno un erede ha i requisiti prima casa sull'immobile ereditato, le imposte ipotecaria e catastale si pagano in misura fissa (200 euro ciascuna) invece che in percentuale sul valore catastale. Verifichiamo noi se ti spetta e la indichiamo in dichiarazione.",
  category: "Costi e imposte",
  sort_order: 5,
  is_published: true,
};

async function updateFaqs() {
  const { data: rows, error } = await admin.from("faqs").select("id, question");
  if (error) throw error;
  if (!rows || rows.length === 0) {
    console.log("faqs: tabella vuota (il sito usa le fixture), salto");
    return;
  }

  for (const upd of faqUpdates) {
    const row = rows.find(
      (r) => r.question === upd.match || r.question === upd.question,
    );
    if (!row) {
      console.log(`faqs: non trovata "${upd.match}" (forse gia modificata a mano), salto`);
      continue;
    }
    const { match, ...patch } = upd;
    console.log(`faqs: aggiorno "${match}"`);
    if (!dry) {
      const { error: e } = await admin.from("faqs").update(patch).eq("id", row.id);
      if (e) throw e;
    }
  }

  const exists = rows.some((r) => r.question === newFaq.question);
  if (exists) {
    console.log("faqs: FAQ prima casa gia presente, salto insert");
  } else {
    console.log(`faqs: inserisco "${newFaq.question}"`);
    if (!dry) {
      const { error: e } = await admin.from("faqs").insert(newFaq);
      if (e) throw e;
    }
  }
}

/* ----------------------------- Packages -------------------------------- */

// Rinomina 16/07: i vecchi nomi ("Completa"/"Zero Stress") facevano sembrare
// che i pacchetti inferiori includessero gia tutto; ora i nomi descrivono il
// perimetro (immobili) e il su misura ha la sua scheda dedicata sul sito.
const packageUpdates = [
  {
    key: "SEMPLICE",
    patch: {
      name: "Successione Semplice",
      tagline: "Solo conti e liquidità, nessun immobile",
      description:
        "La dichiarazione di successione predisposta e inviata all'Agenzia delle Entrate per i casi senza immobili: conti correnti, libretti e liquidità.",
      features: [
        "Predisposizione della dichiarazione",
        "Invio telematico all'Agenzia delle Entrate",
        "Calcolo delle imposte comunicato prima dell'invio",
        "Assistenza di una persona reale",
      ],
    },
  },
  {
    key: "COMPLETO",
    patch: {
      name: "Successione con Immobili",
      tagline: "Da 1 a 3 immobili, voltura catastale inclusa",
      description:
        "Il pacchetto per chi eredita una casa o pochi immobili: controllo dei dati catastali, dichiarazione, invio e voltura catastale. Copre fino a 5 eredi e 5 conti bancari.",
      features: [
        "Tutto quello del pacchetto Semplice",
        "Da 1 a 3 immobili, fino a 5 eredi e 5 conti",
        "Controllo dei dati catastali da geometra",
        "Voltura catastale inclusa",
      ],
      badge: "Il più scelto",
    },
  },
  {
    key: "ZERO_STRESS",
    patch: {
      name: "Successione Estesa",
      tagline: "Da 3 a 8 immobili, con recupero documenti",
      description:
        "Per i patrimoni più articolati: più immobili da gestire e documenti da recuperare. Ce ne occupiamo noi, con priorità di lavorazione e aggiornamenti a ogni step.",
      features: [
        "Tutto quello del pacchetto con Immobili",
        "Da 3 a 8 immobili, fino a 5 eredi e 5 conti",
        "Recupero dei documenti mancanti presso enti e banche",
        "Priorità di lavorazione",
      ],
    },
  },
];

async function updatePackages() {
  const { data: rows, error } = await admin.from("packages").select("key");
  if (error) throw error;
  if (!rows || rows.length === 0) {
    console.log("packages: tabella vuota (il sito usa le fixture), salto");
    return;
  }
  for (const upd of packageUpdates) {
    if (!rows.some((r) => r.key === upd.key)) continue;
    console.log(`packages: aggiorno ${upd.key}`);
    if (!dry) {
      const { error: e } = await admin
        .from("packages")
        .update(upd.patch)
        .eq("key", upd.key);
      if (e) throw e;
    }
  }
}

await updateFaqs();
await updatePackages();
console.log(dry ? "(dry run, nessuna scrittura)" : "Fatto.");
