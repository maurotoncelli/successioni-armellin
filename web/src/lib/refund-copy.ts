/*
  Copy condivisa sui tempi di accredito del rimborso carta (Stripe).
  Fonte: documentazione Stripe — il cliente vede il credito di norma
  entro 5-10 giorni lavorativi, a seconda della banca/emittente.
*/

/** Finestra tipica di accredito dopo l'emissione del rimborso. */
export const REFUND_CARD_SETTLEMENT_IT = "5-10 giorni lavorativi";

/** Messaggio quando il rimborso e' gia stato emesso (carta/Stripe). */
export function refundIssuedMessage(): string {
  return `Il rimborso è stato emesso sulla carta usata per il pagamento: di norma lo vedi accreditato entro ${REFUND_CARD_SETTLEMENT_IT} (tempi della tua banca o dell'emittente della carta; a volte compare come storno della spesa originale).`;
}

/** Messaggio quando il recesso e' accettato ma il rimborso non e' ancora partito. */
export function refundPendingAfterAcceptMessage(): string {
  return `Se è dovuto un rimborso, lo emettiamo con lo stesso metodo di pagamento. Una volta emesso, la banca lo accredita di norma entro ${REFUND_CARD_SETTLEMENT_IT}.`;
}
