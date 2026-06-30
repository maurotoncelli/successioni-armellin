"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { createCheckoutPractice } from "@/app/(site)/checkout/actions";
import type { PackageKey } from "@/lib/supabase/types";

/*
  Pannello di pagamento del checkout (client): raccoglie i consensi e avvia la
  sessione Stripe via POST /api/checkout, poi reindirizza alla pagina di Stripe.
  Due sorgenti: pratica gia esistente (link dal CRM) oppure pacchetto+risposte
  dal preventivo pubblico - in quel caso la pratica si crea SOLO ora, al click di
  pagamento. La conferma del pagamento resta lato server (webhook).
*/

type CheckoutAnswers = {
  relation: string;
  heirs: string;
  hasRealEstate: string;
  hasWill: string;
  hasOther: string;
};

type Props = {
  practiceId: string | null;
  packageKey?: PackageKey | null;
  realEstateCount?: number | null;
  answers?: CheckoutAnswers;
  payLabel: string;
  consensoTc: string;
  consensoAvvio: string;
  ctaNota: string;
  rateNota: string;
  recessoLink: { href: string; label: string };
};

export function CheckoutPanel({
  practiceId,
  packageKey = null,
  realEstateCount = null,
  answers,
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

  const hasOrder = Boolean(practiceId) || Boolean(packageKey);
  const canPay = hasOrder && tc && avvio && !loading;

  async function startStripe(id: string) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        practiceId: id,
        packageKey: packageKey ?? undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      setError(data?.error?.message ?? "Impossibile avviare il pagamento.");
      setLoading(false);
      return;
    }
    window.location.href = data.url as string;
  }

  async function pay() {
    if (!hasOrder) return;
    setLoading(true);
    setError(null);
    trackEvent("begin_checkout", { practice_id: practiceId, package: packageKey });
    try {
      // Pratica gia esistente (CRM) -> avvio diretto.
      if (practiceId) {
        await startStripe(practiceId);
        return;
      }
      // Preventivo pubblico -> creo la pratica adesso, poi avvio Stripe.
      if (packageKey) {
        const created = await createCheckoutPractice({
          packageKey,
          realEstateCount,
          relation: answers?.relation,
          heirs: answers?.heirs,
          hasRealEstate: answers?.hasRealEstate,
          hasWill: answers?.hasWill,
          hasOther: answers?.hasOther,
        });
        if (!created.ok) {
          setError(
            created.reason === "not_configured"
              ? "Pagamenti non ancora attivi. Riprova piu tardi o contattaci."
              : "Impossibile avviare il pagamento. Riprova tra poco.",
          );
          setLoading(false);
          return;
        }
        await startStripe(created.practiceId);
      }
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

      {!hasOrder && (
        <p className="mt-4 flex items-start gap-2 rounded-[10px] bg-amber-50 p-3 text-xs text-amber-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          Per pagare, parti dal{" "}
          <Link href="/preventivo" className="font-medium underline">
            calcolo del preventivo
          </Link>
          : così ti proponiamo il pacchetto giusto.
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
