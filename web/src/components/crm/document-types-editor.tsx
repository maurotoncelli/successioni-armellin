"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import {
  WHEN_LABELS,
  type DocWhen,
  type DocumentTypeDef,
} from "@/lib/document-types-shared";
import { saveDocumentTypes } from "@/app/crm/tipologie-documenti/actions";
import { cn } from "@/lib/utils";

type Row = DocumentTypeDef & { active: boolean; checked: boolean };

export function DocumentTypesEditor({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const checkedCount = rows.filter((r) => r.checked).length;
  const activeCount = rows.filter((r) => r.active).length;

  function toggle(id: string, field: "active" | "checked") {
    setRows((list) =>
      list.map((r) => (r.id === id ? { ...r, [field]: !r[field] } : r)),
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
        checked: false,
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

  function save() {
    setMessage(null);
    startTransition(async () => {
      const active: Record<string, boolean> = {};
      const checked: Record<string, boolean> = {};
      for (const r of rows) {
        active[r.id] = r.active;
        checked[r.id] = r.checked;
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
      const res = await saveDocumentTypes({ active, checked, custom });
      setMessage(
        res.ok
          ? "Salvato. Le nuove checklist useranno queste tipologie."
          : res.error,
      );
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-crm-border bg-crm-surface px-4 py-3">
        <p className="text-sm text-crm-text2">
          <span className="font-semibold text-crm-text">
            {checkedCount}/{rows.length}
          </span>{" "}
          verificati ·{" "}
          <span className="font-semibold text-crm-text">{activeCount}</span>{" "}
          attivi in checklist automatica
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
            {pending ? (
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
            message.startsWith("Salvato") ? "text-crm-green" : "text-crm-rose",
          )}
        >
          {message}
        </p>
      )}

      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className={cn(
              "rounded-[14px] border px-4 py-3",
              row.checked
                ? "border-crm-green/40 bg-crm-green/5"
                : "border-crm-border bg-crm-surface",
              !row.active && "opacity-60",
            )}
          >
            <div className="flex flex-wrap items-start gap-3">
              <label className="mt-0.5 flex cursor-pointer items-center gap-2 text-xs font-medium text-crm-text">
                <input
                  type="checkbox"
                  checked={row.checked}
                  onChange={() => toggle(row.id, "checked")}
                  className="h-4 w-4 rounded border-crm-border"
                />
                Verificato
              </label>
              <label className="mt-0.5 flex cursor-pointer items-center gap-2 text-xs font-medium text-crm-text2">
                <input
                  type="checkbox"
                  checked={row.active}
                  onChange={() => toggle(row.id, "active")}
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
          </li>
        ))}
      </ul>
    </div>
  );
}
