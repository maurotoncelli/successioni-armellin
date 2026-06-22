"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Banknote } from "lucide-react";
import {
  registerOfflinePayment,
  type OfflineMethod,
} from "@/app/crm/pratiche/[id]/actions";

/*
  Registrazione pagamento offline (eccezione: bonifico/contanti/in studio, @05).
  Porta la pratica a PAGATO con payment_recorded_by=ADMIN. Non e la strada
  principale (resta il checkout online), ma rispetta la realta dello studio.
*/
export function OfflinePayment({
  practiceId,
  suggestedAmount,
}: {
  practiceId: string;
  suggestedAmount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(
    suggestedAmount > 0 ? String(suggestedAmount) : "",
  );
  const [method, setMethod] = useState<OfflineMethod>("BANK_TRANSFER");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = Number(amount.replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) {
      setError("Importo non valido.");
      return;
    }
    startTransition(async () => {
      const res = await registerOfflinePayment(practiceId, {
        amount: value,
        method,
        date,
        note,
      });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else setError(res.error);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-crm-border bg-crm-surface px-3 py-2 text-sm text-crm-text2 hover:text-crm-text"
      >
        <Banknote className="h-4 w-4" />
        Registra pagamento manuale
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mt-3 space-y-2 border-t border-crm-border pt-3"
    >
      <div className="flex gap-2">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="Importo €"
          className="w-28 rounded-lg border border-crm-border bg-crm-bg2 px-2 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent"
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as OfflineMethod)}
          className="flex-1 rounded-lg border border-crm-border bg-crm-bg2 px-2 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent"
        >
          <option value="BANK_TRANSFER">Bonifico</option>
          <option value="CASH">Contanti</option>
          <option value="OTHER">Altro</option>
        </select>
      </div>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded-lg border border-crm-border bg-crm-bg2 px-2 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent"
      />
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (facoltative)"
        className="w-full rounded-lg border border-crm-border bg-crm-bg2 px-2 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-crm-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-crm-accent/90 disabled:opacity-50"
        >
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Registra come pagato
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-crm-muted hover:text-crm-text"
        >
          Annulla
        </button>
      </div>
      {error && <p className="text-xs text-crm-rose">{error}</p>}
    </form>
  );
}
