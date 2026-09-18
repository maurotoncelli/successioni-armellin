"use client";

import { useState, useTransition } from "react";
import { CreditCard, Copy, Check, ExternalLink } from "lucide-react";
import { generatePaymentLink } from "@/app/crm/pratiche/[id]/actions";
import type { CheckoutPlan } from "@/lib/payment-plan";

/*
  Bottone "Genera link di pagamento" della scheda pratica (flusso assistito @05).
  Crea la sessione Stripe lato server e mostra il link da inviare al cliente.
  plan: full (onorario intero), deposit (acconto 50%), balance (saldo 50%).
*/

export function PaymentLinkButton({
  practiceId,
  plan = "full",
  label,
}: {
  practiceId: string;
  plan?: CheckoutPlan;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const cta =
    label ??
    (plan === "deposit"
      ? "Genera link acconto 50%"
      : plan === "balance"
        ? "Genera link saldo 50%"
        : "Genera link di pagamento");

  function generate() {
    setError(null);
    startTransition(async () => {
      const res = await generatePaymentLink(practiceId, plan);
      if (res.ok) setUrl(res.url);
      else setError(res.error);
    });
  }

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard non disponibile */
    }
  }

  return (
    <div>
      <button
        onClick={generate}
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg crm-gradient px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        <CreditCard className="h-4 w-4" />
        {pending ? "Generazione…" : cta}
      </button>

      {error && <p className="mt-2 text-xs text-crm-rose">{error}</p>}

      {url && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-crm-muted">
            Link pronto: invialo al cliente (email/WhatsApp).
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-crm-border bg-crm-bg2/40 px-2.5 py-2">
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-crm-text2">
              {url}
            </span>
            <button
              onClick={copy}
              className="shrink-0 text-crm-text2 hover:text-crm-text"
              title="Copia"
            >
              {copied ? (
                <Check className="h-4 w-4 text-crm-green" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-crm-text2 hover:text-crm-text"
              title="Apri"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
