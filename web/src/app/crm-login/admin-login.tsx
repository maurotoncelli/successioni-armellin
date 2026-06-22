"use client";

import { useActionState, useState, useTransition } from "react";
import { Loader2, Lock, ShieldCheck, KeyRound } from "lucide-react";
import {
  adminLogin,
  bootstrapAdmin,
  verifyTotp,
  emergencyLogin,
  type AdminLoginStep,
  type LoginResult,
} from "./actions";

type Step =
  | { name: "login" }
  | { name: "totp"; factorId: string }
  | { name: "enroll"; factorId: string; qr: string; secret: string };

const inputCls =
  "w-full rounded-lg border border-crm-border bg-crm-bg2 px-3 py-2.5 text-sm text-crm-text placeholder:text-crm-muted focus:border-crm-accent focus:outline-none";
const btnCls =
  "inline-flex w-full items-center justify-center gap-2 rounded-lg crm-gradient px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60";

export function AdminLogin() {
  const [step, setStep] = useState<Step>({ name: "login" });
  const [mode, setMode] = useState<"login" | "bootstrap" | "emergency">("login");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function applyStep(res: AdminLoginStep) {
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError(null);
    if (res.next === "totp") setStep({ name: "totp", factorId: res.factorId });
    else
      setStep({
        name: "enroll",
        factorId: res.factorId,
        qr: res.qr,
        secret: res.secret,
      });
  }

  function onLogin(formData: FormData) {
    setError(null);
    start(async () => applyStep(await adminLogin(formData)));
  }

  function onBootstrap(formData: FormData) {
    setError(null);
    start(async () => applyStep(await bootstrapAdmin(formData)));
  }

  function onVerify(formData: FormData) {
    if (step.name === "login") return;
    const factorId = step.factorId;
    const code = String(formData.get("code") ?? "");
    setError(null);
    start(async () => {
      const res = await verifyTotp(factorId, code);
      if (!res.ok) setError(res.error);
    });
  }

  /* --- Passo 2: verifica/attivazione TOTP --- */
  if (step.name === "totp" || step.name === "enroll") {
    const enrolling = step.name === "enroll";
    return (
      <div className="mt-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-crm-text">
          <ShieldCheck className="h-4 w-4 text-crm-accent" />
          {enrolling ? "Attiva l'autenticazione a due fattori" : "Verifica in due passaggi"}
        </div>

        {enrolling && (
          <div className="space-y-3 rounded-lg border border-crm-border bg-crm-bg2 p-3">
            <p className="text-xs leading-relaxed text-crm-muted">
              Scansiona il QR con Google Authenticator / Microsoft Authenticator,
              poi inserisci il codice a 6 cifre per confermare.
            </p>
            <div className="flex justify-center rounded-md bg-white p-2">
              {/* qr_code e un data URL SVG generato da Supabase */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={step.qr} alt="QR per l'autenticatore" width={180} height={180} />
            </div>
            <p className="break-all text-center text-[11px] text-crm-muted">
              Oppure inserisci la chiave: <span className="font-mono">{step.secret}</span>
            </p>
          </div>
        )}

        <form action={onVerify} className="space-y-3">
          <input
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            placeholder="123456"
            className={`${inputCls} text-center text-lg tracking-[0.3em]`}
          />
          {error && <p className="text-xs text-crm-rose">{error}</p>}
          <button type="submit" disabled={pending} className={btnCls}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {enrolling ? "Attiva e accedi" : "Verifica e accedi"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setStep({ name: "login" });
            setError(null);
          }}
          className="block w-full text-center text-[11px] text-crm-muted hover:underline"
        >
          Torna indietro
        </button>
      </div>
    );
  }

  /* --- Bootstrap primo admin --- */
  if (mode === "bootstrap") {
    return (
      <div className="mt-5 space-y-3">
        <p className="text-xs text-crm-muted">
          Primo accesso: crea l&apos;account amministratore (solo per le email in
          allowlist).
        </p>
        <form action={onBootstrap} className="space-y-3">
          <input name="email" type="email" required placeholder="Email admin" className={inputCls} />
          <input name="password" type="password" required placeholder="Nuova password (min 10)" className={inputCls} />
          <input name="confirm" type="password" required placeholder="Conferma password" className={inputCls} />
          {error && <p className="text-xs text-crm-rose">{error}</p>}
          <button type="submit" disabled={pending} className={btnCls}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Crea account e attiva 2FA
          </button>
        </form>
        <button
          type="button"
          onClick={() => { setMode("login"); setError(null); }}
          className="block w-full text-center text-[11px] text-crm-muted hover:underline"
        >
          Ho gia un account, accedi
        </button>
      </div>
    );
  }

  /* --- Accesso d'emergenza (ADMIN_PASSWORD) --- */
  if (mode === "emergency") {
    return (
      <div className="mt-5 space-y-3">
        <p className="text-xs text-crm-muted">
          Accesso d&apos;emergenza con la password provvisoria del pannello.
        </p>
        <EmergencyForm />
        <button
          type="button"
          onClick={() => { setMode("login"); setError(null); }}
          className="block w-full text-center text-[11px] text-crm-muted hover:underline"
        >
          Torna all&apos;accesso normale
        </button>
      </div>
    );
  }

  /* --- Passo 1: email + password --- */
  return (
    <div className="mt-5 space-y-3">
      <form action={onLogin} className="space-y-3">
        <input name="email" type="email" required autoFocus placeholder="Email" className={inputCls} />
        <input name="password" type="password" required placeholder="Password" className={inputCls} />
        {error && <p className="text-xs text-crm-rose">{error}</p>}
        <button type="submit" disabled={pending} className={btnCls}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Accedi
        </button>
      </form>

      <div className="flex items-center justify-between pt-1 text-[11px] text-crm-muted">
        <button type="button" onClick={() => { setMode("bootstrap"); setError(null); }} className="hover:underline">
          Primo accesso admin
        </button>
        <button type="button" onClick={() => { setMode("emergency"); setError(null); }} className="hover:underline">
          Accesso d&apos;emergenza
        </button>
      </div>
    </div>
  );
}

function EmergencyForm() {
  const [state, action, pending] = useActionState<LoginResult, FormData>(
    emergencyLogin,
    null,
  );
  return (
    <form action={action} className="space-y-3">
      <input name="password" type="password" required placeholder="Password pannello" className={inputCls} />
      {state?.error && <p className="text-xs text-crm-rose">{state.error}</p>}
      <button type="submit" disabled={pending} className={btnCls}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Accedi (emergenza)
      </button>
    </form>
  );
}
