"use client";

import { useState, useTransition } from "react";
import { Languages, Loader2, Check, AlertCircle } from "lucide-react";
import { refreshListinoTranslations } from "@/app/crm/listino/actions";

export function RefreshTranslationsButton({
  lastUpdatedAt,
  aiConfigured,
}: {
  lastUpdatedAt: string | null;
  aiConfigured: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  function run() {
    setResult(null);
    startTransition(async () => {
      const res = await refreshListinoTranslations();
      setResult(res);
    });
  }

  const updatedLabel = lastUpdatedAt
    ? `Ultimo aggiornamento: ${new Date(lastUpdatedAt).toLocaleString("it-IT")}`
    : "Ancora nessuna generazione da AI (in uso seed arabo di fallback).";

  return (
    <div className="rounded-[14px] border border-crm-border bg-crm-bg2 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-crm-text">
            <Languages className="h-4 w-4 text-crm-accent" />
            Traduzioni multilingua (listino)
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-crm-muted">
            L&apos;italiano lo editi sopra (fonte di fede). Il pulsante usa
            OpenAI (stessa chiave dell&apos;estrazione documenti) per aggiornare
            nomi, descrizioni e feature di pacchetti e add-on in tutte le lingue
            del sito. I prezzi non si toccano.
          </p>
          <p className="mt-1.5 text-[11px] text-crm-muted">{updatedLabel}</p>
          {!aiConfigured && (
            <p className="mt-1.5 text-xs text-crm-amber">
              OPENAI_API_KEY non configurata: il pulsante resta disabilitato.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={run}
          disabled={pending || !aiConfigured}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-crm-accent/40 bg-crm-accent/10 px-4 py-2 text-sm font-semibold text-crm-accent hover:bg-crm-accent/20 disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Languages className="h-4 w-4" />
          )}
          {pending ? "Traduzione in corso…" : "Aggiorna traduzioni multilingua"}
        </button>
      </div>
      {result && (
        <p
          className={`mt-3 inline-flex items-center gap-1.5 text-xs ${
            result.ok ? "text-crm-green" : "text-crm-rose"
          }`}
        >
          {result.ok ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5" />
          )}
          {result.message}
        </p>
      )}
    </div>
  );
}
