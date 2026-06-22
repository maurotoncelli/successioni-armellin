"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileSignature,
  Download,
  Eye,
  Loader2,
  Copy,
  Check,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { SectionTitle, CrmCard } from "@/components/crm/ui";
import type { SafeExtras } from "@/lib/practice-extras";
import { getMandateUrl, getIban, clearIban } from "@/app/crm/pratiche/[id]/actions";

export function PracticeExtrasCard({
  practiceId,
  extras,
}: {
  practiceId: string;
  extras: SafeExtras;
}) {
  const router = useRouter();
  const [iban, setIban] = useState<string | null>(null);
  const [busy, setBusy] = useState<"mandate" | "iban" | "clear" | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function downloadMandate() {
    setBusy("mandate");
    setError(null);
    try {
      const res = await getMandateUrl(practiceId);
      if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
      else setError(res.error);
    } finally {
      setBusy(null);
    }
  }

  async function reveal() {
    setBusy("iban");
    setError(null);
    try {
      const res = await getIban(practiceId);
      if (res.ok) setIban(res.iban);
      else setError(res.error);
    } finally {
      setBusy(null);
    }
  }

  function copy() {
    if (!iban) return;
    navigator.clipboard.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function clear() {
    setBusy("clear");
    setError(null);
    startTransition(async () => {
      await clearIban(practiceId);
      setIban(null);
      setConfirmClear(false);
      router.refresh();
      setBusy(null);
    });
  }

  const mandate = extras.mandate;

  return (
    <CrmCard>
      <SectionTitle>Mandato &amp; IBAN</SectionTitle>

      <div className="mt-3 space-y-3 text-sm">
        {/* Mandato */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <FileSignature className="mt-0.5 h-4 w-4 text-crm-text2" />
            <div>
              <p className="text-crm-text">Mandato</p>
              {mandate ? (
                <p className="text-xs text-crm-green">
                  Firmato ·{" "}
                  {mandate.method === "PAPER" ? "cartaceo" : "elettronico"} ·{" "}
                  {mandate.signedAt.slice(0, 10)}
                </p>
              ) : (
                <p className="text-xs text-crm-muted">Non ancora firmato</p>
              )}
            </div>
          </div>
          {mandate?.hasFile && (
            <button
              onClick={downloadMandate}
              disabled={busy === "mandate"}
              className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-2.5 py-1.5 text-xs text-crm-text hover:border-crm-accent/40 disabled:opacity-50"
            >
              {busy === "mandate" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              Scarica
            </button>
          )}
        </div>

        {/* IBAN */}
        <div className="border-t border-crm-border pt-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-crm-text">IBAN erede</p>
              {extras.iban ? (
                iban ? (
                  <p className="font-mono text-xs text-crm-text">{iban}</p>
                ) : (
                  <p className="text-xs text-crm-muted">
                    Salvato (cifrato) · termina con ••{extras.iban.last4}
                  </p>
                )
              ) : extras.ibanClearedAt ? (
                <p className="flex items-center gap-1 text-xs text-crm-green">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Usato e cancellato il {extras.ibanClearedAt.slice(0, 10)}
                </p>
              ) : (
                <p className="text-xs text-crm-muted">Non ancora fornito</p>
              )}
            </div>
            {extras.iban &&
              (iban ? (
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-2.5 py-1.5 text-xs text-crm-text hover:border-crm-accent/40"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-crm-green" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copiato" : "Copia"}
                </button>
              ) : (
                <button
                  onClick={reveal}
                  disabled={busy === "iban"}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-2.5 py-1.5 text-xs text-crm-text hover:border-crm-accent/40 disabled:opacity-50"
                >
                  {busy === "iban" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  Mostra
                </button>
              ))}
          </div>

          {/* Cancellazione dopo l'F24 (retention @10) */}
          {extras.iban && (
            <div className="mt-2">
              {confirmClear ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-crm-text2">F24 effettuato? L&apos;IBAN verra cancellato.</span>
                  <button
                    onClick={clear}
                    disabled={busy === "clear"}
                    className="inline-flex items-center gap-1 rounded bg-crm-rose/15 px-2 py-1 text-crm-rose hover:bg-crm-rose/25 disabled:opacity-50"
                  >
                    {busy === "clear" ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Conferma
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="text-crm-muted hover:text-crm-text"
                  >
                    Annulla
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex items-center gap-1 text-xs text-crm-text2 hover:text-crm-rose"
                >
                  <Trash2 className="h-3 w-3" />
                  F24 fatto · cancella IBAN
                </button>
              )}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-crm-rose">{error}</p>}
      </div>
    </CrmCard>
  );
}
