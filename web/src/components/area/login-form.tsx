"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Loader2,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { text, cta } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  sendMagicLink,
  verifyOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
  signInWithGoogle,
  signInWithPassword,
  type LoginState,
} from "@/app/area-riservata/actions";

const initial: LoginState = {};

// Logo Google multicolore ufficiale (le linee guida di Google lo richiedono
// per i pulsanti "Continua con Google").
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

// Tutti i testi vengono dal content system (data driven), collection "area_login",
// nella lingua attiva (locale). Le chiavi mancanti ricadono sull'italiano.
export function LoginForm({ locale }: { locale: string }) {
  const t = (key: string, fallback: string) =>
    text("area_login", key, fallback, locale);

  const [method, setMethod] = useState<"email" | "phone" | "password">("email");

  const [magicState, magicAction, magicPending] = useActionState(
    sendMagicLink,
    initial,
  );
  const [otpState, otpAction, otpPending] = useActionState(verifyOtp, initial);
  const [phoneState, phoneAction, phonePending] = useActionState(
    sendPhoneOtp,
    initial,
  );
  const [phoneOtpState, phoneOtpAction, phoneOtpPending] = useActionState(
    verifyPhoneOtp,
    initial,
  );
  const [pwdState, pwdAction, pwdPending] = useActionState(
    signInWithPassword,
    initial,
  );
  const [googleState, googleAction, googlePending] = useActionState(
    async (): Promise<LoginState> => signInWithGoogle(),
    initial,
  );

  const emailSent = magicState.sent === true;
  const phoneSent = phoneState.sent === true;
  const email = magicState.email ?? "";
  const phone = phoneState.phone ?? "";
  const sent =
    method === "email" ? emailSent : method === "phone" ? phoneSent : false;

  const [showOtp, setShowOtp] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get("error");
    if (err) {
      setLinkError(err === "link" ? t("error_link", "Link non valido.") : err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const privacy = cta(
    "area_login",
    "privacy_link",
    { label: "Privacy", href: "/privacy" },
    locale,
  );
  const termini = cta(
    "area_login",
    "termini_link",
    { label: "Termini", href: "/termini-condizioni" },
    locale,
  );

  const contactSpans = (template: string, value: string) =>
    template.split("{contact}").map((part, i, arr) => (
      <span key={i}>
        {part}
        {i < arr.length - 1 && (
          <span className="font-medium text-text">{value}</span>
        )}
      </span>
    ));

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent text-lg font-bold text-white">
            A
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-primary">
            {t("header_title", "Area personale")}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {t("header_subtitle", "Accedi per seguire la tua pratica.")}
          </p>
        </div>

        {linkError && (
          <div className="mb-4 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
            {linkError}
          </div>
        )}

        <div className="rounded-2xl border border-primary/10 bg-bg p-6 shadow-sm">
          {!sent && (
            <>
              {/* Google: un click e resti collegato (niente link da aspettare). */}
              <form action={googleAction}>
                <button
                  type="submit"
                  disabled={googlePending}
                  className="flex w-full items-center justify-center gap-2.5 rounded-[10px] border border-primary/20 bg-bg px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent/50 disabled:opacity-60"
                >
                  {googlePending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  {t("google_cta", "Continua con Google")}
                </button>
              </form>
              {googleState.error && (
                <p className="mt-2 text-sm text-error">{googleState.error}</p>
              )}

              <div className="my-5 flex items-center gap-3 text-xs text-text-muted">
                <span className="h-px flex-1 bg-primary/10" />
                {t("oppure", "oppure")}
                <span className="h-px flex-1 bg-primary/10" />
              </div>

              <div className="mb-5 grid grid-cols-3 gap-1 rounded-[10px] bg-primary/5 p-1">
                <button
                  type="button"
                  onClick={() => setMethod("email")}
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    method === "email"
                      ? "bg-bg text-primary shadow-sm"
                      : "text-text-muted hover:text-primary",
                  )}
                >
                  <Mail className="h-4 w-4" />
                  {t("tab_email", "Email")}
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("phone")}
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    method === "phone"
                      ? "bg-bg text-primary shadow-sm"
                      : "text-text-muted hover:text-primary",
                  )}
                >
                  <Phone className="h-4 w-4" />
                  {t("tab_phone", "Telefono")}
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("password")}
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    method === "password"
                      ? "bg-bg text-primary shadow-sm"
                      : "text-text-muted hover:text-primary",
                  )}
                >
                  <KeyRound className="h-4 w-4" />
                  {t("tab_password", "Password")}
                </button>
              </div>
            </>
          )}

          {/* ---------- EMAIL ---------- */}
          {method === "email" && !emailSent && (
            <form action={magicAction} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  {t("email_label", "La tua email")}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue={email}
                    placeholder={t("email_placeholder", "nome@email.it")}
                    className="w-full rounded-[10px] border border-primary/20 bg-bg py-2.5 pl-9 pr-3 text-sm text-text focus:border-accent focus:outline-none"
                  />
                </div>
                <p className="mt-1.5 text-xs text-text-muted">
                  {t("email_hint", "Usa l'email del pagamento.")}
                </p>
              </div>

              {magicState.error && (
                <p className="text-sm text-error">{magicState.error}</p>
              )}

              <button
                type="submit"
                disabled={magicPending}
                className={buttonClasses({ className: "w-full" })}
              >
                {magicPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("email_sending", "Invio in corso…")}
                  </>
                ) : (
                  <>
                    {t("email_cta", "Inviami il link di accesso")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </form>
          )}

          {method === "email" && emailSent && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
                  <Mail className="h-6 w-6" />
                </span>
                <p className="mt-3 font-medium text-text">
                  {t("sent_email_title", "Controlla la tua email")}
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  {contactSpans(
                    t(
                      "sent_email_body",
                      "Ti abbiamo inviato un link di accesso a {contact}.",
                    ),
                    email,
                  )}
                </p>
              </div>

              {!showOtp ? (
                <button
                  onClick={() => setShowOtp(true)}
                  className="mx-auto flex items-center gap-1.5 text-sm font-medium text-accent-dark hover:underline"
                >
                  <KeyRound className="h-4 w-4" />
                  {t("otp_toggle", "Ho ricevuto un codice, inseriscilo")}
                </button>
              ) : (
                <form
                  action={otpAction}
                  className="space-y-3 border-t border-primary/10 pt-4"
                >
                  <input type="hidden" name="email" value={email} />
                  <label
                    htmlFor="token"
                    className="block text-sm font-medium text-text"
                  >
                    {t("otp_label", "Codice a 6 cifre")}
                  </label>
                  <input
                    id="token"
                    name="token"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder={t("otp_placeholder", "123456")}
                    className="w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-center text-lg tracking-[0.3em] text-text focus:border-accent focus:outline-none"
                  />
                  {otpState.error && (
                    <p className="text-sm text-error">{otpState.error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={otpPending}
                    className={buttonClasses({ className: "w-full" })}
                  >
                    {otpPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("otp_verifying", "Verifica…")}
                      </>
                    ) : (
                      t("otp_cta", "Verifica codice")
                    )}
                  </button>
                </form>
              )}

              <form action={magicAction}>
                <input type="hidden" name="email" value={email} />
                <button
                  type="submit"
                  className="mx-auto block text-sm font-medium text-text-muted hover:underline"
                >
                  {t("resend", "Invia di nuovo")}
                </button>
              </form>
            </div>
          )}

          {/* ---------- TELEFONO ---------- */}
          {method === "phone" && !phoneSent && (
            <form action={phoneAction} className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  {t("phone_label", "Il tuo numero di telefono")}
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    defaultValue={phone}
                    placeholder={t("phone_placeholder", "+39 333 123 4567")}
                    className="w-full rounded-[10px] border border-primary/20 bg-bg py-2.5 pl-9 pr-3 text-sm text-text focus:border-accent focus:outline-none"
                  />
                </div>
                <p className="mt-1.5 text-xs text-text-muted">
                  {t("phone_hint", "Ti invieremo un codice via SMS.")}
                </p>
              </div>

              {phoneState.error && (
                <p className="text-sm text-error">{phoneState.error}</p>
              )}

              <button
                type="submit"
                disabled={phonePending}
                className={buttonClasses({ className: "w-full" })}
              >
                {phonePending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("phone_sending", "Invio in corso…")}
                  </>
                ) : (
                  <>
                    {t("phone_cta", "Inviami il codice via SMS")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ---------- PASSWORD ---------- */}
          {method === "password" && (
            <form action={pwdAction} className="space-y-4">
              <div>
                <label
                  htmlFor="pwd-email"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  {t("email_label", "La tua email")}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    id="pwd-email"
                    name="email"
                    type="email"
                    required
                    defaultValue={pwdState.email ?? ""}
                    placeholder={t("email_placeholder", "nome@email.it")}
                    className="w-full rounded-[10px] border border-primary/20 bg-bg py-2.5 pl-9 pr-3 text-sm text-text focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="pwd-password"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  {t("password_label", "La tua password")}
                </label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    id="pwd-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-[10px] border border-primary/20 bg-bg py-2.5 pl-9 pr-3 text-sm text-text focus:border-accent focus:outline-none"
                  />
                </div>
                <p className="mt-1.5 text-xs text-text-muted">
                  {t(
                    "password_hint",
                    "Si crea dal profilo, dopo il primo accesso. Non ce l'hai? Usa l'email.",
                  )}
                </p>
              </div>

              {pwdState.error && (
                <p className="text-sm text-error">{pwdState.error}</p>
              )}

              <button
                type="submit"
                disabled={pwdPending}
                className={buttonClasses({ className: "w-full" })}
              >
                {pwdPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("password_verifying", "Accesso in corso…")}
                  </>
                ) : (
                  <>
                    {t("password_cta", "Accedi")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </form>
          )}

          {method === "phone" && phoneSent && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
                  <Phone className="h-6 w-6" />
                </span>
                <p className="mt-3 font-medium text-text">
                  {t("sent_phone_title", "Controlla gli SMS")}
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  {contactSpans(
                    t(
                      "sent_phone_body",
                      "Ti abbiamo inviato un codice al numero {contact}.",
                    ),
                    phone,
                  )}
                </p>
              </div>

              <form
                action={phoneOtpAction}
                className="space-y-3 border-t border-primary/10 pt-4"
              >
                <input type="hidden" name="phone" value={phone} />
                <label
                  htmlFor="phone-token"
                  className="block text-sm font-medium text-text"
                >
                  {t("otp_label", "Codice a 6 cifre")}
                </label>
                <input
                  id="phone-token"
                  name="token"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder={t("otp_placeholder", "123456")}
                  className="w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-center text-lg tracking-[0.3em] text-text focus:border-accent focus:outline-none"
                />
                {phoneOtpState.error && (
                  <p className="text-sm text-error">{phoneOtpState.error}</p>
                )}
                <button
                  type="submit"
                  disabled={phoneOtpPending}
                  className={buttonClasses({ className: "w-full" })}
                >
                  {phoneOtpPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("otp_verifying", "Verifica…")}
                    </>
                  ) : (
                    t("otp_cta", "Verifica codice")
                  )}
                </button>
              </form>

              <form action={phoneAction}>
                <input type="hidden" name="phone" value={phone} />
                <button
                  type="submit"
                  className="mx-auto block text-sm font-medium text-text-muted hover:underline"
                >
                  {t("resend", "Invia di nuovo")}
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t("secure_note", "Accesso sicuro")} ·{" "}
          <Link href={privacy.href} className="hover:underline">
            {privacy.label}
          </Link>{" "}
          ·{" "}
          <Link href={termini.href} className="hover:underline">
            {termini.label}
          </Link>
        </p>
      </div>
    </div>
  );
}
