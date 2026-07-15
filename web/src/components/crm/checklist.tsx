"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Check,
  X,
  Download,
  Loader2,
  RotateCcw,
  Upload,
  ListPlus,
} from "lucide-react";
import type { RequirementStatus } from "@/content/crm-data";
import {
  approveDocument,
  rejectDocument,
  getDocumentUrl,
  createChecklistNow,
} from "@/app/crm/pratiche/[id]/actions";

export type CrmDocItem = {
  index: number;
  label: string;
  required: boolean;
  status: RequirementStatus;
  /** Nomi dei file caricati (piu file per voce, es. fronte/retro). */
  files: string[];
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
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadIndex = useRef<number | null>(null);

  // Upload da parte di Lorenzo (cliente seguito in studio): il documento
  // nasce direttamente APPROVATO.
  function pickFile(index: number) {
    uploadIndex.current = index;
    fileInput.current?.click();
  }

  async function uploadPicked(files: FileList | null) {
    const index = uploadIndex.current;
    if (!files || files.length === 0 || index === null) return;
    setBusy(index);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.set("practiceId", practiceId);
        form.set("index", String(index));
        form.set("file", file);
        const res = await fetch("/api/crm/documents/upload", {
          method: "POST",
          body: form,
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          setError(body?.error ?? "Caricamento non riuscito, riprova.");
          break;
        }
      }
      router.refresh();
    } finally {
      setBusy(null);
      uploadIndex.current = null;
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function download(index: number, fileIdx: number) {
    setBusy(index);
    try {
      const res = await getDocumentUrl(practiceId, index, fileIdx);
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
    <>
      <input
        ref={fileInput}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        className="hidden"
        onChange={(e) => uploadPicked(e.target.files)}
      />
      {error && (
        <p className="mt-3 rounded-lg bg-crm-rose/10 p-2.5 text-xs text-crm-rose">
          {error}
        </p>
      )}
      <ul className="mt-4 space-y-2">
      {items.map((doc) => {
        const meta = reqStatusMeta[doc.status];
        const isBusy = busy === doc.index;
        const hasFile = doc.files.length > 0;
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
              {hasFile && (
                <span className="flex min-w-0 flex-wrap items-center gap-x-2 text-xs text-crm-muted">
                  {doc.files.map((name, fileIdx) => (
                    <button
                      key={`${fileIdx}-${name}`}
                      onClick={() => download(doc.index, fileIdx)}
                      disabled={isBusy}
                      title={`Scarica ${name}`}
                      className="inline-flex max-w-44 items-center gap-1 truncate underline-offset-2 hover:text-crm-text hover:underline disabled:opacity-50"
                    >
                      <Download className="h-3 w-3 shrink-0" />
                      <span className="truncate">{name}</span>
                    </button>
                  ))}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${meta.cls}`}>
                {meta.label}
              </span>
              {isBusy && <Loader2 className="h-3.5 w-3.5 animate-spin text-crm-muted" />}
              {doc.status !== "NON_APPLICABILE" && (
                <button
                  onClick={() => pickFile(doc.index)}
                  disabled={isBusy}
                  title="Carica per il cliente (es. documenti consegnati in studio)"
                  className="grid h-6 w-6 place-items-center rounded bg-crm-bg2 text-crm-text2 hover:text-crm-text disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                </button>
              )}
              {hasFile && doc.status !== "APPROVATO" && (
                <button
                  onClick={() => approve(doc.index)}
                  disabled={isBusy}
                  title="Approva"
                  className="grid h-6 w-6 place-items-center rounded bg-crm-green/15 text-crm-green hover:bg-crm-green/25 disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
              {hasFile && doc.status !== "RIFIUTATO" && (
                <button
                  onClick={() => reject(doc.index)}
                  disabled={isBusy}
                  title="Rifiuta"
                  className="grid h-6 w-6 place-items-center rounded bg-crm-rose/15 text-crm-rose hover:bg-crm-rose/25 disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              {!hasFile && doc.status === "RIFIUTATO" && (
                <span title="In attesa di nuovo caricamento" className="text-crm-muted">
                  <RotateCcw className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </li>
        );
      })}
      </ul>
    </>
  );
}

/*
  Pulsante "Genera checklist" per le pratiche create a mano nel CRM (la
  checklist normalmente nasce al pagamento): permette a Lorenzo di iniziare
  subito a caricare i documenti di un cliente seguito in studio.
*/
export function GenerateChecklistButton({ practiceId }: { practiceId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function generate() {
    setError(null);
    startTransition(async () => {
      const res = await createChecklistNow(practiceId);
      if (!res.ok) setError(res.error);
      router.refresh();
    });
  }

  return (
    <div className="mt-3">
      <button
        onClick={generate}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg border border-crm-border bg-crm-bg2/60 px-3 py-2 text-sm font-medium text-crm-text hover:bg-crm-bg2 disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ListPlus className="h-4 w-4" />
        )}
        Genera checklist adesso
      </button>
      {error && <p className="mt-2 text-xs text-crm-rose">{error}</p>}
    </div>
  );
}
