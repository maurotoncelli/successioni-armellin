import type { PackageKey } from "@/lib/supabase/types";

/*
  Logica PURA di pre-valutazione del preventivo (nessun side-effect, nessun
  "server-only"): cosi puo girare sia lato client (form pubblico, risultato
  immediato senza round-trip) sia lato server (creazione lead/pratica).
  Allineata a @04: casi incerti/complessi -> preventivo su misura.
*/

export type Esito = "a" | "b" | "c";

/*
  Composizione degli eredi (ridisegno quiz): non piu "che parentela hai tu",
  ma "chi sono gli eredi" con un contatore per tipo. Serve per l'esonero
  art. 28 c.7 TUS, che vale solo se TUTTI gli eredi sono coniuge/linea retta.
*/
export type HeirsComposition = {
  coniuge: number;
  figli: number;
  genitori: number;
  fratelli: number;
  nipoti: number;
  altri: number;
};

export const emptyComposition: HeirsComposition = {
  coniuge: 0,
  figli: 0,
  genitori: 0,
  fratelli: 0,
  nipoti: 0,
  altri: 0,
};

const COMP_KEYS = [
  "coniuge",
  "figli",
  "genitori",
  "fratelli",
  "nipoti",
  "altri",
] as const;

export function totalHeirs(c: HeirsComposition): number {
  return COMP_KEYS.reduce((sum, k) => sum + c[k], 0);
}

// Coniuge e parenti in linea retta: eredi ammessi all'esonero art. 28 c.7 TUS
// (figli e genitori; fratelli, nipoti e altri lo escludono).
export function isAllDirectLine(c: HeirsComposition): boolean {
  return totalHeirs(c) > 0 && c.fratelli === 0 && c.nipoti === 0 && c.altri === 0;
}

/** Riepilogo leggibile, es. "Coniuge + 2 figli" (per CRM/email). */
export function heirsSummary(c: HeirsComposition): string {
  const parts: string[] = [];
  if (c.coniuge > 0) parts.push("Coniuge");
  if (c.figli > 0) parts.push(c.figli === 1 ? "1 figlio/a" : `${c.figli} figli`);
  if (c.genitori > 0)
    parts.push(c.genitori === 1 ? "1 genitore" : `${c.genitori} genitori`);
  if (c.fratelli > 0)
    parts.push(
      c.fratelli === 1 ? "1 fratello/sorella" : `${c.fratelli} fratelli/sorelle`,
    );
  if (c.nipoti > 0) parts.push(c.nipoti === 1 ? "1 nipote" : `${c.nipoti} nipoti`);
  if (c.altri > 0)
    parts.push(c.altri === 1 ? "1 altro erede" : `${c.altri} altri eredi`);
  return parts.join(" + ");
}

/** Serializzazione compatta per query string, es. "1.2.0.0.0.0". */
export function encodeHeirs(c: HeirsComposition): string {
  return COMP_KEYS.map((k) => c[k]).join(".");
}

export function decodeHeirs(raw: string | undefined): HeirsComposition | null {
  if (!raw) return null;
  const parts = raw.split(".").map((p) => Number.parseInt(p, 10));
  if (parts.length !== COMP_KEYS.length || parts.some((n) => !Number.isFinite(n) || n < 0)) {
    return null;
  }
  const c = { ...emptyComposition };
  COMP_KEYS.forEach((k, i) => {
    c[k] = Math.min(parts[i], 20);
  });
  return totalHeirs(c) > 0 ? c : null;
}

export function computeEsito(input: {
  hasWill: string;
  allDirectLine: boolean;
  hasRealEstate: string;
  hasOther: string;
  over100k?: string;
}): Esito {
  // Successione testamentaria -> preventivo su misura (coerente con le
  // condizioni di vendita: i pacchetti coprono le successioni legittime).
  if (input.hasWill === "si") return "c";
  if (input.hasOther === "si" || input.hasRealEstate === "nonso") return "c";
  if (input.hasRealEstate === "no" && input.allDirectLine) {
    // L'esonero art. 28 c.7 TUS vale solo con attivo ereditario <= 100.000 EUR:
    // sopra soglia la dichiarazione e' dovuta anche in linea retta -> Semplice.
    // Prudenza: l'esonero si suggerisce SOLO con un "no" esplicito; con
    // "si" o "non lo so" (o risposta mancante) meglio la dichiarazione.
    return input.over100k === "no" ? "a" : "b";
  }
  return "b";
}

export function suggestedPackage(
  esito: Esito,
  hasRealEstate?: string,
): PackageKey | null {
  if (esito === "a") return "SEMPLICE";
  // Esito b: il Completo ha senso solo se ci sono immobili (voltura inclusa);
  // senza immobili il caso rientra nel Semplice anche per parenti non in linea retta.
  if (esito === "b") return hasRealEstate === "no" ? "SEMPLICE" : "COMPLETO";
  return null; // su misura
}

export function isPackageKey(value: unknown): value is PackageKey {
  return value === "SEMPLICE" || value === "COMPLETO" || value === "ZERO_STRESS";
}
