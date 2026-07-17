"use server";

import { pushCrmNotification } from "@/lib/crm-notifications";
import { incrementQuoteCompleted } from "@/lib/quote-stats";
import type { Esito } from "@/lib/quote";

export type TrackQuoteInput = {
  esito: Esito;
  /** Pacchetto suggerito (solo esito B), etichetta gia' leggibile. */
  packageLabel?: string;
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
  const esito = input.esito === "a" || input.esito === "c" ? input.esito : "b";
  const fp = (input.fingerprint || "").slice(0, 120);
  if (!fp) return { ok: false };

  const now = Date.now();
  pruneFingerprints(now);
  if (recentFingerprints.has(fp)) return { ok: true };
  recentFingerprints.set(fp, now);

  await incrementQuoteCompleted(esito);

  const esitoLabel =
    esito === "a"
      ? "Esito A · possibile esonero"
      : esito === "c"
        ? "Esito C · su misura"
        : input.packageLabel
          ? `Esito B · ${input.packageLabel}`
          : "Esito B · pacchetto standard";

  await pushCrmNotification({
    kind: "preventivo",
    title: "Questionario preventivo completato",
    body: `${esitoLabel}. Contatto non ancora lasciato (solo esito del quiz).`,
  });

  return { ok: true };
}
