"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileCheck,
  Download,
  Trash2,
  Upload,
  Loader2,
  Plus,
  Send,
  Check,
} from "lucide-react";
import { SectionTitle, CrmCard } from "@/components/crm/ui";
import type { SafeExtras } from "@/lib/practice-extras";
import {
  getFinalDocUrlAdmin,
  deleteFinalDoc,
  notifyFinalDocsReadyAction,
} from "@/app/crm/pratiche/[id]/actions";

type FinalDoc = NonNullable<SafeExtras["finalDocuments"]>[number];

export function FinalDocsCard({
  practiceId,
  docs,
}: {
  practiceId: string;
  docs: FinalDoc[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);
  const [notifying, setNotifying] = useState(false);
  const [notified, setNotified] = useState(false);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function notifyReady() {
    setNotifying(true);
    setError(null);
    startTransition(async () => {
      const res = await notifyFinalDocsReadyAction(practiceId);
      if (res.ok) {
        setNotified(true);
        router.refresh();
        setTimeout(() => setNotified(false), 3000);
      } else {
        setError(res.error);
      }
      setNotifying(false);
    });
  }

  async function download(index: number) {
    setBusy(index);
    setError(null);
    try {
      const res = await getFinalDocUrlAdmin(practiceId, index);
      if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
      else setError(res.error);
    } finally {
      setBusy(null);
    }
  }

  function remove(index: number) {
    setBusy(index);
    setError(null);
    startTransition(async () => {
      await deleteFinalDoc(practiceId, index);
      router.refresh();
      setBusy(null);
    });
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("practiceId", practiceId);
      body.append("label", label);
      const res = await fetch("/api/crm/final-docs/upload", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Caricamento non riuscito.");
        return;
      }
      setLabel("");
      router.refresh();
    } catch {
      setError("Caricamento non riuscito, riprova.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <CrmCard>
      <SectionTitle>Documenti finali (consegna)</SectionTitle>

      {docs.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {docs.map((d, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 rounded-lg border border-crm-border bg-crm-bg2/40 px-3 py-2.5 text-sm"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <FileCheck className="h-4 w-4 shrink-0 text-crm-green" />
                <div className="min-w-0">
                  <p className="truncate text-crm-text">{d.label}</p>
                  <p className="truncate text-xs text-crm-muted">{d.fileName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => download(i)}
                  disabled={busy === i}
                  title="Scarica"
                  className="grid h-6 w-6 place-items-center rounded bg-white/5 text-crm-text2 hover:text-crm-text disabled:opacity-50"
                >
                  {busy === i ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => remove(i)}
                  disabled={busy === i}
                  title="Elimina"
                  className="grid h-6 w-6 place-items-center rounded bg-crm-rose/15 text-crm-rose hover:bg-crm-rose/25 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-crm-muted">
          Nessun documento finale caricato.
        </p>
      )}

      {docs.length > 0 && (
        <button
          onClick={notifyReady}
          disabled={notifying}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-3 py-1.5 text-sm text-crm-text2 hover:text-crm-text disabled:opacity-50"
        >
          {notifying ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : notified ? (
            <Check className="h-3.5 w-3.5 text-crm-green" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          {notified ? "Cliente avvisato" : "Avvisa cliente (documenti pronti)"}
        </button>
      )}

      {/* Upload */}
      <div className="mt-4 space-y-2 border-t border-crm-border pt-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={onFileChange}
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Etichetta (es. Ricevuta di presentazione)"
          className="w-full rounded-lg border border-crm-border bg-crm-bg2 px-2.5 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-3 py-2 text-sm text-crm-text hover:border-crm-accent/40 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <Plus className="h-3.5 w-3.5" />
            </>
          )}
          Carica documento finale
        </button>
        {error && <p className="text-xs text-crm-rose">{error}</p>}
      </div>
    </CrmCard>
  );
}
