"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Landmark, Loader2, Check } from "lucide-react";
import { setStateTaxes } from "@/app/crm/pratiche/[id]/actions";

/*
  Comunicazione delle imposte di Stato al cliente (autoliquidazione F24, @10).
  Inserendo l'importo si aggiorna la pratica e parte l'email al cliente.
*/
export function StateTaxesForm({
  practiceId,
  current,
}: {
  practiceId: string;
  current: number | null;
}) {
  const router = useRouter();
  const [value, setValue] = useState(current != null ? String(current) : "");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    const amount = Number(value.replace(",", "."));
    if (!Number.isFinite(amount) || amount < 0) {
      setError("Importo non valido.");
      return;
    }
    startTransition(async () => {
      const res = await setStateTaxes(practiceId, amount);
      if (res.ok) {
        setOk(true);
        router.refresh();
        setTimeout(() => setOk(false), 2000);
      } else setError(res.error);
    });
  }

  return (
    <form
      onSubmit={submit}
      className="mt-3 flex flex-wrap items-center gap-2 border-t border-crm-border pt-3"
    >
      <span className="inline-flex items-center gap-1.5 text-xs text-crm-muted">
        <Landmark className="h-3.5 w-3.5" />
        Imposte di Stato
      </span>
      <div className="flex items-center gap-1">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode="decimal"
          placeholder="0"
          className="w-24 rounded-lg border border-crm-border bg-crm-bg2 px-2 py-1.5 text-right text-sm text-crm-text outline-none focus:border-crm-accent"
        />
        <span className="text-sm text-crm-muted">€</span>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-3 py-1.5 text-sm text-crm-text hover:border-crm-accent/40 disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : ok ? (
          <Check className="h-3.5 w-3.5 text-crm-green" />
        ) : null}
        {current != null ? "Aggiorna e avvisa" : "Comunica al cliente"}
      </button>
      {error && <p className="w-full text-xs text-crm-rose">{error}</p>}
    </form>
  );
}
