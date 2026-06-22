"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

// Emette l'evento GA4 `purchase` una sola volta al montaggio (pagamento confermato).
export function PurchaseEvent({
  transactionId,
  value,
  currency,
}: {
  transactionId: string;
  value?: number;
  currency?: string;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent("purchase", {
      transaction_id: transactionId,
      value,
      currency: currency ?? "EUR",
    });
  }, [transactionId, value, currency]);
  return null;
}
