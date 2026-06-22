"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { setDueDate } from "@/app/crm/pratiche/[id]/actions";

export function DueDateForm({
  practiceId,
  current,
}: {
  practiceId: string;
  current: string | null;
}) {
  const router = useRouter();
  const [value, setValue] = useState(current ?? "");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function save(next: string) {
    setMsg(null);
    startTransition(async () => {
      const res = await setDueDate(practiceId, next);
      if (res.ok) {
        setMsg({ ok: true, text: next ? "Consegna aggiornata." : "Consegna rimossa." });
        router.refresh();
      } else {
        setMsg({ ok: false, text: res.error });
      }
    });
  }

  return (
    <div className="mt-4 border-t border-crm-border pt-4">
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-crm-muted">
        Consegna prevista
      </label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="rounded-lg border border-crm-border bg-crm-bg2 px-2.5 py-1.5 text-sm text-crm-text outline-none focus:border-crm-accent"
        />
        <button
          type="button"
          onClick={() => save(value)}
          disabled={pending || value === (current ?? "")}
          className="inline-flex items-center gap-1.5 rounded-lg crm-gradient px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Salva
        </button>
        {current && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              save("");
            }}
            disabled={pending}
            className="text-xs text-crm-muted hover:text-crm-rose"
          >
            Rimuovi
          </button>
        )}
      </div>
      {msg && (
        <p
          className={`mt-2 inline-flex items-center gap-1.5 text-xs ${
            msg.ok ? "text-crm-green" : "text-crm-rose"
          }`}
        >
          {msg.ok ? <Check className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
          {msg.text}
        </p>
      )}
    </div>
  );
}
