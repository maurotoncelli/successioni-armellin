"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { computeEsito, suggestedPackage } from "@/lib/quote";
import { trackEvent } from "@/lib/analytics";

/*
  Form pubblico del preventivo - versione "result-first" (no barriera contatti).
  Solo domande: al termine calcoliamo l'esito LATO CLIENT (nessun dato personale,
  nessuna scrittura su DB) e portiamo l'utente alla pagina risultato passando le
  risposte via query string. I contatti si chiedono solo dopo, e solo se serve
  (pagamento, opt-in email, preventivo su misura).
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
  label: string;
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

const yesNo: Choice[] = [
  { value: "si", label: "Si" },
  { value: "no", label: "No" },
  { value: "nonso", label: "Non lo so" },
];

export function PreventivoForm({
  stepTitles,
  progressLabel,
  submitLabel,
  trustItems,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const total = stepTitles.length;

  const [relation, setRelation] = useState("");
  const [heirs, setHeirs] = useState("");
  const [hasRealEstate, setHasRealEstate] = useState("");
  const [realEstateCount, setRealEstateCount] = useState("");
  const [hasWill, setHasWill] = useState("");
  const [hasOther, setHasOther] = useState("");

  const progress = ((step + 1) / total) * 100;

  // Avanti abilitato solo quando la domanda dello step ha una risposta.
  const stepValid =
    (step === 0 && relation !== "") ||
    (step === 1 && heirs !== "") ||
    (step === 2 && hasRealEstate !== "");

  function next() {
    setStep((s) => Math.min(s + 1, total - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function seeResult() {
    const esito = computeEsito({ relation, hasRealEstate, hasOther });
    const pkg = suggestedPackage(esito);
    const parsed = Number.parseInt(realEstateCount, 10);
    const params = new URLSearchParams({
      esito,
      rel: relation,
      heirs,
      hasre: hasRealEstate,
      will: hasWill || "no",
      other: hasOther || "no",
    });
    if (pkg) params.set("pkg", pkg);
    if (hasRealEstate === "si" && Number.isFinite(parsed) && parsed > 0) {
      params.set("recount", String(parsed));
    }
    trackEvent("quote_result", {
      esito,
      relation,
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
            <OptionGroup
              label="Che parentela hai con la persona mancata?"
              options={[
                { value: "coniuge", label: "Coniuge" },
                { value: "figlio", label: "Figlio/a" },
                { value: "genitore", label: "Genitore (madre/padre)" },
                { value: "fratello", label: "Fratello/Sorella" },
                { value: "nipote", label: "Nipote" },
                { value: "altro", label: "Altro" },
              ]}
              value={relation}
              onChange={setRelation}
            />
          )}

          {step === 1 && (
            <OptionGroup
              label="Quanti eredi siete in tutto?"
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "5+", label: "5 o piu" },
              ]}
              value={heirs}
              onChange={setHeirs}
            />
          )}

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
                    Conta case, terreni, box e quote: ogni immobile in piu puo
                    incidere sul preventivo.
                  </p>
                </div>
              )}
              <OptionGroup
                label="C'e un testamento?"
                options={yesNo}
                value={hasWill}
                onChange={setHasWill}
              />
              <OptionGroup
                label="Ci sono altri beni (quote, aziende, veicoli)?"
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
