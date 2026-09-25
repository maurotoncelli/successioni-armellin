/*
  Test prezzo unico (Mauro 25/09/2026): due settimane a 250 € tutto incluso al
  posto della vetrina 290 / 490 / su misura. Piano e procedura di chiusura in
  blueprint/TEST_PREZZO_UNICO_250.md.

  Si accende e si spegne SOLO con un deploy (`FLAT_OFFER_ON`), mai a data:
  prezzi e testi devono cambiare insieme. Le date servono al CRM (banner,
  statistiche) e alla garanzia del prezzo.

  Con il test acceso:
  - buildOrder (lib/order.ts): una riga unica da `price`, niente supplementi
    per immobili/eredi e niente promo. Semplice/Completo restano solo come
    chiave interna (tempi di consegna, checklist, CRM);
  - computeEsito (lib/quote.ts): "immobili: non so" resta nel prezzo unico;
    su misura solo per gli "altri beni" (quote, azioni, aziende, barche);
  - testi: le voci `prezzo_unico.<collection>.<key>` dei content_entries
    sostituiscono `<collection>.<key>` (lib/content.ts); le FAQ sul prezzo
    hanno risposte dedicate (lib/cms.ts). Il listino nel database resta
    290/490 e torna valido spegnendo il test.

  Modulo senza dipendenze: lo usano anche componenti client (quiz).
*/

export type FlatOffer = {
  /** Marcatore nelle righe d'ordine (`line_items[].key`) e nei log. */
  code: string;
  /** Onorario finale, senza IVA. */
  price: number;
  /** Primo giorno del test (ora italiana, YYYY-MM-DD). */
  startsAt: string;
  /**
    Ultimo giorno del test, incluso. Allo spegnimento va messo il giorno vero:
    la garanzia (email "almeno 14 giorni") si conta da qui.
  */
  endsAt: string;
  /** Giorni dopo `endsAt` in cui chi ha avuto il preventivo a `price` lo paga ancora così. */
  honorDays: number;
};

export const FLAT_OFFER: FlatOffer = {
  code: "UNICO250",
  price: 250,
  startsAt: "2026-09-25",
  endsAt: "2026-10-08",
  honorDays: 14,
};

/** Interruttore del test. Cambiarlo richiede un deploy. */
export const FLAT_OFFER_ON = true;

export function getFlatOffer(): FlatOffer | null {
  return FLAT_OFFER_ON ? FLAT_OFFER : null;
}

export function isFlatOfferOn(): boolean {
  return FLAT_OFFER_ON;
}

/** true se le righe d'ordine salvate su una pratica sono quelle del prezzo unico. */
export function hasFlatOfferLine(lineItems: unknown): boolean {
  if (!Array.isArray(lineItems)) return false;
  return lineItems.some(
    (li) =>
      li !== null &&
      typeof li === "object" &&
      (li as { key?: unknown }).key === FLAT_OFFER.code,
  );
}

/** Ultimo istante in cui vale la garanzia del prezzo (fine giornata, ora italiana). */
export function flatOfferHonorUntil(offer: FlatOffer = FLAT_OFFER): Date {
  const end = new Date(`${offer.endsAt}T23:59:59+02:00`);
  return new Date(end.getTime() + offer.honorDays * 86_400_000);
}

/**
  Prezzo unico da applicare a una pratica: quello attivo, oppure, a test
  spento, quello già proposto (righe marcate `code`) finché vale la garanzia.
*/
export function flatOfferForPractice(
  lineItems: unknown,
  now: Date = new Date(),
): FlatOffer | null {
  const active = getFlatOffer();
  if (active) return active;
  if (!hasFlatOfferLine(lineItems)) return null;
  return now.getTime() <= flatOfferHonorUntil().getTime() ? FLAT_OFFER : null;
}
