"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

/*
  Pannello di pagamento del checkout (client): raccoglie i consensi e avvia la
  sessione Stripe via POST /api/checkout, poi reindirizza alla pagina di Stripe.
  La conferma del pagamento resta lato server (webhook), mai sul redirect.
*/

type Props = {
  practiceId: string | null;
  payLabel: string;
  consensoTc: string;
  consensoAvvio: string;
  ctaNota: string;
  rateNota: string;
  recessoLink: { href: string; label: string };
};

export function CheckoutPanel({
  practiceId,
  payLabel,
  consensoTc,
  consensoAvvio,
  ctaNota,
  rateNota,
  recessoLink,
}: Props) {
  const [tc, setTc] = useState(false);
  const [avvio, setAvvio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPay = Boolean(practiceId) && tc && avvio && !loading;

  async function pay() {
    if (!practiceId) return;
    setLoading(true);
    setError(null);
    trackEvent("begin_checkout", { practice_id: practiceId });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ practiceId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data?.error?.message ?? "Impossibile avviare il pagamento.");
        setLoading(false);
        return;
      }
      window.location.href = data.url as string;
    } catch {
      setError("Errore di rete. Riprova tra poco.");
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="rounded-[10px] bg-sand/60 p-3 text-sm text-text-muted">
        Pagamento sicuro tramite Stripe: carta di credito/debito e, dove
        disponibile, pagamento a rate. Verrai reindirizzato alla pagina protetta
        di Stripe.
      </p>
      <p className="mt-3 text-xs text-text-muted">{rateNota}</p>

      <div className="mt-6 space-y-3">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={tc}
            onChange={(e) => setTc(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
          />
          <span>{consensoTc}</span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={avvio}
            onChange={(e) => setAvvio(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
          />
          <span>{consensoAvvio}</span>
        </label>
      </div>

      {!practiceId && (
        <p className="mt-4 flex items-start gap-2 rounded-[10px] bg-amber-50 p-3 text-xs text-amber-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          Per pagare, parti dal{" "}
          <Link href="/preventivo" className="font-medium underline">
            calcolo del preventivo
          </Link>
          : così colleghiamo il pagamento alla tua pratica.
        </p>
      )}

      {error && (
        <p className="mt-4 flex items-start gap-2 rounded-[10px] bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <Button
        size="lg"
        className="mt-6 w-full"
        disabled={!canPay}
        onClick={pay}
      >
        <Lock className="h-4 w-4" />
        {loading ? "Avvio del pagamento…" : payLabel}
      </Button>
      <p className="mt-2 text-center text-xs text-text-muted">{ctaNota}</p>

      <p className="mt-4 text-center text-xs text-text-muted">
        <Link href={recessoLink.href} className="underline">
          {recessoLink.label}
        </Link>
      </p>
    </div>
  );
}
