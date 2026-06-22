"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createLead } from "@/app/(site)/preventivo/actions";
import { trackEvent } from "@/lib/analytics";

type Props = {
  stepTitles: string[];
  progressLabel: string;
  consensoPrivacy: string;
  consensoMarketing: string;
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
  consensoPrivacy,
  consensoMarketing,
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
  }>({});
  const [pending, startTransition] = useTransition();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneValid =
    phone.trim() === "" || /^[+()\d][\d\s().-]{5,19}$/.test(phone.trim());
  const nameValid = name.trim() !== "";

  const nameError =
    touched.name && !nameValid ? "Inserisci nome e cognome." : "";
  const emailError =
    email.trim() !== "" && !emailValid
      ? "Inserisci un'email valida (es. nome@email.it)."
      : touched.email && email.trim() === ""
        ? "L'email e obbligatoria."
        : "";
  const phoneError =
    phone.trim() !== "" && !phoneValid
      ? "Inserisci un numero di telefono valido."
      : "";

  const progress = ((step + 1) / total) * 100;
  const canSubmit =
    privacy && nameValid && emailValid && phoneValid && !pending;

  function next() {
    setStep((s) => Math.min(s + 1, total - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function submit() {
    startTransition(async () => {
      const parsedRealEstate = Number.parseInt(realEstateCount, 10);
      const result = await createLead({
        relation,
        heirs,
        hasRealEstate,
        realEstateCount:
          hasRealEstate === "si" && Number.isFinite(parsedRealEstate)
            ? parsedRealEstate
            : null,
        hasWill,
        hasOther,
        name,
        email,
        phone,
        marketing,
      });
      trackEvent("generate_lead", {
        esito: result.esito,
        relation,
        has_real_estate: hasRealEstate,
      });
      const params = new URLSearchParams({ esito: result.esito });
      if (result.practiceId) params.set("practice", result.practiceId);
      router.push(`/preventivo/grazie?${params.toString()}`);
    });
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
            </>
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

          {step === 3 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Nome e cognome"
                  name="name"
                  value={name}
                  onChange={setName}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  error={nameError}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={setEmail}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  error={emailError}
                />
              </div>
              <Input
                label="Telefono"
                name="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={setPhone}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                error={phoneError}
              />
              <label className="flex items-start gap-3 text-sm text-text">
                <input
                  type="checkbox"
                  checked={privacy}
                  onChange={(e) => setPrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                />
                <span>{consensoPrivacy}</span>
              </label>
              <label className="flex items-start gap-3 text-sm text-text-muted">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                />
                <span>{consensoMarketing}</span>
              </label>
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
            <Button onClick={next}>
              Avanti
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={!canSubmit} size="lg">
              {pending ? "Invio in corso…" : submitLabel}
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

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-primary"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "w-full rounded-[10px] border bg-bg px-3 py-2.5 text-sm focus:outline-none",
          error
            ? "border-error focus:border-error"
            : "border-primary/20 focus:border-accent",
        )}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}
