"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { getInvoiceUrl } from "@/app/area-riservata/(app)/ordine/actions";
import {
  INVOICE_UI_IT,
  fillTemplate,
  type InvoiceUiLabels,
} from "@/lib/area-ui-labels";

// Pulsante "Scarica fattura" dell'area cliente: chiede un URL firmato a tempo
// e apre il PDF. Mostrato solo quando la fattura ha un file allegato.
export function InvoiceDownload({
  number,
  labels = INVOICE_UI_IT,
}: {
  number: string;
  labels?: InvoiceUiLabels;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setBusy(true);
    setError(null);
    try {
      const res = await getInvoiceUrl();
      if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
      else setError(res.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={download}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-[10px] border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 disabled:opacity-50"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {labels.download}
      </button>
      <p className="mt-1 text-xs text-text-muted">
        {fillTemplate(labels.number, { number })}
      </p>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
