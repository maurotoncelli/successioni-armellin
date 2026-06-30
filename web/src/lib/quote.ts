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
};

// Parenti in linea retta (discendenti/ascendenti): rientrano nei casi di
// possibile esonero dalla dichiarazione (art. 28 TUS) quando non ci sono immobili.
export const directLineRelations = ["figlio", "genitore"];

export function computeEsito(input: {
  relation: string;
  hasRealEstate: string;
  hasOther: string;
}): Esito {
  if (input.hasOther === "si" || input.hasRealEstate === "nonso") return "c";
  if (
    input.hasRealEstate === "no" &&
    directLineRelations.includes(input.relation)
  )
    return "a";
  return "b";
}

export function suggestedPackage(esito: Esito): PackageKey | null {
  if (esito === "a") return "SEMPLICE";
  if (esito === "b") return "COMPLETO";
  return null; // su misura
}

export function isPackageKey(value: unknown): value is PackageKey {
  return value === "SEMPLICE" || value === "COMPLETO" || value === "ZERO_STRESS";
}
