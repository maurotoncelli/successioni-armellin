"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, AlertCircle, Clock } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { submitWithdrawal } from "@/app/area-riservata/(app)/recesso/actions";
import type { WithdrawalInfo } from "@/lib/practice-extras";
import {
  WITHDRAWAL_UI_IT,
  fillTemplate,
  type WithdrawalUiLabels,
} from "@/lib/area-ui-labels";

export function WithdrawalForm({
  current,
  refunded = false,
  labels = WITHDRAWAL_UI_IT,
}: {
  current?: WithdrawalInfo;
  /** true se il pagamento risulta gia rimborsato (totale o parziale). */
  refunded?: boolean;
  labels?: WithdrawalUiLabels;
}) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const statusLabel: Record<WithdrawalInfo["status"], string> = {
    REQUESTED: labels.status_requested,
    IN_REVIEW: labels.status_in_review,
    ACCEPTED: labels.status_accepted,
    REJECTED: labels.status_rejected,
  };

  // Richiesta gia presente (e non respinta): mostra lo stato, niente nuovo invio.
  if ((current && current.status !== "REJECTED") || done) {
    const status = current?.status ?? "REQUESTED";
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <div className="text-sm text-text">
            <p className="font-semibold">{labels.registered_title}</p>
            <p className="mt-0.5 text-text-muted">
              {fillTemplate(labels.registered_body, {
                status: statusLabel[status],
              })
                .split(statusLabel[status])
                .map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <strong>{statusLabel[status]}</strong>
                    )}
                  </span>
                ))}
            </p>
            {status === "ACCEPTED" && (
              <p className="mt-2 text-text-muted">
                {refunded ? labels.refund_issued : labels.refund_pending}
              </p>
            )}
            {current?.outcomeNote && status !== "REQUESTED" && (
              <p className="mt-2 rounded bg-bg-muted p-2 text-text">
                {current.outcomeNote}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await submitWithdrawal(reason);
      if (res.ok) {
        setDone(true);
        router.refresh();
      } else setError(res.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {current?.status === "REJECTED" && (
        <div className="flex items-start gap-2 rounded-lg border border-primary/15 bg-bg-muted p-3 text-sm text-text-muted">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            {labels.rejected_prev}
            {current.outcomeNote ? `: ${current.outcomeNote}` : "."}{" "}
            {labels.rejected_retry}
          </span>
        </div>
      )}

      <div>
        <label htmlFor="reason" className="mb-1.5 block text-sm font-medium text-text">
          {labels.reason_label}
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder={labels.reason_placeholder}
          className="w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
        />
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-error">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={buttonClasses({ variant: "outline" })}
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {labels.cta}
      </button>
      <p className="text-xs text-text-muted">
        {labels.alt_contact.split("studio@successioniarmellin.it").map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <a
                href="mailto:studio@successioniarmellin.it"
                className="text-accent-dark hover:underline"
              >
                studio@successioniarmellin.it
              </a>
            )}
          </span>
        ))}
      </p>
    </form>
  );
}
