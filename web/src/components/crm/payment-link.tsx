"use client";

import { useState, useTransition } from "react";
import { CreditCard, Copy, Check, ExternalLink } from "lucide-react";
import { generatePaymentLink } from "@/app/crm/pratiche/[id]/actions";

/*
  Bottone "Genera link di pagamento" della scheda pratica (flusso assistito @05).
  Crea la sessione Stripe lato server e mostra il link da inviare al cliente.
*/

export function PaymentLinkButton({ practiceId }: { practiceId: string }) {
  const [pending, startTransition] = useTransition();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function generate() {
    setError(null);
    startTransition(async () => {
      const res = await generatePaymentLink(practiceId);
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
    <div className="mt-4 border-t border-crm-border pt-4">
      <button
        onClick={generate}
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg crm-gradient px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        <CreditCard className="h-4 w-4" />
        {pending ? "Generazione…" : "Genera link di pagamento"}
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
