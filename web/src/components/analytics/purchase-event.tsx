"use client";

import { useEffect, useRef } from "react";
import { trackAdsConversion, trackEvent } from "@/lib/analytics";

// Emette l'evento GA4 `purchase` una sola volta al montaggio (pagamento confermato).
export function PurchaseEvent({
  transactionId,
  value,
  currency,
  sendGa4Purchase = true,
}: {
  transactionId: string;
  value?: number;
  currency?: string;
  /** false se il purchase e gia inviato server-side (Measurement Protocol). */
  sendGa4Purchase?: boolean;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (sendGa4Purchase) {
      trackEvent("purchase", {
        transaction_id: transactionId,
        value,
        currency: currency ?? "EUR",
      });
    }
    trackAdsConversion("purchase", {
      transaction_id: transactionId,
      value,
      currency: currency ?? "EUR",
    });
  }, [transactionId, value, currency, sendGa4Purchase]);
  return null;
}
