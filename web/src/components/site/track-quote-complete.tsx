"use client";

import { useEffect } from "react";
import { trackQuoteCompleted } from "@/app/(site)/preventivo/track-quote";
import type { Esito } from "@/lib/quote";

/*
  Una sola volta per sessione browser (sessionStorage): conta il questionario
  completato anche se il visitatore non lascia email ne paga.
*/

export function TrackQuoteComplete({
  esito,
  packageLabel,
  fingerprint,
}: {
  esito: Esito;
  packageLabel?: string;
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
    void trackQuoteCompleted({ esito, packageLabel, fingerprint });
  }, [esito, packageLabel, fingerprint]);

  return null;
}
