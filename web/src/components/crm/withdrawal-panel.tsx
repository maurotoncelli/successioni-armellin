"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Ban, AlertTriangle } from "lucide-react";
import { SectionTitle, CrmCard } from "@/components/crm/ui";
import { updateWithdrawal } from "@/app/crm/pratiche/[id]/actions";
import type { WithdrawalInfo } from "@/lib/practice-extras";

const statusLabel: Record<WithdrawalInfo["status"], string> = {
  REQUESTED: "Inviata dal cliente",
  IN_REVIEW: "In gestione",
  ACCEPTED: "Accettata",
  REJECTED: "Respinta",
};

export function WithdrawalPanel({
  practiceId,
  withdrawal,
  paid,
  amount,
  stripeRefundable,
}: {
  practiceId: string;
  withdrawal: WithdrawalInfo;
  paid: boolean;
  /** Prezzo pagato: mostrato accanto alla spunta di rimborso. */
  amount?: number;
  /** true se il pagamento e avvenuto via Stripe (rimborso automatico possibile). */
  stripeRefundable?: boolean;
}) {
  const router = useRouter();
  const [note, setNote] = useState(withdrawal.outcomeNote ?? "");
  const [busy, setBusy] = useState<WithdrawalInfo["status"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refund, setRefund] = useState(false);
  const [, startTransition] = useTransition();

  const resolved =
    withdrawal.status === "ACCEPTED" || withdrawal.status === "REJECTED";
  const canAutoRefund = paid && Boolean(stripeRefundable);

  function act(status: WithdrawalInfo["status"]) {
    setBusy(status);
    setError(null);
    startTransition(async () => {
      const res = await updateWithdrawal(practiceId, status, note, {
        refundStripe: status === "ACCEPTED" && canAutoRefund && refund,
      });
      if (!res.ok) setError(res.error);
      else router.refresh();
      setBusy(null);
    });
  }

  return (
    <CrmCard className="border-crm-rose/30">
      <div className="flex items-center gap-2">
        <Ban className="h-4 w-4 text-crm-rose" />
        <SectionTitle>Richiesta di recesso</SectionTitle>
      </div>

      <div className="mt-3 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-crm-text2">Stato</span>
          <span className="rounded bg-crm-rose/15 px-2 py-0.5 text-xs font-medium text-crm-rose">
            {statusLabel[withdrawal.status]}
          </span>
        </div>
        <p className="text-xs text-crm-muted">
          Richiesta il {withdrawal.requestedAt.slice(0, 10)}
          {withdrawal.resolvedAt
            ? ` · esito il ${withdrawal.resolvedAt.slice(0, 10)}`
            : ""}
        </p>
        {withdrawal.reason && (
          <p className="rounded-lg bg-crm-bg2/60 p-2.5 text-crm-text2">
            “{withdrawal.reason}”
          </p>
        )}

        {paid && (
          <p className="flex items-start gap-1.5 rounded-lg bg-crm-amber/10 p-2.5 text-xs text-crm-amber">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {canAutoRefund
              ? "Pratica pagata: se accetti il recesso puoi far partire il rimborso Stripe direttamente da qui (spunta sotto). Ricordati l'eventuale nota di credito nel gestionale di fatturazione."
              : "Pratica pagata (non via Stripe): se accetti il recesso ricordati il rimborso manuale e l'eventuale nota di credito nel gestionale di fatturazione."}
          </p>
        )}

        {!resolved && (
          <>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Nota per il cliente (motivazione / esito)…"
              className="w-full rounded-lg border border-crm-border bg-crm-bg2 px-2.5 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent"
            />
            {canAutoRefund && (
              <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-crm-border bg-crm-bg2/60 p-2.5 text-xs text-crm-text2">
                <input
                  type="checkbox"
                  checked={refund}
                  onChange={(e) => setRefund(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 accent-crm-accent"
                />
                <span>
                  Se accetto, esegui anche il <strong>rimborso totale su Stripe</strong>
                  {typeof amount === "number" && amount > 0
                    ? ` (${amount.toLocaleString("it-IT")} €)`
                    : ""}
                  . Il rimborso non è annullabile.
                </span>
              </label>
            )}
            <div className="flex flex-wrap gap-2">
              {withdrawal.status === "REQUESTED" && (
                <button
                  onClick={() => act("IN_REVIEW")}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-3 py-1.5 text-sm text-crm-text hover:border-crm-accent/40 disabled:opacity-50"
                >
                  {busy === "IN_REVIEW" && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Prendi in gestione
                </button>
              )}
              <button
                onClick={() => act("ACCEPTED")}
                disabled={busy !== null}
                className="inline-flex items-center gap-1.5 rounded-lg bg-crm-green/15 px-3 py-1.5 text-sm text-crm-green hover:bg-crm-green/25 disabled:opacity-50"
              >
                {busy === "ACCEPTED" && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Accetta
              </button>
              <button
                onClick={() => act("REJECTED")}
                disabled={busy !== null}
                className="inline-flex items-center gap-1.5 rounded-lg bg-crm-rose/15 px-3 py-1.5 text-sm text-crm-rose hover:bg-crm-rose/25 disabled:opacity-50"
              >
                {busy === "REJECTED" && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Respingi
              </button>
            </div>
          </>
        )}

        {resolved && withdrawal.outcomeNote && (
          <p className="rounded-lg bg-crm-bg2/60 p-2.5 text-crm-text2">
            Esito: {withdrawal.outcomeNote}
          </p>
        )}

        {error && <p className="text-xs text-crm-rose">{error}</p>}
      </div>
    </CrmCard>
  );
}
