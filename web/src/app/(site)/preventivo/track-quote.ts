"use server";

import { pushCrmNotification } from "@/lib/crm-notifications";
import { incrementQuoteCompleted } from "@/lib/quote-stats";
import { quizNotificationText, type QuizSnapshot } from "@/lib/quiz-summary";

export type TrackQuoteInput = {
  /** Esito, prezzo e risposte gia' in chiaro (etichette IT per Lorenzo). */
  snapshot: QuizSnapshot;
  /** Fingerprint client (sessionStorage) per anti-doppione lato UI. */
  fingerprint: string;
};

const recentFingerprints = new Map<string, number>();
const DEDUPE_MS = 10 * 60_000;

function pruneFingerprints(now: number) {
  for (const [k, t] of recentFingerprints) {
    if (now - t > DEDUPE_MS) recentFingerprints.delete(k);
  }
}

/*
  Conta un questionario completato (pagina /preventivo/grazie), anche senza
  email/pagamento. Scrive notifica CRM kind=preventivo + contatore durable.
*/
export async function trackQuoteCompleted(
  input: TrackQuoteInput,
): Promise<{ ok: boolean }> {
  const snapshot = input.snapshot;
  const esito = snapshot.esito === "a" || snapshot.esito === "c" ? snapshot.esito : "b";
  const fp = (input.fingerprint || "").slice(0, 120);
  if (!fp) return { ok: false };

  const now = Date.now();
  pruneFingerprints(now);
  if (recentFingerprints.has(fp)) return { ok: true };
  recentFingerprints.set(fp, now);

  await incrementQuoteCompleted(esito);

  const { title, body } = quizNotificationText(
    { ...snapshot, esito },
    new Date(now).toISOString(),
    "nessun contatto lasciato (solo esito del questionario)",
  );

  await pushCrmNotification({
    kind: "preventivo",
    title: `Questionario compilato — ${title}`,
    body,
  });

  return { ok: true };
}
