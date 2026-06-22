"use client";

import { useMemo, useState } from "react";
import {
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  HelpCircle,
  PartyPopper,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { ToneBadge } from "@/components/area/ui";
import { clientDocMeta, type ClientDocState } from "@/content/area-data";
import { cn } from "@/lib/utils";

export type DocItem = {
  label: string;
  required: boolean;
  state: ClientDocState;
  reason?: string;
  help?: string;
};

export function DocumentsClient({ initial }: { initial: DocItem[] }) {
  const [docs, setDocs] = useState<DocItem[]>(initial);
  const [uploading, setUploading] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const requiredDocs = docs.filter((d) => d.required);
  const uploadedRequired = requiredDocs.filter(
    (d) => d.state === "CARICATO",
  ).length;
  const missing = requiredDocs.length - uploadedRequired;
  const complete = missing === 0;

  const uploadedTotal = docs.filter((d) => d.state === "CARICATO").length;
  const progress = useMemo(
    () => (docs.length ? (uploadedTotal / docs.length) * 100 : 0),
    [uploadedTotal, docs.length],
  );

  function simulateUpload(index: number) {
    setUploading(index);
    setSubmitted(false);
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d, i) =>
          i === index ? { ...d, state: "CARICATO", reason: undefined } : d,
        ),
      );
      setUploading(null);
    }, 900);
  }

  function removeDoc(index: number) {
    setDocs((prev) =>
      prev.map((d, i) => (i === index ? { ...d, state: "DA_CARICARE" } : d)),
    );
    setSubmitted(false);
  }

  // ordina: prima quelli da fare, poi i caricati
  const order = docs
    .map((d, i) => ({ d, i }))
    .sort((a, b) => {
      const rank = (s: ClientDocState) => (s === "CARICATO" ? 1 : 0);
      return rank(a.d.state) - rank(b.d.state);
    });

  return (
    <div className="pb-28 lg:pb-0">
      {/* Contatore + barra */}
      <div className="mb-5 rounded-2xl border border-primary/10 bg-bg p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-text">
            Documenti: {uploadedRequired} di {requiredDocs.length}
          </span>
          <span className="text-text-muted">
            {complete ? "Tutti caricati" : `Mancano ${missing}`}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lista */}
      <ul className="space-y-3">
        {order.map(({ d, i }) => (
          <li
            key={d.label}
            className={cn(
              "rounded-2xl border bg-bg p-4 shadow-sm",
              d.state === "DA_RIFARE"
                ? "border-error/30"
                : "border-primary/10",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-text">{d.label}</span>
                  {!d.required && (
                    <span className="text-xs text-text-muted">(facoltativo)</span>
                  )}
                </div>
                {d.help && (
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-text-muted">
                    <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {d.help}
                  </p>
                )}
                {d.state === "DA_RIFARE" && d.reason && (
                  <p className="mt-2 rounded-lg bg-error/10 px-3 py-2 text-xs text-error">
                    {d.reason}
                  </p>
                )}
              </div>
              <DocStateBadge state={d.state} />
            </div>

            <div className="mt-3 flex items-center gap-2">
              {d.state === "CARICATO" ? (
                <button
                  onClick={() => removeDoc(i)}
                  className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg-muted"
                >
                  <Trash2 className="h-4 w-4" />
                  Elimina
                </button>
              ) : (
                <button
                  onClick={() => simulateUpload(i)}
                  disabled={uploading === i}
                  className={buttonClasses({
                    variant: d.state === "DA_RIFARE" ? "primary" : "outline",
                    className: "py-2 text-sm",
                  })}
                >
                  {uploading === i ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Caricamento…
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {d.state === "DA_RIFARE" ? "Ricarica" : "Carica"}
                    </>
                  )}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {submitted && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-4">
          <PartyPopper className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <p className="text-sm text-text">
            <span className="font-semibold">Fatto!</span> Lorenzo ha ricevuto i
            tuoi documenti e li sta controllando. Ti avvisiamo se manca qualcosa —
            puoi stare tranquillo.
          </p>
        </div>
      )}

      {/* Pulsante-cancello sticky */}
      <div className="fixed inset-x-0 bottom-[57px] z-20 border-t border-primary/10 bg-bg/95 p-4 backdrop-blur lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="mx-auto max-w-6xl">
          {complete ? (
            <button
              onClick={() => setSubmitted(true)}
              className={buttonClasses({ size: "lg", className: "w-full" })}
            >
              <Check className="h-5 w-5" />
              Ho finito — invia a Lorenzo
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-[10px] bg-bg-muted py-3.5 text-sm font-medium text-text-muted">
              <AlertCircle className="h-4 w-4" />
              {missing === 1 ? "Manca 1 documento" : `Mancano ${missing} documenti`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocStateBadge({ state }: { state: ClientDocState }) {
  const meta = clientDocMeta[state];
  return <ToneBadge tone={meta.tone}>{meta.label}</ToneBadge>;
}
