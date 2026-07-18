"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  HelpCircle,
  PartyPopper,
  FileCheck2,
  Download,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { ToneBadge } from "@/components/area/ui";
import type { ClientDocState } from "@/content/area-data";
import { submitDocuments } from "@/app/area-riservata/(app)/documenti/actions";
import { templatesForLabel } from "@/lib/doc-templates";
import { cn } from "@/lib/utils";
import {
  DOCS_UI_IT,
  fillTemplate,
  type DocsUiLabels,
} from "@/lib/area-ui-labels";

export type DocItem = {
  index: number; // indice nella checklist della pratica (chiave per le azioni server)
  label: string;
  required: boolean;
  state: ClientDocState;
  reason?: string;
  help?: string;
  /** Nomi dei file caricati per la voce (max MAX_FILES). */
  files: string[];
  /** Modelli scaricabili (risolti server-side dal catalogo CRM). */
  templates?: { href: string; name: string }[];
};

const ACCEPT = ".pdf,.jpg,.jpeg,.png";
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 10;

export function DocumentsClient({
  initial,
  labels = DOCS_UI_IT,
}: {
  initial: DocItem[];
  labels?: DocsUiLabels;
}) {
  const router = useRouter();
  const [docs, setDocs] = useState<DocItem[]>(initial);
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, startSubmit] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingIndexRef = useRef<number | null>(null);

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

  function triggerUpload(index: number) {
    setError(null);
    pendingIndexRef.current = index;
    fileInputRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const index = pendingIndexRef.current;
    e.target.value = ""; // consente di ricaricare lo stesso file
    pendingIndexRef.current = null;
    if (!file || index === null) return;

    if (file.size > MAX_BYTES) {
      setError(labels.err_file_too_big);
      return;
    }

    setUploading(index);
    setSubmitted(false);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("index", String(index));
      const res = await fetch("/api/area/documents/upload", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as { error?: string; files?: string[] };
      if (!res.ok) {
        setError(data.error ?? labels.err_upload_failed);
        return;
      }
      setDocs((prev) =>
        prev.map((d) =>
          d.index === index
            ? {
                ...d,
                state: "CARICATO",
                reason: undefined,
                files: data.files ?? d.files,
              }
            : d,
        ),
      );
      router.refresh();
    } catch {
      setError(labels.err_upload_network);
    } finally {
      setUploading(null);
    }
  }

  async function removeFile(index: number, fileIdx: number) {
    setError(null);
    setSubmitted(false);
    setUploading(index);
    try {
      const res = await fetch("/api/area/documents/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, fileIdx }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? labels.err_delete_failed);
        return;
      }
      setDocs((prev) =>
        prev.map((d) => {
          if (d.index !== index) return d;
          const files = d.files.filter((_, i) => i !== fileIdx);
          return {
            ...d,
            files,
            state: files.length > 0 ? d.state : "DA_CARICARE",
            reason: undefined,
          };
        }),
      );
      router.refresh();
    } catch {
      setError(labels.err_delete_network);
    } finally {
      setUploading(null);
    }
  }

  function handleSubmit() {
    setError(null);
    startSubmit(async () => {
      const res = await submitDocuments();
      if (res.ok) {
        setSubmitted(true);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  // ordina: prima quelli da fare, poi i caricati
  const order = docs
    .slice()
    .sort((a, b) => {
      const rank = (s: ClientDocState) => (s === "CARICATO" ? 1 : 0);
      return rank(a.state) - rank(b.state);
    });

  return (
    <div className="pb-28 lg:pb-0">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={onFileChange}
      />

      {/* Contatore + barra */}
      <div className="mb-5 rounded-2xl border border-primary/10 bg-bg p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-text">
            {fillTemplate(labels.counter, {
              uploaded: uploadedRequired,
              total: requiredDocs.length,
            })}
          </span>
          <span className="text-text-muted">
            {complete
              ? labels.all_uploaded
              : fillTemplate(labels.missing_n, { n: missing })}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-2xl border border-error/30 bg-error/10 p-3 text-sm text-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Lista */}
      <ul className="space-y-3">
        {order.map((d) => (
          <li
            key={d.index}
            className={cn(
              "rounded-2xl border bg-bg p-4 shadow-sm",
              d.state === "DA_RIFARE" ? "border-error/30" : "border-primary/10",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-text">{d.label}</span>
                  {!d.required && (
                    <span className="text-xs text-text-muted">
                      {labels.optional}
                    </span>
                  )}
                </div>
                {d.help && (
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-text-muted">
                    <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {d.help}
                  </p>
                )}
                <DocTemplates
                  label={d.label}
                  templates={d.templates}
                  labels={labels}
                />
                {d.files.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {d.files.map((name, fileIdx) => (
                      <li
                        key={`${fileIdx}-${name}`}
                        className="flex items-center gap-1.5 text-xs text-text-muted"
                      >
                        <FileCheck2 className="h-3.5 w-3.5 shrink-0 text-success" />
                        <span className="truncate">{name}</span>
                        <button
                          onClick={() => removeFile(d.index, fileIdx)}
                          disabled={uploading === d.index}
                          title={labels.delete_file}
                          className="ms-1 text-text-muted hover:text-error disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {d.state === "DA_RIFARE" && d.reason && (
                  <p className="mt-2 rounded-lg bg-error/10 px-3 py-2 text-xs text-error">
                    {d.reason}
                  </p>
                )}
              </div>
              <DocStateBadge state={d.state} labels={labels} />
            </div>

            {d.files.length < MAX_FILES && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => triggerUpload(d.index)}
                  disabled={uploading === d.index}
                  className={buttonClasses({
                    variant:
                      d.state === "DA_RIFARE"
                        ? "primary"
                        : d.files.length === 0
                          ? "outline"
                          : "ghost",
                    className: "py-2 text-sm",
                  })}
                >
                  {uploading === d.index ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {labels.uploading}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {d.state === "DA_RIFARE"
                        ? labels.reupload
                        : d.files.length > 0
                          ? labels.add_another
                          : labels.upload}
                    </>
                  )}
                </button>
                {d.files.length > 0 && d.state !== "DA_RIFARE" && (
                  <span className="text-xs text-text-muted">
                    {labels.multi_page_hint}
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {submitted && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-4">
          <PartyPopper className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <p className="text-sm text-text">
            <span className="font-semibold">{labels.done_title}</span>{" "}
            {labels.done_body}
          </p>
        </div>
      )}

      {/* Pulsante-cancello sticky */}
      <div className="fixed inset-x-0 bottom-[57px] z-20 border-t border-primary/10 bg-bg/95 p-4 backdrop-blur lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="mx-auto max-w-6xl">
          {complete ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={buttonClasses({ size: "lg", className: "w-full" })}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Check className="h-5 w-5" />
              )}
              {labels.submit_cta}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-[10px] bg-bg-muted py-3.5 text-sm font-medium text-text-muted">
              <AlertCircle className="h-4 w-4" />
              {missing === 1
                ? labels.missing_one
                : fillTemplate(labels.missing_many, { n: missing })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocStateBadge({
  state,
  labels,
}: {
  state: ClientDocState;
  labels: DocsUiLabels;
}) {
  const map = {
    DA_CARICARE: {
      label: labels.state_da_caricare,
      tone: "warning" as const,
    },
    CARICATO: { label: labels.state_caricato, tone: "success" as const },
    DA_RIFARE: { label: labels.state_da_rifare, tone: "error" as const },
  };
  const meta = map[state];
  return <ToneBadge tone={meta.tone}>{meta.label}</ToneBadge>;
}

/*
  Modelli precompilati abbinati alla voce: il cliente li scarica, li compila,
  li firma e li ricarica nella stessa voce (vedi lib/doc-templates).
*/
function DocTemplates({
  label,
  templates: fromServer,
  labels,
}: {
  label: string;
  templates?: { href: string; name: string }[];
  labels: DocsUiLabels;
}) {
  // Se la pagina ha passato l'elenco (anche vuoto), rispettalo: evita di
  // ripristinare i default quando Lorenzo ha rimosso tutti i modelli.
  const templates =
    fromServer !== undefined ? fromServer : templatesForLabel(label);
  if (templates.length === 0) return null;
  return (
    <div className="mt-2 rounded-xl border border-accent/25 bg-accent/5 px-3 py-2.5">
      <p className="text-xs font-medium text-text">{labels.templates_title}</p>
      <ul className="mt-1.5 space-y-1">
        {templates.map((t) => (
          <li key={t.href}>
            <a
              href={t.href}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1.5 text-xs font-medium text-accent underline underline-offset-2 hover:text-accent-dark"
            >
              <Download className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {t.name}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-1.5 text-[11px] leading-4 text-text-muted">
        {labels.templates_help}
      </p>
    </div>
  );
}
