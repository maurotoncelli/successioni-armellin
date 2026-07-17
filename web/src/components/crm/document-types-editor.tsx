"use client";

import { useRef, useState, useTransition } from "react";
import {
  Check,
  FileText,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import {
  WHEN_LABELS,
  type DocWhen,
  type DocumentTypeDef,
  type ManagedDocTemplate,
} from "@/lib/document-types-shared";
import {
  saveDocumentTypes,
  uploadDocumentTemplate,
} from "@/app/crm/tipologie-documenti/actions";
import { cn } from "@/lib/utils";

type Row = DocumentTypeDef & {
  active: boolean;
  templates: ManagedDocTemplate[];
};

export function DocumentTypesEditor({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const activeCount = rows.filter((r) => r.active).length;
  const withTemplates = rows.filter((r) => r.templates.length > 0).length;

  function toggleActive(id: string) {
    setRows((list) =>
      list.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    );
  }

  function addCustom() {
    const id = `custom_${crypto.randomUUID().slice(0, 8)}`;
    setRows((list) => [
      ...list,
      {
        id,
        label: "",
        required: true,
        help: "",
        when: "always",
        builtin: false,
        active: true,
        templates: [],
      },
    ]);
  }

  function updateCustom(
    id: string,
    patch: Partial<Pick<Row, "label" | "help" | "required" | "when">>,
  ) {
    setRows((list) =>
      list.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  }

  function removeCustom(id: string) {
    setRows((list) => list.filter((r) => r.id !== id));
  }

  function updateTemplateName(typeId: string, tplId: string, name: string) {
    setRows((list) =>
      list.map((r) =>
        r.id !== typeId
          ? r
          : {
              ...r,
              templates: r.templates.map((t) =>
                t.id === tplId ? { ...t, name } : t,
              ),
            },
      ),
    );
  }

  function removeTemplate(typeId: string, tplId: string) {
    setRows((list) =>
      list.map((r) =>
        r.id !== typeId
          ? r
          : { ...r, templates: r.templates.filter((t) => t.id !== tplId) },
      ),
    );
  }

  function save() {
    setMessage(null);
    startTransition(async () => {
      const active: Record<string, boolean> = {};
      const templatesByTypeId: Record<string, ManagedDocTemplate[]> = {};
      for (const r of rows) {
        active[r.id] = r.active;
        // Salva sempre l'elenco (anche vuoto) cosi' si possono rimuovere i default.
        templatesByTypeId[r.id] = r.templates;
      }
      const custom = rows
        .filter((r) => !r.builtin)
        .map((r) => ({
          id: r.id,
          label: r.label,
          required: r.required,
          help: r.help,
          when: r.when,
        }));
      const res = await saveDocumentTypes({ active, templatesByTypeId, custom });
      setMessage(
        res.ok
          ? "Salvato. Checklist e modelli aggiornati."
          : res.error,
      );
    });
  }

  function onUpload(typeId: string, file: File | null, name: string) {
    if (!file) return;
    setMessage(null);
    setUploadingId(typeId);
    const fd = new FormData();
    fd.set("file", file);
    if (name.trim()) fd.set("name", name.trim());
    startTransition(async () => {
      const res = await uploadDocumentTemplate(typeId, fd);
      setUploadingId(null);
      if (!res.ok) {
        setMessage(res.error);
        return;
      }
      setRows((list) =>
        list.map((r) =>
          r.id === typeId
            ? { ...r, templates: [...r.templates, res.template] }
            : r,
        ),
      );
      setMessage("Modello caricato e salvato.");
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-crm-border bg-crm-surface px-4 py-3">
        <p className="text-sm text-crm-text2">
          <span className="font-semibold text-crm-text">{activeCount}</span>{" "}
          attivi in checklist ·{" "}
          <span className="font-semibold text-crm-text">{withTemplates}</span>{" "}
          con modelli PDF
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addCustom}
            className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border px-3 py-1.5 text-xs font-medium text-crm-text2 hover:bg-crm-hover"
          >
            <Plus className="h-3.5 w-3.5" />
            Aggiungi tipologia
          </button>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-crm-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {pending && !uploadingId ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Salva
          </button>
        </div>
      </div>

      {message && (
        <p
          className={cn(
            "text-sm",
            message.includes("Salvat") || message.includes("caricato")
              ? "text-crm-green"
              : "text-crm-rose",
          )}
        >
          {message}
        </p>
      )}

      <ul className="space-y-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className={cn(
              "rounded-[14px] border border-crm-border bg-crm-surface px-4 py-3",
              !row.active && "opacity-60",
            )}
          >
            <div className="flex flex-wrap items-start gap-3">
              <label className="mt-0.5 flex cursor-pointer items-center gap-2 text-xs font-medium text-crm-text2">
                <input
                  type="checkbox"
                  checked={row.active}
                  onChange={() => toggleActive(row.id)}
                  className="h-4 w-4 rounded border-crm-border"
                />
                In checklist auto
              </label>
              <span className="rounded-full bg-crm-bg2 px-2 py-0.5 text-[11px] text-crm-muted">
                {WHEN_LABELS[row.when]}
              </span>
              {!row.builtin && (
                <button
                  type="button"
                  onClick={() => removeCustom(row.id)}
                  className="ml-auto grid h-7 w-7 place-items-center rounded-lg text-crm-muted hover:bg-crm-hover hover:text-crm-rose"
                  title="Elimina"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {row.builtin ? (
              <>
                <p className="mt-2 text-sm font-medium text-crm-text">
                  {row.label}
                  {row.required ? "" : " · facoltativo"}
                </p>
                {row.help && (
                  <p className="mt-1 text-xs leading-relaxed text-crm-muted">
                    {row.help}
                  </p>
                )}
              </>
            ) : (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input
                  value={row.label}
                  onChange={(e) =>
                    updateCustom(row.id, { label: e.target.value })
                  }
                  placeholder="Nome documento"
                  className="rounded-lg border border-crm-border bg-crm-bg2 px-3 py-2 text-sm text-crm-text"
                />
                <select
                  value={row.when}
                  onChange={(e) =>
                    updateCustom(row.id, { when: e.target.value as DocWhen })
                  }
                  className="rounded-lg border border-crm-border bg-crm-bg2 px-3 py-2 text-sm text-crm-text"
                >
                  {(Object.keys(WHEN_LABELS) as DocWhen[]).map((w) => (
                    <option key={w} value={w}>
                      {WHEN_LABELS[w]}
                    </option>
                  ))}
                </select>
                <input
                  value={row.help}
                  onChange={(e) =>
                    updateCustom(row.id, { help: e.target.value })
                  }
                  placeholder="Aiuto per il cliente (facoltativo)"
                  className="sm:col-span-2 rounded-lg border border-crm-border bg-crm-bg2 px-3 py-2 text-sm text-crm-text"
                />
                <label className="flex items-center gap-2 text-xs text-crm-text2">
                  <input
                    type="checkbox"
                    checked={row.required}
                    onChange={(e) =>
                      updateCustom(row.id, { required: e.target.checked })
                    }
                  />
                  Obbligatorio
                </label>
              </div>
            )}

            {/* Template PDF */}
            <div className="mt-3 rounded-xl border border-crm-border/80 bg-crm-bg2/40 px-3 py-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-crm-muted">
                <FileText className="h-3.5 w-3.5" />
                Modelli scaricabili
              </div>

              {row.templates.length === 0 ? (
                <p className="mt-2 text-xs text-crm-muted">
                  Nessun modello. Il cliente non vedrà link di download su questa
                  voce.
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {row.templates.map((t) => (
                    <li
                      key={t.id}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <input
                        value={t.name}
                        onChange={(e) =>
                          updateTemplateName(row.id, t.id, e.target.value)
                        }
                        className="min-w-0 flex-1 rounded-lg border border-crm-border bg-crm-surface px-2.5 py-1.5 text-xs text-crm-text"
                      />
                      <a
                        href={
                          t.storagePath
                            ? `/api/doc-templates/download?path=${encodeURIComponent(t.storagePath)}`
                            : t.href
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-crm-accent hover:underline"
                      >
                        Anteprima
                      </a>
                      <button
                        type="button"
                        onClick={() => removeTemplate(row.id, t.id)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-crm-muted hover:bg-crm-hover hover:text-crm-rose"
                        title="Rimuovi modello"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  ref={(el) => {
                    fileRefs.current[row.id] = el;
                  }}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    e.target.value = "";
                    onUpload(row.id, f, "");
                  }}
                />
                <button
                  type="button"
                  disabled={pending || uploadingId === row.id}
                  onClick={() => fileRefs.current[row.id]?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-2.5 py-1.5 text-[11px] font-medium text-crm-text2 hover:bg-crm-hover disabled:opacity-50"
                >
                  {uploadingId === row.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  Carica PDF
                </button>
                <span className="text-[11px] text-crm-muted">
                  Es. autocertificazioni (max 8 MB)
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
