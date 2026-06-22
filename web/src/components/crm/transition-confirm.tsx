"use client";

import { AlertTriangle, Loader2, Mail } from "lucide-react";
import { statusLabels, type PracticeStatus } from "@/content/crm-data";
import { transitionEmailLabel } from "@/lib/transitions";

/*
  Modale di conferma per le transizioni a effetto esterno (@05 righe 129-134).
  Riepiloga cosa accadra (in particolare l'email che verra inviata al cliente)
  prima di eseguire il cambio stato.
*/

export function TransitionConfirm({
  targetStatus,
  pending,
  onConfirm,
  onCancel,
}: {
  targetStatus: PracticeStatus;
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const emailLabel = transitionEmailLabel[targetStatus];
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-crm-border bg-crm-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-crm-amber/15 text-crm-amber">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-crm-text">
              Conferma cambio stato
            </h3>
            <p className="mt-1 text-sm text-crm-text2">
              Stai spostando la pratica in{" "}
              <strong className="text-crm-text">
                {statusLabels[targetStatus]}
              </strong>
              .
            </p>
            {emailLabel && (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-crm-bg2/60 p-3 text-xs text-crm-text2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-crm-accent" />
                <span>
                  Verra inviata automaticamente un&apos;email al cliente:{" "}
                  <strong className="text-crm-text">{emailLabel}</strong>.
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={pending}
            className="rounded-lg border border-crm-border bg-crm-surface px-3 py-2 text-sm text-crm-text2 hover:text-crm-text disabled:opacity-50"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg crm-gradient px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Conferma e invia
          </button>
        </div>
      </div>
    </div>
  );
}
