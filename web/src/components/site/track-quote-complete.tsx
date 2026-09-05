"use client";

import { useEffect } from "react";
import { trackQuoteCompleted } from "@/app/(site)/preventivo/track-quote";
import type { QuizSnapshot } from "@/lib/quiz-summary";

/*
  Una sola volta per sessione browser (sessionStorage): conta il questionario
  completato anche se il visitatore non lascia email ne paga. Al CRM arriva
  l'esito gia' in chiaro (pacchetto + cifra, esonero, su misura) con le risposte.
*/

export function TrackQuoteComplete({
  snapshot,
  fingerprint,
}: {
  snapshot: QuizSnapshot;
  fingerprint: string;
}) {
  useEffect(() => {
    const key = `quote-tracked:${fingerprint}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // private mode: procedi comunque (server ha dedupe a breve TTL)
    }
    void trackQuoteCompleted({ snapshot, fingerprint });
  }, [snapshot, fingerprint]);

  return null;
}
