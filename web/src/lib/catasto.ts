/*
  Calcolo del VALORE CATASTALE ai fini dell'imposta di successione.
  Logica PURA e client-safe (niente "server-only"): usata sia dal generatore
  XML SUC13 (lib/suc-xml.ts) sia dal calcolatore pubblico /strumenti.
  Moltiplicatori VERIFICATI sul software AdE di Lorenzo (file .suc reali):
  fabbricati = rendita rivalutata (x1,05) x moltiplicatore; terreni non
  edificabili = reddito dominicale x1,25 x90. I terreni edificabili vanno a
  valore venale (non calcolabile da qui).
*/

export const RIVALUTAZIONE_RENDITA = 1.05;
export const RIVALUTAZIONE_REDDITO_DOMINICALE = 1.25;
export const MOLTIPLICATORE_TERRENI = 90;

export const MOLTIPLICATORI_FABBRICATI = {
  primaCasa: 110, // abitazione principale (agevolazione)
  gruppoAeC: 120, // gruppi A e C (esclusi A/10 e C/1)
  gruppoB: 168, // gruppo B (140 +20% dal 2007)
  a10eGruppoD: 60, // A/10 uffici e gruppo D
  c1eGruppoE: 40.8, // C/1 negozi e gruppo E
} as const;

/** Moltiplicatore dalla categoria catastale (es. "A/2", "C6", "D1"). */
export function moltiplicatoreFabbricato(
  categoria: string | null | undefined,
  primaCasa: boolean,
): number {
  if (primaCasa) return MOLTIPLICATORI_FABBRICATI.primaCasa;
  const cat = (categoria ?? "").toUpperCase().replace(/[\s/]/g, "");
  if (cat === "A10" || cat.startsWith("D")) return MOLTIPLICATORI_FABBRICATI.a10eGruppoD;
  if (cat === "C1" || cat.startsWith("E")) return MOLTIPLICATORI_FABBRICATI.c1eGruppoE;
  if (cat.startsWith("B")) return MOLTIPLICATORI_FABBRICATI.gruppoB;
  return MOLTIPLICATORI_FABBRICATI.gruppoAeC;
}

/** Valore catastale di un fabbricato: rendita x1,05 x moltiplicatore (arrotondato). */
export function valoreCatastaleFabbricato(
  rendita: number,
  categoria: string | null | undefined,
  primaCasa: boolean,
): number {
  return Math.round(
    rendita * RIVALUTAZIONE_RENDITA * moltiplicatoreFabbricato(categoria, primaCasa),
  );
}

/** Valore catastale di un terreno NON edificabile: RD x1,25 x90 (arrotondato). */
export function valoreCatastaleTerreno(redditoDominicale: number): number {
  return Math.round(
    redditoDominicale * RIVALUTAZIONE_REDDITO_DOMINICALE * MOLTIPLICATORE_TERRENI,
  );
}
