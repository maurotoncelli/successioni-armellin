"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Check, X, Download, Loader2, RotateCcw } from "lucide-react";
import type { RequirementStatus } from "@/content/crm-data";
import {
  approveDocument,
  rejectDocument,
  getDocumentUrl,
} from "@/app/crm/pratiche/[id]/actions";

export type CrmDocItem = {
  index: number;
  label: string;
  required: boolean;
  status: RequirementStatus;
  fileName?: string;
  hasFile: boolean;
  reason?: string;
};

const reqStatusMeta: Record<RequirementStatus, { label: string; cls: string }> = {
  ATTESO: { label: "Da caricare", cls: "text-crm-muted" },
  CARICATO: { label: "Caricato", cls: "text-crm-amber" },
  APPROVATO: { label: "Approvato", cls: "text-crm-green" },
  RIFIUTATO: { label: "Da rifare", cls: "text-crm-rose" },
  NON_APPLICABILE: { label: "Non applicabile", cls: "text-crm-muted" },
};

export function CrmChecklist({
  practiceId,
  items,
}: {
  practiceId: string;
  items: CrmDocItem[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  async function download(index: number) {
    setBusy(index);
    try {
      const res = await getDocumentUrl(practiceId, index);
      if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
    } finally {
      setBusy(null);
    }
  }

  function approve(index: number) {
    setBusy(index);
    startTransition(async () => {
      await approveDocument(practiceId, index);
      router.refresh();
      setBusy(null);
    });
  }

  function reject(index: number) {
    const reason = window.prompt(
      "Motivo del rifiuto (verra mostrato al cliente):",
      "",
    );
    if (reason === null) return;
    setBusy(index);
    startTransition(async () => {
      await rejectDocument(practiceId, index, reason);
      router.refresh();
      setBusy(null);
    });
  }

  return (
    <ul className="mt-4 space-y-2">
      {items.map((doc) => {
        const meta = reqStatusMeta[doc.status];
        const isBusy = busy === doc.index;
        return (
          <li
            key={doc.index}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-crm-border bg-crm-bg2/40 px-3 py-2.5 text-sm"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <FileText className="h-4 w-4 shrink-0 text-crm-text2" />
              <span className="truncate text-crm-text">{doc.label}</span>
              {!doc.required && (
                <span className="text-xs text-crm-muted">(facolt.)</span>
              )}
              {doc.fileName && (
                <span className="truncate text-xs text-crm-muted">
                  · {doc.fileName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${meta.cls}`}>
                {meta.label}
              </span>
              {doc.hasFile && (
                <button
                  onClick={() => download(doc.index)}
                  disabled={isBusy}
                  title="Scarica"
                  className="grid h-6 w-6 place-items-center rounded bg-white/5 text-crm-text2 hover:text-crm-text disabled:opacity-50"
                >
                  {isBusy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
              {doc.hasFile && doc.status !== "APPROVATO" && (
                <button
                  onClick={() => approve(doc.index)}
                  disabled={isBusy}
                  title="Approva"
                  className="grid h-6 w-6 place-items-center rounded bg-crm-green/15 text-crm-green hover:bg-crm-green/25 disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
              {doc.hasFile && doc.status !== "RIFIUTATO" && (
                <button
                  onClick={() => reject(doc.index)}
                  disabled={isBusy}
                  title="Rifiuta"
                  className="grid h-6 w-6 place-items-center rounded bg-crm-rose/15 text-crm-rose hover:bg-crm-rose/25 disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              {!doc.hasFile && doc.status === "RIFIUTATO" && (
                <span title="In attesa di nuovo caricamento" className="text-crm-muted">
                  <RotateCcw className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
