"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { CrmCard, SectionTitle } from "@/components/crm/ui";
import { createPractice } from "@/app/crm/pratiche/nuova/actions";

const inputClass =
  "w-full rounded-lg border border-crm-border bg-crm-bg2 px-3 py-2 text-sm text-crm-text outline-none focus:border-crm-accent";

export function NewPracticeForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [hasRealEstate, setHasRealEstate] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");

    startTransition(async () => {
      const res = await createPractice({
        clientName: get("clientName"),
        clientEmail: get("clientEmail"),
        clientPhone: get("clientPhone"),
        relation: get("relation"),
        deceasedName: get("deceasedName"),
        deceasedCf: get("deceasedCf"),
        dateOfDeath: get("dateOfDeath"),
        residence: get("residence"),
        heirsCount: get("heirsCount"),
        hasRealEstate,
        realEstateCount: get("realEstateCount"),
        hasWill: f.get("hasWill") === "on",
        urgent: f.get("urgent") === "on",
        selectedPackage: get("selectedPackage"),
        notes: get("notes"),
      });
      if (res.ok) router.push(`/crm/pratiche/${res.practiceId}`);
      else setError(res.error);
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link
        href="/crm/pratiche"
        className="inline-flex items-center gap-1.5 text-sm text-crm-text2 hover:text-crm-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Pratiche
      </Link>
      <h1 className="text-xl font-semibold text-crm-text">Nuova pratica</h1>

      <form onSubmit={submit} className="space-y-5">
        <CrmCard>
          <SectionTitle>Cliente (erede)</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Nome e cognome *">
              <input name="clientName" required className={inputClass} />
            </Field>
            <Field label="Relazione col defunto">
              <input name="relation" placeholder="Coniuge, Figlio/a…" className={inputClass} />
            </Field>
            <Field label="Email">
              <input name="clientEmail" type="email" className={inputClass} />
            </Field>
            <Field label="Telefono">
              <input name="clientPhone" className={inputClass} />
            </Field>
          </div>
        </CrmCard>

        <CrmCard>
          <SectionTitle>Defunto e successione</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Nome del defunto">
              <input name="deceasedName" className={inputClass} />
            </Field>
            <Field label="Codice fiscale defunto">
              <input name="deceasedCf" className={`${inputClass} font-mono uppercase`} />
            </Field>
            <Field label="Data del decesso">
              <input name="dateOfDeath" type="date" className={inputClass} />
            </Field>
            <Field label="Residenza">
              <input name="residence" className={inputClass} />
            </Field>
            <Field label="N. eredi">
              <input name="heirsCount" type="number" min="1" defaultValue="1" className={inputClass} />
            </Field>
            <Field label="Pacchetto (opzionale)">
              <select name="selectedPackage" className={inputClass} defaultValue="">
                <option value="">— da definire —</option>
                <option value="SEMPLICE">Semplice</option>
                <option value="COMPLETO">Con Immobili</option>
                <option value="ZERO_STRESS">Estesa</option>
              </select>
            </Field>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-crm-text2">
              <input
                type="checkbox"
                checked={hasRealEstate}
                onChange={(e) => setHasRealEstate(e.target.checked)}
                className="h-4 w-4 accent-crm-accent"
              />
              Immobili
            </label>
            {hasRealEstate && (
              <input
                name="realEstateCount"
                type="number"
                min="0"
                placeholder="Quanti"
                className={`${inputClass} w-28`}
              />
            )}
            <label className="inline-flex items-center gap-2 text-sm text-crm-text2">
              <input type="checkbox" name="hasWill" className="h-4 w-4 accent-crm-accent" />
              Testamento
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-crm-text2">
              <input type="checkbox" name="urgent" className="h-4 w-4 accent-crm-accent" />
              Urgente
            </label>
          </div>
        </CrmCard>

        <CrmCard>
          <SectionTitle>Note</SectionTitle>
          <textarea name="notes" rows={3} className={`${inputClass} mt-3`} />
        </CrmCard>

        {error && (
          <p className="flex items-center gap-1.5 text-sm text-crm-rose">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg crm-gradient px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Crea pratica
          </button>
          <Link
            href="/crm/pratiche"
            className="text-sm text-crm-muted hover:text-crm-text"
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-crm-muted">{label}</span>
      {children}
    </label>
  );
}
