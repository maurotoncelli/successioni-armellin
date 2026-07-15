"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createLead } from "@/app/(site)/preventivo/actions";
import { LegalLinksText } from "@/components/site/legal-links-text";
import { trackEvent } from "@/lib/analytics";

/*
  Cattura contatto OPZIONALE sulla pagina risultato: l'utente ha gia visto
  l'esito/prezzo. Solo qui (e solo se vuole) lascia i dati - mai come barriera
  prima del valore. Usata in due modalita: "email_quote" (ricevi il preventivo
  via email) e "custom_quote" (richiedi un preventivo su misura).
*/

export type SoftLeadAnswers = {
  relation: string;
  heirs: string;
  hasRealEstate: string;
  realEstateCount: number | null;
  hasWill: string;
  hasOther: string;
  over100k?: string;
};

type Props = {
  kind: "email_quote" | "custom_quote";
  answers: SoftLeadAnswers;
  title: string;
  description: string;
  submitLabel: string;
  consensoPrivacy: string;
  consensoMarketing: string;
  successTitle: string;
  successBody: string;
  /** Testi alternativi se l'email di riepilogo NON e' partita (niente false promesse). */
  successTitleNoEmail?: string;
  successBodyNoEmail?: string;
  requirePhone?: boolean;
  /** Nota sotto il pulsante (es. "ti ricontattiamo noi entro un giorno lavorativo"). */
  footnote?: string;
};

export function SoftLead({
  kind,
  answers,
  title,
  description,
  submitLabel,
  consensoPrivacy,
  consensoMarketing,
  successTitle,
  successBody,
  successTitleNoEmail,
  successBodyNoEmail,
  requirePhone = false,
  footnote,
}: Props) {
  const [open, setOpen] = useState(kind === "custom_quote");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [done, setDone] = useState(false);
  const [emailWentOut, setEmailWentOut] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneValid = /^[+()\d][\d\s().-]{5,19}$/.test(phone.trim());
  const canSubmit =
    privacy &&
    emailValid &&
    (!requirePhone || phoneValid) &&
    (phone.trim() === "" || phoneValid) &&
    !pending;

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await createLead({
        relation: answers.relation,
        heirs: answers.heirs,
        hasRealEstate: answers.hasRealEstate,
        realEstateCount: answers.realEstateCount,
        hasWill: answers.hasWill,
        hasOther: answers.hasOther,
        over100k: answers.over100k,
        name,
        email,
        phone,
        marketing,
        kind,
      });
      trackEvent("generate_lead", { kind, esito: res.esito });
      if (res.ok) {
        setEmailWentOut(res.emailSent !== false);
        setDone(true);
      } else {
        // Senza DB configurato non possiamo salvare: messaggio onesto.
        setError(
          "Al momento non riusciamo a registrare la richiesta. Riprova piu tardi o chiamaci.",
        );
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" />
          <div>
            <h3 className="text-lg font-semibold text-primary">
              {emailWentOut ? successTitle : (successTitleNoEmail ?? successTitle)}
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              {emailWentOut ? successBody : (successBodyNoEmail ?? successBody)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-primary/15 bg-bg px-4 py-3 text-sm font-medium text-text transition-colors hover:border-accent/50 hover:text-accent"
      >
        <Mail className="h-4 w-4" />
        {title}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/10 bg-bg p-6">
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-1 text-sm text-text-muted">{description}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field
          label="Nome e cognome (facoltativo)"
          value={name}
          onChange={setName}
        />
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
        />
      </div>
      <div className="mt-3">
        <Field
          label={requirePhone ? "Telefono" : "Telefono (facoltativo)"}
          type="tel"
          value={phone}
          onChange={setPhone}
        />
      </div>

      <div className="mt-4 space-y-3">
        <label className="flex items-start gap-3 text-sm text-text">
          <input
            type="checkbox"
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
          />
          <span>
            <LegalLinksText text={consensoPrivacy} />
          </span>
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
      </div>

      {error && (
        <p className="mt-3 rounded-[10px] bg-red-50 p-3 text-xs text-red-700">
          {error}
        </p>
      )}

      <Button
        onClick={submit}
        disabled={!canSubmit}
        className={cn("mt-5 w-full")}
        size="lg"
      >
        {pending ? "Invio in corso…" : submitLabel}
      </Button>
      {footnote && (
        <p className="mt-3 text-center text-xs text-text-muted">{footnote}</p>
      )}
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-primary">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
      />
    </div>
  );
}
