"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Check, Loader2, AlertCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { saveIbanAction } from "@/app/area-riservata/(app)/dati/actions";
import {
  IBAN_UI_IT,
  fillTemplate,
  type IbanUiLabels,
} from "@/lib/area-ui-labels";

export function IbanForm({
  initialLast4,
  clearedAt,
  labels = IBAN_UI_IT,
}: {
  initialLast4?: string;
  clearedAt?: string;
  labels?: IbanUiLabels;
}) {
  const router = useRouter();
  const [iban, setIban] = useState("");
  const [savedLast4, setSavedLast4] = useState<string | undefined>(initialLast4);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await saveIbanAction(iban);
      if (res.ok) {
        setSavedLast4(res.last4);
        setIban("");
        router.refresh();
      } else setError(res.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {savedLast4 && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-text">
          <Check className="h-4 w-4 shrink-0 text-success" />
          {fillTemplate(labels.saved, { last4: savedLast4 })}
        </div>
      )}

      {!savedLast4 && clearedAt && (
        <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-text">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <span>
            {fillTemplate(labels.cleared, { date: clearedAt.slice(0, 10) })}
          </span>
        </div>
      )}

      <div>
        <label htmlFor="iban" className="mb-1.5 block text-sm font-medium text-text">
          {labels.label}
        </label>
        <input
          id="iban"
          value={iban}
          onChange={(e) => {
            setIban(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="IT60 X054 2811 1010 0000 0123 456"
          className="w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
        />
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-text-muted">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {labels.hint}
        </p>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-error">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      <button type="submit" disabled={pending || !iban.trim()} className={buttonClasses()}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {labels.save}
      </button>
    </form>
  );
}
