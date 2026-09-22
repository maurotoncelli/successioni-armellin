"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createLead } from "@/app/(site)/preventivo/actions";
import { LegalLinksText } from "@/components/site/legal-links-text";
import { trackAdsConversion, trackEvent } from "@/lib/analytics";
import type { HeirsComposition } from "@/lib/quote";
import {
  SOFT_LEAD_UI_IT,
  type SoftLeadUiLabels,
} from "@/lib/site-ui-labels";

/*
  Cattura contatto OPZIONALE sulla pagina risultato: l'utente ha gia visto
  l'esito/prezzo. Solo qui (e solo se vuole) lascia i dati - mai come barriera
  prima del valore. Tre modalita: "callback" (fatti richiamare), "email_quote"
  (ricevi il preventivo via email) e "custom_quote" (preventivo su misura).
*/

export type SoftLeadAnswers = {
  /** Composizione eredi per tipo (nuovo quiz); null se non disponibile. */
  heirsComposition: HeirsComposition | null;
  /** Numero totale eredi (stringa per compatibilita con il flusso esistente). */
  heirs: string;
  hasRealEstate: string;
  realEstateCount: number | null;
  hasWill: string;
  hasOther: string;
  over100k?: string;
  /** si | no | nonso — informativa per Lorenzo, non pesa sul prezzo. */
  heirsAbroad?: string;
};

export type SoftLeadKind = "email_quote" | "custom_quote" | "callback";

type Props = {
  kind: SoftLeadKind;
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
  requireName?: boolean;
  requireEmail?: boolean;
  /** Nota sotto il pulsante (es. "ti ricontattiamo noi entro un giorno lavorativo"). */
  footnote?: string;
  /** Campo note (soprattutto per preventivo su misura / orario di richiamo). */
  showNotes?: boolean;
  notesLabel?: string;
  notesPlaceholder?: string;
  fieldLabels?: SoftLeadUiLabels;
  /** Etichetta `data-cta` per GA4 (`cta_click` sul submit). */
  cta?: string;
  /**
   * Prima schermata del risultato: campi stretti, email e orario dietro
   * un riepilogo, input a 16px così il telefono non zooma.
   */
  compact?: boolean;
  /** Testo del riepilogo che apre email e orario, in modalità compact. */
  extrasSummary?: string;
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
  requireName = false,
  requireEmail = true,
  footnote,
  showNotes = false,
  notesLabel,
  notesPlaceholder,
  fieldLabels = SOFT_LEAD_UI_IT,
  cta,
  compact = false,
  extrasSummary,
}: Props) {
  const resolvedNotesLabel =
    notesLabel ?? fieldLabels.notes ?? SOFT_LEAD_UI_IT.notes ?? "Nota (facoltativa)";
  const [open, setOpen] = useState(kind === "custom_quote" || kind === "callback");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [done, setDone] = useState(false);
  const [emailWentOut, setEmailWentOut] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneValid = /^[+()\d][\d\s().-]{5,19}$/.test(phone.trim());
  const nameOk = !requireName || name.trim().length >= 2;
  const emailOk = requireEmail ? emailValid : email.trim() === "" || emailValid;
  const phoneOk = requirePhone ? phoneValid : phone.trim() === "" || phoneValid;
  const canSubmit = privacy && nameOk && emailOk && phoneOk && !pending;

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await createLead({
        heirsComposition: answers.heirsComposition,
        heirs: answers.heirs,
        hasRealEstate: answers.hasRealEstate,
        realEstateCount: answers.realEstateCount,
        hasWill: answers.hasWill,
        hasOther: answers.hasOther,
        over100k: answers.over100k,
        heirsAbroad: answers.heirsAbroad,
        name,
        email,
        phone,
        notes: notes.trim() || undefined,
        marketing,
        kind,
      });
      if (res.ok) {
        trackEvent("generate_lead", { kind, esito: res.esito });
        trackAdsConversion("lead");
        setEmailWentOut(res.emailSent !== false);
        setDone(true);
      } else {
        setError(fieldLabels.err_save);
      }
    });
  }

  if (done) {
    const showEmailCopy = !requireEmail || emailWentOut;
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" />
          <div>
            <h3 className="text-lg font-semibold text-primary">
              {showEmailCopy ? successTitle : (successTitleNoEmail ?? successTitle)}
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              {showEmailCopy ? successBody : (successBodyNoEmail ?? successBody)}
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
        data-cta={cta ? `${cta}_open` : undefined}
      >
        {kind === "callback" ? (
          <Phone className="h-4 w-4" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        {title}
      </button>
    );
  }

  const fieldSize = compact ? "lg" : "md";
  const foldExtras = compact && kind === "callback";

  const phoneField = (
    <Field
      label={requirePhone ? fieldLabels.phone : fieldLabels.phone_optional}
      type="tel"
      value={phone}
      onChange={setPhone}
      autoComplete="tel"
      inputMode="tel"
      size={fieldSize}
    />
  );
  const emailField = (
    <Field
      label={requireEmail ? fieldLabels.email : fieldLabels.email_optional}
      type="email"
      value={email}
      onChange={setEmail}
      autoComplete="email"
      inputMode="email"
      size={fieldSize}
    />
  );

  const notesBlock = showNotes ? (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-primary">
        {resolvedNotesLabel}
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={kind === "callback" ? 2 : 3}
        maxLength={800}
        placeholder={notesPlaceholder}
        className={cn(
          "w-full resize-y rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 focus:border-accent focus:outline-none",
          compact ? "text-base" : "text-sm",
        )}
      />
    </div>
  ) : null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/10 bg-bg",
        compact ? "p-4" : "p-4 sm:p-6",
      )}
    >
      <h3
        className={cn(
          "font-semibold text-primary",
          compact ? "text-base" : "text-lg",
          kind === "callback" &&
            "-mx-4 -mt-4 mb-3 rounded-t-2xl bg-sand px-4 text-primary",
          kind === "callback" &&
            (compact ? "py-3" : "py-3.5 sm:-mx-6 sm:-mt-6 sm:px-6"),
        )}
      >
        {title}
      </h3>
      <p className={cn("text-text-muted", compact ? "sr-only" : "mt-1 text-sm")}>
        {description}
      </p>

      <div className={cn("mt-3 grid gap-3", compact ? "grid-cols-2 items-end" : "sm:grid-cols-2")}>
        <Field
          label={requireName ? fieldLabels.name_required : fieldLabels.name}
          value={name}
          onChange={setName}
          autoComplete="name"
          size={fieldSize}
        />
        {kind === "callback" ? phoneField : emailField}
      </div>
      {!foldExtras && (
        <div className="mt-3">{kind === "callback" ? emailField : phoneField}</div>
      )}

      {!foldExtras && notesBlock ? <div className="mt-3">{notesBlock}</div> : null}

      {foldExtras && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-text-muted marker:text-text-muted">
            {extrasSummary}
          </summary>
          <div className="mt-3 space-y-3">
            {emailField}
            {notesBlock}
          </div>
        </details>
      )}

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
        className={cn(compact ? "mt-4 w-full" : "mt-5 w-full")}
        size="lg"
        data-cta={cta}
      >
        {pending ? fieldLabels.submitting : submitLabel}
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
  autoComplete,
  inputMode,
  size = "md",
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /** lg = 16px, così iOS non zooma al focus. */
  size?: "md" | "lg";
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-sm font-medium text-primary">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={cn(
          "w-full rounded-[10px] border border-primary/20 bg-bg px-3 focus:border-accent focus:outline-none",
          size === "lg" ? "py-3 text-base" : "py-2.5 text-sm",
        )}
      />
    </div>
  );
}
