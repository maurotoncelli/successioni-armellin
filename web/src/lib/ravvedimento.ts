/*
  Ravvedimento operoso per la dichiarazione di successione: logica pura,
  senza dipendenze, usata dal calcolatore pubblico /strumenti/ravvedimento-operoso.

  Fonti:
  - art. 50 D.Lgs. 346/1990 (TUS) come modificato dal D.Lgs. 87/2024
    (violazioni dal 1/9/2024): omessa dichiarazione 120% dell'imposta
    (fissa 250-1.000 € se non e' dovuta imposta); ritardo <= 30 giorni 45%
    (fissa 150-500 €). Regime precedente: 120-240% e 60-120% (si applica
    il minimo).
  - art. 13 D.Lgs. 471/1997: omesso/tardivo versamento 25% (30% ante
    riforma), ridotto alla meta' se il ritardo non supera 90 giorni e a
    1/15 per giorno se non supera 14 giorni.
  - art. 13 D.Lgs. 472/1997: riduzioni da ravvedimento 1/10 (30 gg),
    1/9 (90 gg), 1/8 (1 anno), 1/7 (oltre; ante riforma entro 2 anni),
    1/6 (ante riforma oltre 2 anni). Per la dichiarazione tardiva entro
    90 giorni: 1/10 del minimo (lett. c).
  - Interessi legali (art. 1284 c.c.) al tasso vigente anno per anno,
    calcolati a giorni su base 365.

  Le percentuali applicate seguono la prassi degli uffici (scheda tecnica
  Geonetwork n. 276, circolare AdE 16/4/2025): la sanzione per tardiva
  dichiarazione si commisura alla sola imposta di successione; sulle altre
  imposte versate in ritardo (ipotecaria, catastale, bollo, tributi) si
  applica la sanzione da tardivo versamento.
*/

/** Saggio degli interessi legali per anno (decimale). */
export const TASSI_LEGALI: Record<number, number> = {
  2015: 0.005,
  2016: 0.002,
  2017: 0.001,
  2018: 0.003,
  2019: 0.008,
  2020: 0.0005,
  2021: 0.0001,
  2022: 0.0125,
  2023: 0.05,
  2024: 0.025,
  2025: 0.02,
  2026: 0.016,
};

export const ULTIMO_ANNO_TASSO_NOTO = Math.max(
  ...Object.keys(TASSI_LEGALI).map(Number),
);

/** Violazioni commesse da questa data: regime D.Lgs. 87/2024. */
export const DATA_RIFORMA_SANZIONI = "2024-09-01";

export type Regime = "pre" | "post";
export type Frazione = "1/10" | "1/9" | "1/8" | "1/7" | "1/6";

const FRAZIONI: Record<Frazione, number> = {
  "1/10": 1 / 10,
  "1/9": 1 / 9,
  "1/8": 1 / 8,
  "1/7": 1 / 7,
  "1/6": 1 / 6,
};

const MS_DAY = 86_400_000;

/** "YYYY-MM-DD" -> Date UTC a mezzanotte (evita problemi di fuso). */
export function parseIsoDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Termine di presentazione: 12 mesi dall'apertura della successione. */
export function terminePresentazione(decesso: Date): Date {
  return new Date(
    Date.UTC(
      decesso.getUTCFullYear() + 1,
      decesso.getUTCMonth(),
      decesso.getUTCDate(),
    ),
  );
}

export function giorniTra(da: Date, a: Date): number {
  return Math.round((a.getTime() - da.getTime()) / MS_DAY);
}

export function regimePerScadenza(scadenza: Date): Regime {
  return toIsoDate(scadenza) >= DATA_RIFORMA_SANZIONI ? "post" : "pre";
}

/** Riduzione da ravvedimento in base ai giorni di ritardo (art. 13 D.Lgs. 472/97). */
export function frazioneRavvedimento(giorni: number, regime: Regime): Frazione {
  if (giorni <= 30) return "1/10";
  if (giorni <= 90) return "1/9";
  if (giorni <= 365) return "1/8";
  if (regime === "post") return "1/7";
  if (giorni <= 730) return "1/7";
  return "1/6";
}

export type SanzioneDichiarazione = {
  /** Sanzione minima in % dell'imposta (0.45 / 0.60 / 1.20) o null se fissa. */
  aliquota: number | null;
  /** Sanzione fissa minima (150 o 250 €) quando non e' dovuta imposta. */
  fissa: number | null;
  frazione: Frazione;
  importo: number;
};

/**
 * Sanzione per tardiva/omessa dichiarazione di successione, gia' ridotta.
 * Base: imposta di successione dovuta (0 = sanzione fissa).
 */
export function sanzioneDichiarazione(
  giorni: number,
  regime: Regime,
  impostaSuccessione: number,
): SanzioneDichiarazione {
  const entro30 = giorni <= 30;
  const senzaImposta = impostaSuccessione <= 0;

  if (senzaImposta) {
    const fissa = entro30 ? 150 : 250;
    // Dichiarazione presentata entro 90 giorni: 1/10 del minimo (lett. c);
    // oltre: riduzioni ordinarie.
    const frazione: Frazione =
      giorni <= 90 ? "1/10" : frazioneRavvedimento(giorni, regime);
    return {
      aliquota: null,
      fissa,
      frazione,
      importo: round2(fissa * FRAZIONI[frazione]),
    };
  }

  const aliquota = entro30 ? (regime === "post" ? 0.45 : 0.6) : 1.2;
  const frazione = frazioneRavvedimento(giorni, regime);
  return {
    aliquota,
    fissa: null,
    frazione,
    importo: round2(impostaSuccessione * aliquota * FRAZIONI[frazione]),
  };
}

export type SanzioneVersamento = {
  /** Sanzione piena applicabile prima della riduzione (decimale). */
  aliquota: number;
  frazione: Frazione;
  importo: number;
};

/** Sanzione per tardivo versamento (art. 13 D.Lgs. 471/97), gia' ridotta. */
export function sanzioneVersamento(
  giorni: number,
  regime: Regime,
  imposta: number,
): SanzioneVersamento {
  const piena = regime === "post" ? 0.25 : 0.3;
  let aliquota: number;
  if (giorni <= 14) aliquota = (piena / 2 / 15) * giorni;
  else if (giorni <= 90) aliquota = piena / 2;
  else aliquota = piena;
  const frazione = frazioneRavvedimento(giorni, regime);
  return {
    aliquota,
    frazione,
    importo: round2(imposta * aliquota * FRAZIONI[frazione]),
  };
}

export type InteressiAnno = { anno: number; giorni: number; tasso: number; importo: number };

export type Interessi = {
  importo: number;
  dettaglio: InteressiAnno[];
  /** true se per qualche anno si e' usato l'ultimo tasso noto. */
  tassoStimato: boolean;
};

/**
 * Interessi legali a giorni (base 365) dal giorno successivo alla scadenza
 * al giorno del pagamento incluso, con il tasso vigente in ciascun anno.
 */
export function interessiLegali(
  capitale: number,
  scadenza: Date,
  pagamento: Date,
): Interessi {
  const dettaglio: InteressiAnno[] = [];
  let tassoStimato = false;
  if (capitale <= 0 || pagamento <= scadenza) {
    return { importo: 0, dettaglio, tassoStimato };
  }
  // `cursore` e' l'ultimo giorno gia' conteggiato (escluso): il segmento
  // dell'anno va dal giorno successivo al 31/12 incluso.
  let cursore = scadenza;
  while (cursore < pagamento) {
    const anno = new Date(cursore.getTime() + MS_DAY).getUTCFullYear();
    const fineAnno = new Date(Date.UTC(anno, 11, 31));
    const fineSegmento = pagamento < fineAnno ? pagamento : fineAnno;
    const giorni = giorniTra(cursore, fineSegmento);
    let tasso = TASSI_LEGALI[anno];
    if (tasso === undefined) {
      tasso = TASSI_LEGALI[ULTIMO_ANNO_TASSO_NOTO];
      tassoStimato = true;
    }
    if (giorni > 0) {
      dettaglio.push({
        anno,
        giorni,
        tasso,
        importo: (capitale * tasso * giorni) / 365,
      });
    }
    cursore = fineSegmento;
  }
  const importo = round2(dettaglio.reduce((s, r) => s + r.importo, 0));
  return { importo, dettaglio, tassoStimato };
}

export type RavvedimentoInput =
  | {
      tipo: "dichiarazione";
      /** Data del decesso (apertura della successione). */
      decesso: Date;
      /** Data prevista di presentazione e pagamento. */
      regolarizzazione: Date;
      impostaSuccessione: number;
      /** Ipotecaria, catastale, bollo, tributi speciali da versare con la dichiarazione. */
      altreImposte: number;
    }
  | {
      tipo: "versamento";
      scadenza: Date;
      regolarizzazione: Date;
      importo: number;
    };

export type RavvedimentoResult = {
  scadenza: Date;
  regolarizzazione: Date;
  giorni: number;
  regime: Regime;
  /** Nei termini: nessuna sanzione. */
  neiTermini: boolean;
  imposte: number;
  sanzioneDichiarazione: SanzioneDichiarazione | null;
  sanzioneVersamento: SanzioneVersamento | null;
  interessi: Interessi;
  totaleSanzioni: number;
  totale: number;
};

export function calcolaRavvedimento(input: RavvedimentoInput): RavvedimentoResult {
  const scadenza =
    input.tipo === "dichiarazione"
      ? terminePresentazione(input.decesso)
      : input.scadenza;
  const regolarizzazione = input.regolarizzazione;
  const giorni = Math.max(0, giorniTra(scadenza, regolarizzazione));
  const regime = regimePerScadenza(scadenza);
  const imposte =
    input.tipo === "dichiarazione"
      ? Math.max(0, input.impostaSuccessione) + Math.max(0, input.altreImposte)
      : Math.max(0, input.importo);

  if (giorni <= 0) {
    return {
      scadenza,
      regolarizzazione,
      giorni: 0,
      regime,
      neiTermini: true,
      imposte,
      sanzioneDichiarazione: null,
      sanzioneVersamento: null,
      interessi: { importo: 0, dettaglio: [], tassoStimato: false },
      totaleSanzioni: 0,
      totale: round2(imposte),
    };
  }

  let sDich: SanzioneDichiarazione | null = null;
  let sVers: SanzioneVersamento | null = null;
  if (input.tipo === "dichiarazione") {
    sDich = sanzioneDichiarazione(giorni, regime, Math.max(0, input.impostaSuccessione));
    if (input.altreImposte > 0) {
      sVers = sanzioneVersamento(giorni, regime, input.altreImposte);
    }
  } else if (input.importo > 0) {
    sVers = sanzioneVersamento(giorni, regime, input.importo);
  }

  const interessi = interessiLegali(imposte, scadenza, regolarizzazione);
  const totaleSanzioni = round2((sDich?.importo ?? 0) + (sVers?.importo ?? 0));
  return {
    scadenza,
    regolarizzazione,
    giorni,
    regime,
    neiTermini: false,
    imposte,
    sanzioneDichiarazione: sDich,
    sanzioneVersamento: sVers,
    interessi,
    totaleSanzioni,
    totale: round2(imposte + totaleSanzioni + interessi.importo),
  };
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
