"use client";

import { useActionState, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Loader2,
  Plane,
  Wrench,
  PencilLine,
} from "lucide-react";
import {
  OFFLINE_PRESETS,
  type OfflinePreset,
  type SiteOfflineState,
} from "@/lib/site-offline-shared";
import {
  saveOfflineMode,
  type OfflineActionResult,
} from "@/app/crm/modalita-offline/actions";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-lg border border-crm-border bg-crm-bg2 px-3 py-2 text-sm text-crm-text outline-none placeholder:text-crm-muted focus:border-crm-accent";

const PRESET_OPTIONS: {
  key: OfflinePreset;
  label: string;
  icon: typeof Plane;
}[] = [
  { key: "vacation", label: "Vacanza", icon: Plane },
  { key: "maintenance", label: "Manutenzione", icon: Wrench },
  { key: "custom", label: "Personalizzato", icon: PencilLine },
];

export function OfflineModeEditor({ initial }: { initial: SiteOfflineState }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [preset, setPreset] = useState<OfflinePreset>(initial.preset);
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);
  const [reopenDate, setReopenDate] = useState(initial.reopenDate ?? "");
  const [showContactButtons, setShowContactButtons] = useState(
    initial.showContactButtons,
  );

  const [state, action, pending] = useActionState<
    OfflineActionResult | null,
    FormData
  >(saveOfflineMode, null);

  function applyPreset(next: OfflinePreset, date = reopenDate) {
    setPreset(next);
    if (next === "custom") return;
    const p = OFFLINE_PRESETS[next];
    setTitle(p.title);
    setBody(p.body(date || null));
  }

  const preview = useMemo(
    () => ({ title: title.trim() || "Titolo", body: body.trim() || "Messaggio…" }),
    [title, body],
  );

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="enabled" value={enabled ? "1" : "0"} />
      <input type="hidden" name="preset" value={preset} />
      <input
        type="hidden"
        name="showContactButtons"
        value={showContactButtons ? "1" : "0"}
      />

      {enabled && (
        <div className="flex items-start gap-3 rounded-[14px] border border-crm-amber/40 bg-crm-amber/10 p-4 text-sm text-crm-text2">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-crm-amber" />
          <div>
            <p className="font-medium text-crm-text">Modalità offline attiva</p>
            <p className="mt-1">
              Il sito pubblico mostra solo questo messaggio. Area personale e CRM
              restano raggiungibili normalmente.
            </p>
          </div>
        </div>
      )}

      <section className="rounded-[14px] border border-crm-border bg-crm-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-crm-text">
              Attiva modalità offline
            </h2>
            <p className="mt-1 text-sm text-crm-muted">
              Per vacanze, manutenzioni o chiusure temporanee.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={cn(
              "relative h-8 w-14 rounded-full transition-colors",
              enabled ? "bg-crm-accent" : "bg-crm-border",
            )}
          >
            <span
              className={cn(
                "absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform",
                enabled && "translate-x-6",
              )}
            />
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-[14px] border border-crm-border bg-crm-surface p-5">
        <div>
          <h2 className="text-base font-semibold text-crm-text">Modello</h2>
          <p className="mt-1 text-sm text-crm-muted">
            Parti da un modello e personalizza titolo e testo.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {PRESET_OPTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                preset === key
                  ? "border-crm-accent bg-crm-accent/10 text-crm-accent"
                  : "border-crm-border text-crm-text2 hover:bg-crm-hover",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {preset === "maintenance" && (
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-crm-muted">
              Data riapertura prevista (opzionale)
            </span>
            <input
              type="date"
              name="reopenDate"
              value={reopenDate}
              onChange={(e) => {
                const next = e.target.value;
                setReopenDate(next);
                setBody(OFFLINE_PRESETS.maintenance.body(next || null));
              }}
              className={inputCls}
            />
          </label>
        )}
        {preset !== "maintenance" && (
          <input type="hidden" name="reopenDate" value={reopenDate} />
        )}

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-crm-muted">Titolo</span>
          <input
            name="title"
            value={title}
            onChange={(e) => {
              setPreset("custom");
              setTitle(e.target.value);
            }}
            className={inputCls}
            maxLength={120}
            required={enabled}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-crm-muted">Messaggio</span>
          <textarea
            name="body"
            value={body}
            onChange={(e) => {
              setPreset("custom");
              setBody(e.target.value);
            }}
            rows={4}
            className={cn(inputCls, "resize-y")}
            maxLength={800}
            required={enabled}
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-crm-text2">
          <input
            type="checkbox"
            checked={showContactButtons}
            onChange={(e) => setShowContactButtons(e.target.checked)}
            className="h-4 w-4 rounded border-crm-border"
          />
          Mostra pulsanti di contatto (email, WhatsApp, telefono)
        </label>
      </section>

      <section className="rounded-[14px] border border-dashed border-crm-border bg-crm-bg2/60 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-crm-muted">
          Anteprima sul sito
        </p>
        <h3 className="mt-3 font-serif text-2xl text-crm-text">{preview.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-crm-text2">{preview.body}</p>
        {showContactButtons && (
          <p className="mt-4 text-xs text-crm-muted">
            + pulsanti Scrivici / WhatsApp / Telefono
          </p>
        )}
      </section>

      {state && (
        <div
          className={cn(
            "flex items-start gap-2 rounded-lg px-3 py-2 text-sm",
            state.ok
              ? "bg-crm-green/15 text-crm-green"
              : "bg-red-500/10 text-red-400",
          )}
        >
          {state.ok ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {state.message}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg crm-gradient px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Salva e pubblica
        </button>
        {initial.updatedAt && (
          <span className="text-xs text-crm-muted">
            Ultimo aggiornamento:{" "}
            {new Date(initial.updatedAt).toLocaleString("it-IT")}
          </span>
        )}
      </div>
    </form>
  );
}
