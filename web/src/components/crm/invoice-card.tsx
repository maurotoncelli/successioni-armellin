"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Receipt, Download, Loader2, Trash2, Sparkles } from "lucide-react";
import { SectionTitle, CrmCard } from "@/components/crm/ui";
import type { SafeInvoice } from "@/lib/practice-extras";
import {
  generateInvoice,
  getInvoiceUrlAdmin,
  deleteInvoice,
} from "@/app/crm/pratiche/[id]/actions";

export function InvoiceCard({
  practiceId,
  invoice,
  invoicingConfigured,
  paid,
}: {
  practiceId: string;
  invoice?: SafeInvoice;
  invoicingConfigured: boolean;
  paid: boolean;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [number, setNumber] = useState("");
  const [issuedAt, setIssuedAt] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [busy, setBusy] = useState<"gen" | "down" | "del" | "manual" | null>(
    null,
  );
  const [showManual, setShowManual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function download() {
    setBusy("down");
    setError(null);
    try {
      const res = await getInvoiceUrlAdmin(practiceId);
      if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
      else setError(res.error);
    } finally {
      setBusy(null);
    }
  }

  function generate() {
    setBusy("gen");
    setError(null);
    startTransition(async () => {
      const res = await generateInvoice(practiceId);
      if (!res.ok) setError(res.error);
      else router.refresh();
      setBusy(null);
    });
  }

  function remove() {
    setBusy("del");
    setError(null);
    startTransition(async () => {
      await deleteInvoice(practiceId);
      router.refresh();
      setBusy(null);
    });
  }

  async function saveManual(e: React.FormEvent) {
    e.preventDefault();
    if (!number.trim()) {
      setError("Inserisci il numero della fattura.");
      return;
    }
    setBusy("manual");
    setError(null);
    try {
      const body = new FormData();
      body.append("practiceId", practiceId);
      body.append("number", number);
      body.append("issuedAt", issuedAt);
      const file = fileInputRef.current?.files?.[0];
      if (file) body.append("file", file);
      const res = await fetch("/api/crm/invoice/upload", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Registrazione non riuscita.");
        return;
      }
      setNumber("");
      setShowManual(false);
      router.refresh();
    } catch {
      setError("Registrazione non riuscita, riprova.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <CrmCard>
      <SectionTitle>Fattura onorario</SectionTitle>

      {invoice ? (
        <div className="mt-3 space-y-3 text-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <Receipt className="mt-0.5 h-4 w-4 text-crm-green" />
              <div>
                <p className="text-crm-text">N. {invoice.number}</p>
                <p className="text-xs text-crm-muted">
                  {invoice.issuedAt} · {invoice.amount} € ·{" "}
                  {invoice.provider === "MANUAL"
                    ? "registrata a mano"
                    : "FattureInCloud"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {invoice.hasFile && (
                <button
                  onClick={download}
                  disabled={busy === "down"}
                  title="Scarica PDF"
                  className="grid h-7 w-7 place-items-center rounded bg-white/5 text-crm-text2 hover:text-crm-text disabled:opacity-50"
                >
                  {busy === "down" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
              <button
                onClick={remove}
                disabled={busy === "del"}
                title="Elimina"
                className="grid h-7 w-7 place-items-center rounded bg-crm-rose/15 text-crm-rose hover:bg-crm-rose/25 disabled:opacity-50"
              >
                {busy === "del" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
          {!invoice.hasFile && (
            <p className="rounded-lg bg-crm-bg2/60 p-2.5 text-xs text-crm-muted">
              Numero registrato, PDF non allegato. Puoi caricarlo registrando di
              nuovo la fattura con lo stesso numero.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {invoicingConfigured ? (
            <>
              <button
                onClick={generate}
                disabled={!paid || busy === "gen"}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-crm-accent px-3 py-2 text-sm font-medium text-white hover:bg-crm-accent/90 disabled:opacity-50"
              >
                {busy === "gen" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Genera fattura automatica
              </button>
              {!paid && (
                <p className="text-xs text-crm-muted">
                  Disponibile dopo il pagamento dell&apos;onorario.
                </p>
              )}
            </>
          ) : (
            <p className="rounded-lg bg-crm-bg2/60 p-2.5 text-xs text-crm-muted">
              Fatturazione automatica non attiva. Registra qui la fattura emessa
              dal tuo gestionale.
            </p>
          )}

          {!showManual ? (
            <button
              onClick={() => setShowManual(true)}
              className="text-sm text-crm-text2 underline-offset-2 hover:text-crm-text hover:underline"
            >
              Registra fattura manualmente
            </button>
          ) : (
            <form
              onSubmit={saveManual}
              className="space-y-2 border-t border-crm-border pt-3"
            >
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Numero fattura (es. 12/2026)"
                className="w-full rounded-lg border border-crm-border bg-crm-bg2 px-2.5 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent"
              />
              <input
                type="date"
                value={issuedAt}
                onChange={(e) => setIssuedAt(e.target.value)}
                className="w-full rounded-lg border border-crm-border bg-crm-bg2 px-2.5 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="block w-full text-xs text-crm-text2 file:mr-2 file:rounded file:border-0 file:bg-crm-surface file:px-2 file:py-1 file:text-crm-text"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={busy === "manual"}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-3 py-1.5 text-sm text-crm-text hover:border-crm-accent/40 disabled:opacity-50"
                >
                  {busy === "manual" && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Salva
                </button>
                <button
                  type="button"
                  onClick={() => setShowManual(false)}
                  className="text-sm text-crm-muted hover:text-crm-text"
                >
                  Annulla
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-crm-rose">{error}</p>}
    </CrmCard>
  );
}
