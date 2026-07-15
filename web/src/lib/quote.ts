import type { PackageKey } from "@/lib/supabase/types";

/*
  Logica PURA di pre-valutazione del preventivo (nessun side-effect, nessun
  "server-only"): cosi puo girare sia lato client (form pubblico, risultato
  immediato senza round-trip) sia lato server (creazione lead/pratica).
  Allineata a @04: casi incerti/complessi -> preventivo su misura.
*/

export type Esito = "a" | "b" | "c";

export type QuizAnswers = {
  relation: string; // coniuge | figlio | genitore | fratello | nipote | altro
  heirs: string; // 1 | 2 | 3 | 4 | 5+
  hasRealEstate: string; // si | no | nonso
  realEstateCount?: number | null;
  hasWill: string; // si | no | nonso
  hasOther: string; // si | no | nonso
  over100k?: string; // si | no | nonso - attivo ereditario oltre 100.000 EUR
};

// Coniuge e parenti in linea retta (art. 28 c.7 TUS): rientrano nei casi di
// possibile esonero dalla dichiarazione quando non ci sono immobili, e comunque
// nei casi "lineari" da pacchetto Semplice.
export const directLineRelations = ["coniuge", "figlio", "genitore"];

export function computeEsito(input: {
  relation: string;
  hasRealEstate: string;
  hasOther: string;
  over100k?: string;
}): Esito {
  if (input.hasOther === "si" || input.hasRealEstate === "nonso") return "c";
  if (
    input.hasRealEstate === "no" &&
    directLineRelations.includes(input.relation)
  ) {
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
