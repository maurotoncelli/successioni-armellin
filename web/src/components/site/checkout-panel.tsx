"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { createCheckoutPractice } from "@/app/(site)/checkout/actions";
import { LegalLinksText } from "@/components/site/legal-links-text";
import type { PackageKey } from "@/lib/supabase/types";
import type { CheckoutPlan } from "@/lib/payment-plan";
import {
  CHECKOUT_UI_IT,
  type CheckoutUiLabels,
} from "@/lib/site-ui-labels";

/*
  Pannello di pagamento del checkout (client): raccoglie i consensi e avvia la
  sessione Stripe via POST /api/checkout, poi reindirizza alla pagina di Stripe.
  Due sorgenti: pratica gia esistente (link dal CRM) oppure pacchetto+risposte
  dal preventivo pubblico - in quel caso la pratica si crea SOLO ora, al click di
  pagamento. La conferma del pagamento resta lato server (webhook).
*/

type CheckoutAnswers = {
  /** Composizione eredi serializzata (es. "1.2.0.0.0.0"), dal quiz. */
  comp: string;
  heirs: string;
  hasRealEstate: string;
  hasWill: string;
  hasOther: string;
  heirsAbroad?: string;
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
  ui?: CheckoutUiLabels;
  total?: number;
  deposit?: number;
  balance?: number;
  balanceDue?: boolean;
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
  ui = CHECKOUT_UI_IT,
  total = 0,
  deposit = 0,
  balance = 0,
  balanceDue = false,
}: Props) {
  const [tc, setTc] = useState(false);
  const [avvio, setAvvio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<CheckoutPlan>(balanceDue ? "balance" : "full");

  const hasOrder = Boolean(practiceId) || Boolean(packageKey);
  const canPay = hasOrder && tc && avvio && !loading;
  const checkoutPlan: CheckoutPlan = balanceDue ? "balance" : plan;

  function fmt(n: number) {
    return n.toLocaleString("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  function fill(template: string, vars: Record<string, string>) {
    return Object.entries(vars).reduce(
      (acc, [k, v]) => acc.replaceAll(`{${k}}`, v),
      template,
    );
  }

  const payLabelLive =
    checkoutPlan === "deposit"
      ? fill(ui.plan_pay_deposit, { amount: fmt(deposit) })
      : checkoutPlan === "balance"
        ? fill(ui.plan_pay_balance, { amount: fmt(balance) })
        : fill(ui.plan_pay_full, { amount: fmt(total) });

  async function startStripe(id: string) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        practiceId: id,
        packageKey: packageKey ?? undefined,
        plan: checkoutPlan,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      setError(data?.error?.message ?? ui.err_start);
      setLoading(false);
      return;
    }
    window.location.href = data.url as string;
  }

  async function pay() {
    if (!hasOrder) return;
    setLoading(true);
    setError(null);
    trackEvent("begin_checkout", {
      practice_id: practiceId,
      package: packageKey,
      plan: checkoutPlan,
    });
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
          comp: answers?.comp,
          heirs: answers?.heirs,
          hasRealEstate: answers?.hasRealEstate,
          hasWill: answers?.hasWill,
          hasOther: answers?.hasOther,
          heirsAbroad: answers?.heirsAbroad,
        });
        if (!created.ok) {
          setError(
            created.reason === "not_configured"
              ? ui.err_not_configured
              : ui.err_retry,
          );
          setLoading(false);
          return;
        }
        await startStripe(created.practiceId);
      }
    } catch {
      setError(ui.err_network);
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="rounded-[10px] bg-sand/60 p-3 text-sm text-text-muted">
        {ui.stripe_blurb}
      </p>
      <p className="mt-3 text-xs text-text-muted">{rateNota}</p>

      {hasOrder && total > 0 && (
        <fieldset className="mt-6 space-y-2">
          <legend className="sr-only">{ui.plan_full_title}</legend>
          {balanceDue ? (
            <p className="rounded-[10px] border border-accent/30 bg-sand/50 px-3 py-2.5 text-sm text-text">
              {fill(ui.balance_banner, { amount: fmt(balance) })}
            </p>
          ) : (
            <>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-[12px] border p-3 text-sm transition-colors ${
                  checkoutPlan === "full"
                    ? "border-accent bg-sand/50"
                    : "border-primary/10 bg-bg"
                }`}
              >
                <input
                  type="radio"
                  name="pay-plan"
                  className="mt-1 accent-[var(--color-accent)]"
                  checked={checkoutPlan === "full"}
                  onChange={() => setPlan("full")}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="font-medium text-text">{ui.plan_full_title}</span>
                    <span className="tabular-nums font-semibold text-primary">
                      {fmt(total)} €
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-text-muted">
                    {ui.plan_full_hint}
                  </span>
                </span>
              </label>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-[12px] border p-3 text-sm transition-colors ${
                  checkoutPlan === "deposit"
                    ? "border-accent bg-sand/50"
                    : "border-primary/10 bg-bg"
                }`}
              >
                <input
                  type="radio"
                  name="pay-plan"
                  className="mt-1 accent-[var(--color-accent)]"
                  checked={checkoutPlan === "deposit"}
                  onChange={() => setPlan("deposit")}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="font-medium text-text">{ui.plan_split_title}</span>
                    <span className="tabular-nums text-sm text-text">
                      {fmt(deposit)} €
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-text-muted">
                    {fill(ui.plan_split_hint, {
                      deposit: fmt(deposit),
                      balance: fmt(balance),
                    })}
                  </span>
                </span>
              </label>
            </>
          )}
        </fieldset>
      )}

      <div className="mt-6 space-y-3">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={tc}
            onChange={(e) => setTc(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
          />
          <span>
            <LegalLinksText text={consensoTc} />
          </span>
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
          {ui.need_quote_before}{" "}
          <Link href="/preventivo" className="font-medium underline">
            {ui.need_quote_link}
          </Link>
          {ui.need_quote_after}
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
        {loading ? ui.loading : payLabelLive || payLabel}
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
