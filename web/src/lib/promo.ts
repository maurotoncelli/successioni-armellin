/*
  Promozione a tempo sull'onorario (sconto lancio, decisione Mauro 15/09/2026):
  -20% su TUTTI i totali (pacchetto + immobili/eredi extra + add-on) per 10
  giorni, con conto alla rovescia in vetrina, esito preventivo e checkout.

  Un solo punto di verità: `getActivePromo()` decide se lo sconto è attivo
  ADESSO e con quale percentuale; `buildOrder` (lib/order.ts) lo applica come
  riga DISCOUNT e `createCheckoutSession` (lib/payments.ts) lo passa a Stripe
  come coupon, così sito, CRM, email e pagina di pagamento dicono la stessa
  cifra. Scaduta la data, tutto torna al listino pieno senza deploy.

  Override senza toccare il codice (Vercel → env):
    PROMO_PERCENT=20            percentuale (0 o vuoto = disattivata)
    PROMO_STARTS_AT=2026-09-15T00:00:00Z
    PROMO_ENDS_AT=2026-09-25T21:59:59Z   (= 25/09 23:59:59 ora italiana)
  Il coupon Stripe ha id `code`: cambiando percentuale cambia anche il code,
  cosi non si riusa un coupon con percent_off diverso.

  Nota legale (Codice del consumo, art. 17-bis): lo sconto va riferito al
  prezzo più basso degli ultimi 30 giorni. Il listino 290/490 è in vigore da
  mesi, quindi il prezzo barrato è corretto. NON prorogare all'infinito.

  Mauro 20/09: confermato, lo sconto SCADÈ il 25/09 e poi si toglie.
  Non estendere PROMO_ENDS_AT. Dopo la mezzanotte IT del 25/09 il banner
  sparisce da solo (getActivePromo → null). Cleanup UI/env: dopo quella data.
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

const DEFAULT_PERCENT = 20;
const DEFAULT_STARTS_AT = "2026-09-15T00:00:00.000Z";
const DEFAULT_ENDS_AT = "2026-09-25T21:59:59.000Z";

function envNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function envDate(name: string, fallback: string): string {
  const raw = process.env[name];
  if (!raw || Number.isNaN(Date.parse(raw))) return fallback;
  return new Date(raw).toISOString();
}

/** Configurazione della promo (attiva o meno), letta da env con default. */
export function getPromoConfig(): Promo | null {
  const percent = Math.round(envNumber("PROMO_PERCENT", DEFAULT_PERCENT));
  if (percent <= 0 || percent >= 100) return null;
  return {
    code: `LANCIO${percent}`,
    percent,
    startsAt: envDate("PROMO_STARTS_AT", DEFAULT_STARTS_AT),
    endsAt: envDate("PROMO_ENDS_AT", DEFAULT_ENDS_AT),
  };
}

/** Promo attiva nell'istante `now` (default adesso), altrimenti null. */
export function getActivePromo(now: Date = new Date()): Promo | null {
  const promo = getPromoConfig();
  if (!promo) return null;
  const ts = now.getTime();
  if (ts < Date.parse(promo.startsAt)) return null;
  if (ts >= Date.parse(promo.endsAt)) return null;
  return promo;
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
