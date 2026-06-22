"use client";

import { useActionState } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { CrmCard } from "@/components/crm/ui";
import {
  savePackage,
  saveAddon,
  type ActionResult,
} from "@/app/crm/listino/actions";
import type { PackageRow, AddonRow } from "@/lib/supabase/types";

const fieldLabel =
  "block text-[11px] font-semibold uppercase tracking-wider text-crm-muted mb-1";
const input =
  "w-full rounded-lg border border-crm-border bg-crm-bg2 px-3 py-2 text-sm text-crm-text placeholder:text-crm-muted focus:border-crm-accent focus:outline-none";

function StatusLine({
  state,
  pending,
}: {
  state: ActionResult | null;
  pending: boolean;
}) {
  if (pending) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-crm-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Salvataggio...
      </span>
    );
  }
  if (!state) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${
        state.ok ? "text-crm-green" : "text-crm-rose"
      }`}
    >
      {state.ok ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5" />
      )}
      {state.message}
    </span>
  );
}

function SaveBar({
  state,
  pending,
}: {
  state: ActionResult | null;
  pending: boolean;
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-crm-border pt-4">
      <StatusLine state={state} pending={pending} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg crm-gradient px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        Salva e pubblica
      </button>
    </div>
  );
}

function PackageForm({ pkg }: { pkg: PackageRow }) {
  const [state, action, pending] = useActionState(savePackage, null);
  return (
    <CrmCard>
      <form action={action}>
        <input type="hidden" name="key" value={pkg.key} />
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-crm-text">{pkg.key}</h3>
          <label className="inline-flex items-center gap-2 text-xs text-crm-text2">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={pkg.is_active}
              className="h-4 w-4 accent-[var(--color-crm-accent)]"
            />
            Attivo (visibile sul sito)
          </label>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={fieldLabel}>Nome</label>
            <input name="name" defaultValue={pkg.name} className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={fieldLabel}>Sottotitolo</label>
            <input
              name="tagline"
              defaultValue={pkg.tagline ?? ""}
              className={input}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={fieldLabel}>Descrizione</label>
            <textarea
              name="description"
              defaultValue={pkg.description}
              rows={3}
              className={input}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={fieldLabel}>
              Cosa include (una voce per riga)
            </label>
            <textarea
              name="features"
              defaultValue={pkg.features.join("\n")}
              rows={4}
              className={input}
            />
          </div>
          <div>
            <label className={fieldLabel}>Prezzo onorario (EUR)</label>
            <input
              name="price"
              type="number"
              step="1"
              defaultValue={pkg.price}
              className={input}
            />
          </div>
          <div>
            <label className={fieldLabel}>Costo immobile extra (EUR)</label>
            <input
              name="extra_property_fee"
              type="number"
              step="1"
              defaultValue={pkg.extra_property_fee ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={fieldLabel}>SLA consegna (giorni)</label>
            <input
              name="sla_days"
              type="number"
              step="1"
              defaultValue={pkg.sla_days ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={fieldLabel}>Etichetta (badge)</label>
            <input
              name="badge"
              defaultValue={pkg.badge ?? ""}
              placeholder="es. Il piu scelto"
              className={input}
            />
          </div>
          <div>
            <label className={fieldLabel}>Ordine</label>
            <input
              name="sort_order"
              type="number"
              step="1"
              defaultValue={pkg.sort_order}
              className={input}
            />
          </div>
        </div>

        <SaveBar state={state} pending={pending} />
      </form>
    </CrmCard>
  );
}

function AddonForm({ addon }: { addon: AddonRow }) {
  const [state, action, pending] = useActionState(saveAddon, null);
  return (
    <CrmCard>
      <form action={action}>
        <input type="hidden" name="key" value={addon.key} />
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-crm-text">{addon.key}</h3>
          <label className="inline-flex items-center gap-2 text-xs text-crm-text2">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={addon.is_active}
              className="h-4 w-4 accent-[var(--color-crm-accent)]"
            />
            Attivo
          </label>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={fieldLabel}>Nome</label>
            <input name="name" defaultValue={addon.name} className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={fieldLabel}>Descrizione</label>
            <textarea
              name="description"
              defaultValue={addon.description ?? ""}
              rows={2}
              className={input}
            />
          </div>
          <div>
            <label className={fieldLabel}>Prezzo (EUR)</label>
            <input
              name="price"
              type="number"
              step="1"
              defaultValue={addon.price}
              className={input}
            />
          </div>
          <div>
            <label className={fieldLabel}>Ordine</label>
            <input
              name="sort_order"
              type="number"
              step="1"
              defaultValue={addon.sort_order}
              className={input}
            />
          </div>
        </div>

        <SaveBar state={state} pending={pending} />
      </form>
    </CrmCard>
  );
}

export function ListinoEditor({
  packages,
  addons,
}: {
  packages: PackageRow[];
  addons: AddonRow[];
}) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-crm-muted">
          Pacchetti
        </h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {packages.map((pkg) => (
            <PackageForm key={pkg.key} pkg={pkg} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-crm-muted">
          Servizi aggiuntivi (add-on)
        </h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {addons.map((addon) => (
            <AddonForm key={addon.key} addon={addon} />
          ))}
        </div>
      </section>
    </div>
  );
}
