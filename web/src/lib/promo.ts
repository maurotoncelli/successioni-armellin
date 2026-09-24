/*
  Promozione a tempo sull'onorario.

  Mauro 24/09/2026: l'offerta lancio è chiusa. Listino pieno, niente banner,
  niente prezzo barrato, niente sconto in checkout o su Stripe.
  `getActivePromo()` restituisce sempre null: una PROMO_PERCENT rimasta su
  Vercel non la riaccende.

  Per una promo futura: percentuale e date in `getPromoConfig`, e testi nuovi
  in `site_ui.promo_ui` (niente «lancio»). Codice del consumo, art. 17-bis:
  lo sconto va riferito al prezzo più basso degli ultimi 30 giorni.
*/

export type Promo = {
  /** Id coupon Stripe e identificativo nei log (es. LANCIO20). */
  code: string;
  /** Percentuale intera di sconto (es. 20). */
  percent: number;
  /** Inizio validità (ISO). */
  startsAt: string;
  /** Fine validità (ISO, istante escluso). */
  endsAt: string;
};

/** Nessuna promo configurata: listino pieno. */
export function getPromoConfig(): Promo | null {
  return null;
}

/** Promo attiva adesso. Chiusa il 24/09/2026: sempre null. */
export function getActivePromo(_now: Date = new Date()): Promo | null {
  return null;
}

/** Arrotondamento ai centesimi, coerente con quello di Stripe sul coupon. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Importo scontato (positivo) su un imponibile. */
export function promoDiscount(amount: number, promo: Promo): number {
  return round2((amount * promo.percent) / 100);
}

/** Prezzo dopo lo sconto. */
export function promoPrice(amount: number, promo: Promo): number {
  return round2(amount - promoDiscount(amount, promo));
}

/** Data di fine formattata per il locale (giorno e mese, ora italiana). */
export function formatPromoEnd(promo: Promo, intlLocale: string): string {
  // L'istante di fine è l'ultimo secondo del giorno: mostriamo quel giorno.
  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Rome",
  }).format(new Date(promo.endsAt));
}
