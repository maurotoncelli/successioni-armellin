"use client";

import { useState, useTransition } from "react";
import { LogOut, Pencil, Check, X, Loader2, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { PageHeading } from "@/components/area/ui";
import { useAreaData } from "@/components/area/area-context";
import { signOut } from "../../actions";
import { DIAL_CODES, splitPhone } from "@/lib/phone";
import {
  updatePhone,
  updatePassword,
  updateNotificationPrefs,
  updateCommsLocale,
} from "./actions";
import {
  PROFILO_UI_IT,
  type ProfiloUiLabels,
} from "@/lib/area-ui-labels";
import type { CommsLocale } from "@/lib/comms-locale-shared";

export function ProfiloClient({
  title,
  subtitle,
  labels = PROFILO_UI_IT,
}: {
  title: string;
  subtitle: string;
  labels?: ProfiloUiLabels;
}) {
  const { account } = useAreaData();

  return (
    <div>
      <PageHeading title={title} subtitle={subtitle} />

      <Card>
        <h2 className="text-sm font-semibold text-text">{labels.contacts}</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-muted">{labels.name}</dt>
            <dd className="font-medium text-text">{account.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">{labels.email}</dt>
            <dd className="font-medium text-text">{account.email}</dd>
          </div>
          <PhoneRow initial={account.phone} labels={labels} />
        </dl>
      </Card>

      <Card className="mt-6">
        <h2 className="text-sm font-semibold text-text">{labels.security}</h2>
        <PasswordSection labels={labels} />
      </Card>

      <NotificationPrefs
        initialEmail={account.notifyEmail}
        initialWhatsapp={account.notifyWhatsapp}
        labels={labels}
      />

      <CommsLocalePrefs
        initial={account.commsLocale}
        labels={labels}
      />

      <form action={signOut}>
        <button
          type="submit"
          className={buttonClasses({ variant: "outline", className: "mt-6" })}
        >
          <LogOut className="h-4 w-4" />
          {labels.logout}
        </button>
      </form>
    </div>
  );
}

function PhoneRow({
  initial,
  labels,
}: {
  initial: string;
  labels: ProfiloUiLabels;
}) {
  const [phone, setPhone] = useState(initial);
  const [editing, setEditing] = useState(false);
  const split = splitPhone(initial);
  const [dial, setDial] = useState(split.dial);
  const [national, setNational] = useState(split.national);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function beginEdit() {
    const next = splitPhone(phone);
    setDial(next.dial);
    setNational(next.national);
    setError(null);
    setEditing(true);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await updatePhone(`${dial}${national}`);
      if (res.ok) {
        setPhone(res.phone);
        setEditing(false);
      } else {
        setError(res.error);
      }
    });
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-between">
        <dt className="text-text-muted">{labels.phone}</dt>
        <dd className="flex items-center gap-2 font-medium text-text">
          {phone || <span className="text-text-muted">{labels.phone_empty}</span>}
          <button
            onClick={beginEdit}
            title={phone ? labels.phone_edit : labels.phone_add}
            className="text-text-muted hover:text-accent-dark"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </dd>
      </div>
    );
  }

  const knownDial = DIAL_CODES.some((d) => d.code === dial);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <dt className="shrink-0 pt-1.5 text-text-muted">{labels.phone}</dt>
        <dd className="min-w-0">
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <select
              value={knownDial ? dial : "__other__"}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "__other__") setDial("+");
                else setDial(v);
              }}
              aria-label={labels.dial_aria}
              className="rounded-lg border border-primary/20 bg-white px-2 py-1.5 text-sm focus:border-accent focus:outline-none"
            >
              {DIAL_CODES.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.label}
                </option>
              ))}
              <option value="__other__">{labels.dial_other}</option>
            </select>
            {!knownDial && (
              <input
                type="tel"
                value={dial}
                onChange={(e) => setDial(e.target.value.replace(/[^\d+]/g, ""))}
                placeholder="+xy"
                aria-label={labels.dial_custom_aria}
                className="w-16 rounded-lg border border-primary/20 px-2 py-1.5 text-sm focus:border-accent focus:outline-none"
              />
            )}
            <input
              type="tel"
              value={national}
              onChange={(e) => setNational(e.target.value)}
              placeholder="320 1234567"
              autoFocus
              className="w-36 rounded-lg border border-primary/20 px-2.5 py-1.5 text-sm focus:border-accent focus:outline-none"
            />
            <button
              onClick={save}
              disabled={pending}
              title={labels.save}
              className="grid h-7 w-7 place-items-center rounded-lg bg-accent/10 text-accent-dark hover:bg-accent/20 disabled:opacity-50"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              disabled={pending}
              title={labels.cancel}
              className="grid h-7 w-7 place-items-center rounded-lg text-text-muted hover:bg-bg-muted disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-end text-[11px] text-text-muted">
            {labels.phone_hint}
          </p>
        </dd>
      </div>
      {error && <p className="mt-1.5 text-end text-xs text-error">{error}</p>}
    </div>
  );
}

/*
  Crea/cambia password (opzionale): chi la imposta puo' accedere anche con
  email+password, chi non la imposta continua con magic link/OTP.
*/
function PasswordSection({ labels }: { labels: ProfiloUiLabels }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const canSave =
    password.length >= 8 && password === confirm && !pending;

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await updatePassword(password);
      if (res.ok) {
        setSaved(true);
        setOpen(false);
        setPassword("");
        setConfirm("");
      } else {
        setError(res.error);
      }
    });
  }

  if (!open) {
    return (
      <div className="mt-3">
        <p className="text-sm text-text-muted">{labels.password_intro}</p>
        {saved && (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success">
            <Check className="h-4 w-4" />
            {labels.password_saved}
          </p>
        )}
        <button
          onClick={() => {
            setOpen(true);
            setSaved(false);
          }}
          className={buttonClasses({ variant: "outline", className: "mt-3" })}
        >
          <KeyRound className="h-4 w-4" />
          {saved ? labels.password_change : labels.password_create}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      <div>
        <label
          htmlFor="new-password"
          className="mb-1.5 block text-sm font-medium text-text"
        >
          {labels.password_new}
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full max-w-sm rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="confirm-password"
          className="mb-1.5 block text-sm font-medium text-text"
        >
          {labels.password_confirm}
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full max-w-sm rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
        />
        {confirm.length > 0 && confirm !== password && (
          <p className="mt-1.5 text-xs text-error">{labels.password_mismatch}</p>
        )}
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={!canSave}
          className={buttonClasses({})}
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {labels.password_save}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={pending}
          className={buttonClasses({ variant: "ghost" })}
        >
          {labels.cancel}
        </button>
      </div>
    </div>
  );
}

function NotificationPrefs({
  initialEmail,
  initialWhatsapp,
  labels,
}: {
  initialEmail: boolean;
  initialWhatsapp: boolean;
  labels: ProfiloUiLabels;
}) {
  const [emailNotif, setEmailNotif] = useState(initialEmail);
  const [waNotif, setWaNotif] = useState(initialWhatsapp);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save(nextEmail: boolean, nextWa: boolean) {
    setMsg(null);
    startTransition(async () => {
      const res = await updateNotificationPrefs({
        notifyEmail: nextEmail,
        notifyWhatsapp: nextWa,
      });
      if (res.ok) setMsg(labels.prefs_saved);
      else setMsg(res.error);
    });
  }

  return (
    <Card className="mt-6">
      <h2 className="text-sm font-semibold text-text">{labels.prefs_title}</h2>
      <p className="mt-1 text-xs text-text-muted">{labels.prefs_body}</p>
      <div className="mt-3 space-y-3">
        <Toggle
          label={labels.prefs_email}
          checked={emailNotif}
          disabled={pending}
          onChange={(v) => {
            setEmailNotif(v);
            save(v, waNotif);
          }}
        />
        <Toggle
          label={labels.prefs_wa}
          checked={waNotif}
          disabled
          onChange={(v) => {
            setWaNotif(v);
            save(emailNotif, v);
          }}
        />
      </div>
      {msg && <p className="mt-2 text-xs text-text-muted">{msg}</p>}
    </Card>
  );
}

function CommsLocalePrefs({
  initial,
  labels,
}: {
  initial: CommsLocale;
  labels: ProfiloUiLabels;
}) {
  const [locale, setLocale] = useState<CommsLocale>(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save(next: CommsLocale) {
    if (next === locale) return;
    setMsg(null);
    const prev = locale;
    setLocale(next);
    startTransition(async () => {
      const res = await updateCommsLocale(next);
      if (res.ok) setMsg(labels.prefs_saved);
      else {
        setLocale(prev);
        setMsg(res.error);
      }
    });
  }

  return (
    <Card className="mt-6">
      <h2 className="text-sm font-semibold text-text">
        {labels.comms_lang_title}
      </h2>
      <p className="mt-1 text-xs text-text-muted">{labels.comms_lang_body}</p>
      <p className="mt-2 rounded-lg border border-accent/25 bg-sand px-3 py-2 text-xs text-primary">
        {labels.comms_lang_notice}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(
          [
            { value: "it" as const, label: labels.comms_lang_it },
            { value: "ar" as const, label: labels.comms_lang_ar },
          ] as const
        ).map((opt) => {
          const active = locale === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={pending}
              onClick={() => save(opt.value)}
              className={`rounded-[10px] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                active
                  ? "border-accent bg-accent/10 text-accent-dark"
                  : "border-primary/15 text-text hover:border-primary/30"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {msg && <p className="mt-2 text-xs text-text-muted">{msg}</p>}
    </Card>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 text-sm text-text">
      <span className="min-w-0 leading-snug">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
          checked ? "bg-accent" : "bg-primary/15"
        }`}
      >
        <span
          className={`absolute top-0.5 start-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
