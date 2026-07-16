"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Minus,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  computeEsito,
  emptyComposition,
  encodeHeirs,
  isAllDirectLine,
  suggestedPackage,
  totalHeirs,
  type HeirsComposition,
} from "@/lib/quote";
import { trackEvent } from "@/lib/analytics";

/*
  Form pubblico del preventivo - versione "result-first" (no barriera contatti).
  Solo domande: al termine calcoliamo l'esito LATO CLIENT (nessun dato personale,
  nessuna scrittura su DB) e portiamo l'utente alla pagina risultato passando le
  risposte via query string. I contatti si chiedono solo dopo, e solo se serve
  (pagamento, opt-in email, preventivo su misura).

  Ridisegno:
  - Il testamento e' la PRIMA domanda (informativa: NON forza il preventivo su
    misura; i pacchetti coprono anche le successioni testamentarie).
  - Gli eredi si indicano per tipo e numero (es. coniuge + 2 figli): l'esonero
    art. 28 c.7 TUS vale solo se TUTTI gli eredi sono coniuge/linea retta.
*/

type Props = {
  stepTitles: string[];
  progressLabel: string;
  submitLabel: string;
  trustItems: string[];
};

type Choice = { value: string; label: string };

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: React.ReactNode;
  options: Choice[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-primary">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[10px] border px-4 py-2 text-sm font-medium transition-colors",
              value === opt.value
                ? "border-accent bg-accent/10 text-accent"
                : "border-primary/20 text-text hover:border-accent/50",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Pallino info accanto a "de cuius": tooltip su hover/focus, tap-to-toggle su touch. */
function DeCuiusInfo() {
  const tipId = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="Cosa significa de cuius"
        aria-describedby={tipId}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        className={cn(
          "ml-0.5 inline-grid h-4 w-4 shrink-0 place-items-center rounded-full",
          "border border-primary/30 bg-bg text-[10px] font-bold leading-none text-primary",
          "transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        )}
      >
        <Info className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />
      </button>
      <span
        id={tipId}
        role="tooltip"
        className={cn(
          // Sopra il pallino (non copre i bottoni Sì/No), centrato e con
          // max-width che resta dentro lo schermo su mobile.
          "absolute bottom-full left-1/2 z-20 mb-2 w-[min(18rem,calc(100vw-2.5rem))] -translate-x-1/2",
          "rounded-lg border border-primary/15 bg-primary px-3 py-2 text-xs font-normal leading-relaxed text-white shadow-lg",
          "pointer-events-none transition-opacity",
          open
            ? "opacity-100"
            : "opacity-0 group-hover/decuius:opacity-100 group-focus-within/decuius:opacity-100",
        )}
      >
        <span className="font-semibold">De cuius</span> (dal latino) è la persona
        deceduta di cui si apre la successione: il defunto o la defunta.
      </span>
    </span>
  );
}

function WillQuestionLabel() {
  return (
    <span className="group/decuius inline-flex flex-wrap items-center gap-x-1">
      <span>Il</span>
      <span className="inline-flex items-center">
        <span className="font-semibold">de cuius</span>
        <DeCuiusInfo />
      </span>
      <span>ha lasciato un testamento?</span>
    </span>
  );
}

const yesNo: Choice[] = [
  { value: "si", label: "Sì" },
  { value: "no", label: "No" },
  { value: "nonso", label: "Non lo so" },
];

type HeirKind = keyof HeirsComposition;

const heirRows: { key: HeirKind; label: string; max: number }[] = [
  { key: "coniuge", label: "Coniuge (o unito civilmente)", max: 1 },
  { key: "figli", label: "Figli/e", max: 15 },
  { key: "genitori", label: "Genitori", max: 2 },
  { key: "fratelli", label: "Fratelli/Sorelle", max: 15 },
  { key: "nipoti", label: "Nipoti", max: 15 },
  { key: "altri", label: "Altri eredi", max: 15 },
];

function HeirsCounter({
  value,
  onChange,
}: {
  value: HeirsComposition;
  onChange: (v: HeirsComposition) => void;
}) {
  function setCount(key: HeirKind, next: number, max: number) {
    onChange({ ...value, [key]: Math.max(0, Math.min(next, max)) });
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-primary">
        Chi sono gli eredi? Indica quanti per ogni tipo.
      </legend>
      <div className="divide-y divide-primary/10 rounded-[10px] border border-primary/15">
        {heirRows.map((row) => {
          const count = value[row.key];
          return (
            <div
              key={row.key}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <span
                className={cn(
                  "text-sm",
                  count > 0 ? "font-medium text-primary" : "text-text",
                )}
              >
                {row.label}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Meno ${row.label}`}
                  onClick={() => setCount(row.key, count - 1, row.max)}
                  disabled={count === 0}
                  className="grid h-8 w-8 place-items-center rounded-full border border-primary/20 text-text transition-colors hover:border-accent/50 disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm font-semibold text-primary">
                  {count}
                </span>
                <button
                  type="button"
                  aria-label={`Più ${row.label}`}
                  onClick={() => setCount(row.key, count + 1, row.max)}
                  disabled={count >= row.max}
                  className="grid h-8 w-8 place-items-center rounded-full border border-primary/20 text-text transition-colors hover:border-accent/50 disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-text-muted">
        Conta tutte le persone che ereditano, compreso te se sei tra gli eredi.
      </p>
    </fieldset>
  );
}

export function PreventivoForm({
  stepTitles,
  progressLabel,
  submitLabel,
  trustItems,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const total = stepTitles.length;

  const [hasWill, setHasWill] = useState("");
  const [heirs, setHeirs] = useState<HeirsComposition>(emptyComposition);
  const [hasRealEstate, setHasRealEstate] = useState("");
  const [realEstateCount, setRealEstateCount] = useState("");
  const [hasOther, setHasOther] = useState("");
  const [over100k, setOver100k] = useState("");

  const heirsTotal = totalHeirs(heirs);
  const allDirectLine = isAllDirectLine(heirs);

  // La soglia dei 100.000 EUR conta solo per l'esonero art. 28 c.7 TUS:
  // TUTTI gli eredi coniuge/linea retta E nessun immobile.
  const askOver100k = hasRealEstate === "no" && allDirectLine;

  const progress = ((step + 1) / total) * 100;

  // Avanti abilitato solo quando TUTTE le domande dello step hanno risposta.
  const stepValid =
    (step === 0 && hasWill !== "") ||
    (step === 1 && heirsTotal > 0) ||
    (step === 2 &&
      hasRealEstate !== "" &&
      hasOther !== "" &&
      (!askOver100k || over100k !== ""));

  function next() {
    setStep((s) => Math.min(s + 1, total - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function seeResult() {
    const esito = computeEsito({
      hasWill,
      allDirectLine,
      hasRealEstate,
      hasOther,
      over100k: askOver100k ? over100k : undefined,
    });
    const pkg = suggestedPackage(esito, hasRealEstate);
    const parsed = Number.parseInt(realEstateCount, 10);
    const params = new URLSearchParams({
      esito,
      comp: encodeHeirs(heirs),
      heirs: String(heirsTotal),
      hasre: hasRealEstate,
      will: hasWill || "no",
      other: hasOther || "no",
    });
    if (askOver100k && over100k) params.set("k100", over100k);
    if (pkg) params.set("pkg", pkg);
    if (hasRealEstate === "si" && Number.isFinite(parsed) && parsed > 0) {
      params.set("recount", String(parsed));
    }
    trackEvent("quote_result", {
      esito,
      has_will: hasWill,
      has_real_estate: hasRealEstate,
    });
    router.push(`/preventivo/grazie?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-2 flex items-center justify-between text-sm text-text-muted">
        <span>{progressLabel.replace("{n}", String(step + 1))}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-primary/10 bg-bg p-6 sm:p-8">
        <h2 className="text-2xl">{stepTitles[step]}</h2>

        <div className="mt-6 space-y-6">
          {step === 0 && (
            <>
              <OptionGroup
                label={<WillQuestionLabel />}
                options={yesNo}
                value={hasWill}
                onChange={setHasWill}
              />
              {hasWill === "si" && (
                <p className="rounded-[10px] border border-primary/10 bg-bg-muted/60 p-4 text-sm text-text-muted">
                  Nessun problema: i pacchetti standard coprono anche i casi con
                  testamento. Nella checklist documenti ti chiederemo la copia
                  del testamento pubblicato.
                </p>
              )}
              {hasWill === "nonso" && (
                <p className="rounded-[10px] border border-primary/10 bg-bg-muted/60 p-4 text-sm text-text-muted">
                  Va bene anche così: se emerge dopo, lo gestiamo in corso di
                  pratica. Continua con le altre domande.
                </p>
              )}
            </>
          )}

          {step === 1 && <HeirsCounter value={heirs} onChange={setHeirs} />}

          {step === 2 && (
            <>
              <OptionGroup
                label="Ci sono immobili (case, terreni, box)?"
                options={yesNo}
                value={hasRealEstate}
                onChange={setHasRealEstate}
              />
              {hasRealEstate === "si" && (
                <div className="rounded-[10px] border border-accent/20 bg-sand/40 p-4">
                  <label
                    htmlFor="realEstateCount"
                    className="mb-1.5 block text-sm font-medium text-primary"
                  >
                    Quanti immobili in tutto?
                  </label>
                  <input
                    id="realEstateCount"
                    name="realEstateCount"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    placeholder="Es. 2"
                    value={realEstateCount}
                    onChange={(e) => setRealEstateCount(e.target.value)}
                    className="w-32 rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
                  />
                  <p className="mt-1.5 text-xs text-text-muted">
                    Conta case, terreni, box e quote: ogni immobile in più può
                    incidere sul preventivo.
                  </p>
                </div>
              )}
              {askOver100k && (
                <OptionGroup
                  label="Il valore totale dell'eredità (conti, titoli, ecc.) supera i 100.000 euro?"
                  options={yesNo}
                  value={over100k}
                  onChange={setOver100k}
                />
              )}
              <OptionGroup
                label="Ci sono altri beni (quote societarie, azioni, aziende, imbarcazioni…)?"
                options={yesNo}
                value={hasOther}
                onChange={setHasOther}
              />
            </>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button variant="ghost" onClick={back}>
              <ArrowLeft className="h-4 w-4" />
              Indietro
            </Button>
          ) : (
            <span />
          )}

          {step < total - 1 ? (
            <Button onClick={next} disabled={!stepValid}>
              Avanti
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={seeResult} disabled={!stepValid} size="lg">
              <Sparkles className="h-4 w-4" />
              {submitLabel}
            </Button>
          )}
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-text-muted">
        {trustItems.map((item) => (
          <li key={item}>&bull; {item}</li>
        ))}
      </ul>
    </div>
  );
}
