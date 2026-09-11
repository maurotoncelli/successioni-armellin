"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  FileWarning,
  MessageCircle,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { buttonClasses } from "@/components/ui/button";
import {
  calcolaRavvedimento,
  parseIsoDate,
  toIsoDate,
  ULTIMO_ANNO_TASSO_NOTO,
  type RavvedimentoResult,
} from "@/lib/ravvedimento";
import {
  RAVVEDIMENTO_UI_IT,
  type RavvedimentoUiLabels,
} from "@/lib/site-ui-labels";

/*
  Calcolatore pubblico del ravvedimento operoso per la successione
  (/strumenti/ravvedimento-operoso). Tutto lato client, nessun dato salvato.
  La logica e' in lib/ravvedimento.ts; qui solo form, formattazione e CTA.
*/

type Tipo = "dichiarazione" | "versamento";

function parseImporto(raw: string): number {
  let cleaned = raw.trim().replace(/\s/g, "");
  if (!cleaned) return 0;
  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else {
    const dots = cleaned.split(".").length - 1;
    if (dots > 1 || (dots === 1 && /\.\d{3}$/.test(cleaned))) {
      cleaned = cleaned.replace(/\./g, "");
    }
  }
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

type Props = {
  labels?: RavvedimentoUiLabels;
  numberLocale?: string;
  dateLocale?: string;
  /** Link allo strumento del valore catastale (gia' localizzato). */
  catastaleHref: string;
  /** Link al preventivo (gia' localizzato). */
  preventivoHref: string;
  whatsappBase: string;
};

const inputClass =
  "w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium text-primary";
const helpClass = "mt-1.5 text-xs text-text-muted";

export function RavvedimentoCalculator({
  labels = RAVVEDIMENTO_UI_IT,
  numberLocale = "it-IT",
  dateLocale = "it-IT",
  catastaleHref,
  preventivoHref,
  whatsappBase,
}: Props) {
  const [tipo, setTipo] = useState<Tipo>("dichiarazione");
  const [decesso, setDecesso] = useState("");
  const [scadenza, setScadenza] = useState("");
  // Default: oggi (data UTC, uguale su server e client salvo il cambio giorno).
  const [regolarizzazione, setRegolarizzazione] = useState(() =>
    toIsoDate(new Date()),
  );
  const [impostaSucc, setImpostaSucc] = useState("");
  const [altreImposte, setAltreImposte] = useState("");
  const [importo, setImporto] = useState("");
  const [avviso, setAvviso] = useState(false);
  const trackedRef = useRef(false);

  const fmtEur = useMemo(
    () =>
      new Intl.NumberFormat(numberLocale, {
        style: "currency",
        currency: "EUR",
      }),
    [numberLocale],
  );
  const fmtPct = useMemo(
    () =>
      new Intl.NumberFormat(numberLocale, {
        style: "percent",
        maximumFractionDigits: 2,
      }),
    [numberLocale],
  );
  const fmtDate = useMemo(
    () =>
      new Intl.DateTimeFormat(dateLocale, {
        dateStyle: "long",
        timeZone: "UTC",
      }),
    [dateLocale],
  );

  const result: RavvedimentoResult | null = useMemo(() => {
    const reg = parseIsoDate(regolarizzazione);
    if (!reg) return null;
    if (tipo === "dichiarazione") {
      const dec = parseIsoDate(decesso);
      if (!dec || dec > reg) return null;
      return calcolaRavvedimento({
        tipo,
        decesso: dec,
        regolarizzazione: reg,
        impostaSuccessione: parseImporto(impostaSucc),
        altreImposte: parseImporto(altreImposte),
      });
    }
    const sc = parseIsoDate(scadenza);
    const imp = parseImporto(importo);
    if (!sc || imp <= 0) return null;
    return calcolaRavvedimento({
      tipo,
      scadenza: sc,
      regolarizzazione: reg,
      importo: imp,
    });
  }, [tipo, decesso, scadenza, regolarizzazione, impostaSucc, altreImposte, importo]);

  useEffect(() => {
    if (result && !result.neiTermini && !trackedRef.current) {
      trackedRef.current = true;
      trackEvent("tool_ravvedimento", { tipo });
    }
  }, [result, tipo]);

  const tabs: { key: Tipo; label: string; help: string; icon: typeof Wallet }[] = [
    {
      key: "dichiarazione",
      label: labels.tab_dichiarazione,
      help: labels.tab_dichiarazione_help,
      icon: FileWarning,
    },
    {
      key: "versamento",
      label: labels.tab_versamento,
      help: labels.tab_versamento_help,
      icon: Wallet,
    },
  ];

  const extra = result ? result.totaleSanzioni + result.interessi.importo : 0;
  const waHref = result
    ? `${whatsappBase}?text=${encodeURIComponent(
        fill(labels.cta_prefill, {
          n: result.giorni,
          imposte: fmtEur.format(result.imposte),
          extra: fmtEur.format(extra),
        }),
      )}`
    : whatsappBase;

  const ratesLabel = result
    ? result.interessi.dettaglio
        .map((r) => `${r.anno}: ${fmtPct.format(r.tasso)}`)
        .join(", ")
    : "";

  return (
    <div className="rounded-2xl border border-primary/10 bg-bg p-6 shadow-sm sm:p-8">
      <div className="grid gap-2 sm:grid-cols-2" role="tablist">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            type="button"
            role="tab"
            aria-selected={tipo === tb.key}
            onClick={() => setTipo(tb.key)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-[10px] border px-4 py-3 text-start transition-colors",
              tipo === tb.key
                ? "border-accent bg-accent/10"
                : "border-primary/15 bg-bg hover:border-accent/40",
            )}
          >
            <span
              className={cn(
                "inline-flex items-center gap-2 text-sm font-medium",
                tipo === tb.key ? "text-accent-dark" : "text-text",
              )}
            >
              <tb.icon className="h-4 w-4" />
              {tb.label}
            </span>
            <span className="text-xs leading-relaxed text-text-muted">{tb.help}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {tipo === "dichiarazione" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="rav-decesso" className={labelClass}>
                  {labels.decesso}
                </label>
                <input
                  id="rav-decesso"
                  type="date"
                  value={decesso}
                  max={regolarizzazione || undefined}
                  onChange={(e) => setDecesso(e.target.value)}
                  className={inputClass}
                />
                <p className={helpClass}>{labels.decesso_help}</p>
              </div>
              <div>
                <label htmlFor="rav-regolarizzazione" className={labelClass}>
                  {labels.regolarizzazione}
                </label>
                <input
                  id="rav-regolarizzazione"
                  type="date"
                  value={regolarizzazione}
                  onChange={(e) => setRegolarizzazione(e.target.value)}
                  className={inputClass}
                />
                <p className={helpClass}>{labels.regolarizzazione_help}</p>
              </div>
            </div>
            <div>
              <label htmlFor="rav-imposta-succ" className={labelClass}>
                {labels.imposta_successione}
              </label>
              <input
                id="rav-imposta-succ"
                type="text"
                inputMode="decimal"
                value={impostaSucc}
                onChange={(e) => setImpostaSucc(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
              <p className={helpClass}>{labels.imposta_successione_help}</p>
            </div>
            <div>
              <label htmlFor="rav-altre" className={labelClass}>
                {labels.altre_imposte}
              </label>
              <input
                id="rav-altre"
                type="text"
                inputMode="decimal"
                value={altreImposte}
                onChange={(e) => setAltreImposte(e.target.value)}
                placeholder={labels.placeholder_amount}
                className={inputClass}
              />
              <p className={helpClass}>
                {labels.altre_imposte_help}{" "}
                <Link
                  href={catastaleHref}
                  className="font-medium text-accent-dark underline-offset-2 hover:underline"
                >
                  {labels.altre_imposte_link}
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="rav-scadenza" className={labelClass}>
                  {labels.scadenza}
                </label>
                <input
                  id="rav-scadenza"
                  type="date"
                  value={scadenza}
                  onChange={(e) => setScadenza(e.target.value)}
                  className={inputClass}
                />
                <p className={helpClass}>{labels.scadenza_help}</p>
              </div>
              <div>
                <label htmlFor="rav-pagamento" className={labelClass}>
                  {labels.pagamento}
                </label>
                <input
                  id="rav-pagamento"
                  type="date"
                  value={regolarizzazione}
                  onChange={(e) => setRegolarizzazione(e.target.value)}
                  className={inputClass}
                />
                <p className={helpClass}>{labels.regolarizzazione_help}</p>
              </div>
            </div>
            <div>
              <label htmlFor="rav-importo" className={labelClass}>
                {labels.importo}
              </label>
              <input
                id="rav-importo"
                type="text"
                inputMode="decimal"
                value={importo}
                onChange={(e) => setImporto(e.target.value)}
                placeholder={labels.placeholder_amount}
                className={inputClass}
              />
              <p className={helpClass}>{labels.importo_help}</p>
            </div>
          </>
        )}

        <label className="flex items-start gap-3 text-sm text-text">
          <input
            type="checkbox"
            checked={avviso}
            onChange={(e) => setAvviso(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
          />
          <span>{labels.avviso}</span>
        </label>
      </div>

      {avviso && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-text">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p>{labels.avviso_warning}</p>
        </div>
      )}

      <div
        className={cn(
          "mt-6 rounded-xl border p-5 transition-colors",
          result
            ? "border-accent/30 bg-accent/5"
            : "border-dashed border-primary/15 bg-bg-muted",
        )}
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
          <Calculator className="h-4 w-4" />
          {labels.risultato}
        </div>

        {!result && <p className="mt-2 text-sm text-text-muted">{labels.empty}</p>}

        {result && result.neiTermini && (
          <p className="mt-3 flex items-start gap-2 text-sm text-text">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span>
              {fill(labels.nei_termini, { date: fmtDate.format(result.scadenza) })}
            </span>
          </p>
        )}

        {result && !result.neiTermini && (
          <>
            <p className="mt-2 font-display text-3xl font-bold text-primary">
              {fmtEur.format(result.totale)}
            </p>
            <p className="text-sm text-text-muted">{labels.totale}</p>
            <p className="mt-1 text-sm font-medium text-text">
              {fill(labels.totale_extra, { amount: fmtEur.format(extra) })}
            </p>
            <p className="mt-3 text-xs text-text-muted">
              {fill(labels.ritardo, {
                n: result.giorni.toLocaleString(numberLocale),
                date: fmtDate.format(result.scadenza),
              })}
              {" · "}
              {result.regime === "post" ? labels.regime_post : labels.regime_pre}
            </p>

            <dl className="mt-4 divide-y divide-primary/10 border-t border-primary/10 text-sm">
              <div className="flex items-start justify-between gap-4 py-2.5">
                <dt className="text-text">{labels.riga_imposte}</dt>
                <dd className="shrink-0 font-medium text-primary">
                  {fmtEur.format(result.imposte)}
                </dd>
              </div>
              {result.sanzioneDichiarazione && (
                <div className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="text-text">
                    {labels.riga_sanzione_dich}
                    <span className="mt-0.5 block text-xs text-text-muted">
                      {result.sanzioneDichiarazione.aliquota !== null
                        ? fill(labels.sanzione_dich_pct, {
                            pct: fmtPct.format(result.sanzioneDichiarazione.aliquota),
                            fraction: result.sanzioneDichiarazione.frazione,
                          })
                        : fill(labels.sanzione_dich_fissa, {
                            amount: fmtEur.format(result.sanzioneDichiarazione.fissa ?? 0),
                            fraction: result.sanzioneDichiarazione.frazione,
                          })}
                    </span>
                  </dt>
                  <dd className="shrink-0 font-medium text-primary">
                    {fmtEur.format(result.sanzioneDichiarazione.importo)}
                  </dd>
                </div>
              )}
              {result.sanzioneVersamento && (
                <div className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="text-text">
                    {labels.riga_sanzione_vers}
                    <span className="mt-0.5 block text-xs text-text-muted">
                      {fill(labels.sanzione_vers_desc, {
                        pct: fmtPct.format(result.sanzioneVersamento.aliquota),
                        fraction: result.sanzioneVersamento.frazione,
                      })}
                    </span>
                  </dt>
                  <dd className="shrink-0 font-medium text-primary">
                    {fmtEur.format(result.sanzioneVersamento.importo)}
                  </dd>
                </div>
              )}
              <div className="flex items-start justify-between gap-4 py-2.5">
                <dt className="text-text">
                  {labels.riga_interessi}
                  {result.interessi.dettaglio.length > 0 && (
                    <span className="mt-0.5 block text-xs text-text-muted">
                      {fill(labels.interessi_desc, {
                        n: result.giorni.toLocaleString(numberLocale),
                        rates: ratesLabel,
                      })}
                      {result.interessi.tassoStimato &&
                        ` ${fill(labels.interessi_stimato, { year: ULTIMO_ANNO_TASSO_NOTO })}`}
                    </span>
                  )}
                </dt>
                <dd className="shrink-0 font-medium text-primary">
                  {fmtEur.format(result.interessi.importo)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="tool_ravvedimento_whatsapp"
                className={buttonClasses({ variant: "whatsapp", className: "w-full sm:w-auto" })}
              >
                <MessageCircle className="h-4 w-4" />
                {labels.cta_whatsapp}
              </a>
              <Link
                href={preventivoHref}
                data-cta="tool_ravvedimento_preventivo"
                className={buttonClasses({ variant: "outline", className: "w-full sm:w-auto" })}
              >
                {labels.cta_preventivo}
              </Link>
            </div>
            <p className="mt-3 text-xs text-text-muted">{labels.cta_note}</p>
          </>
        )}
      </div>

      <details className="mt-4 rounded-xl border border-primary/10 bg-bg-muted/60 p-4 text-sm">
        <summary className="cursor-pointer list-none font-medium text-primary">
          {labels.ipotesi_title}
        </summary>
        <ul className="mt-3 list-disc space-y-1.5 ps-5 text-xs leading-relaxed text-text-muted">
          {(tipo === "dichiarazione"
            ? labels.ipotesi_dichiarazione
            : labels.ipotesi_versamento
          ).map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </details>
      <p className="mt-3 text-xs leading-relaxed text-text-muted">{labels.disclaimer}</p>
    </div>
  );
}
