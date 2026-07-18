"use client";

import { useState, useTransition } from "react";
import { LogOut, Pencil, Check, X, Loader2, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { PageHeading } from "@/components/area/ui";
import { useAreaData } from "@/components/area/area-context";
import { signOut } from "../../actions";
import { DIAL_CODES, splitPhone } from "@/lib/phone";
import { updatePhone, updatePassword, updateNotificationPrefs } from "./actions";

export default function ProfiloPage() {
  const { account } = useAreaData();

  return (
    <div>
      <PageHeading title="Profilo" subtitle="I tuoi recapiti e le preferenze." />

      <Card>
        <h2 className="text-sm font-semibold text-text">Recapiti</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-muted">Nome</dt>
            <dd className="font-medium text-text">{account.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Email</dt>
            <dd className="font-medium text-text">{account.email}</dd>
          </div>
          <PhoneRow initial={account.phone} />
        </dl>
      </Card>

      <Card className="mt-6">
        <h2 className="text-sm font-semibold text-text">Sicurezza</h2>
        <PasswordSection />
      </Card>

      <NotificationPrefs
        initialEmail={account.notifyEmail}
        initialWhatsapp={account.notifyWhatsapp}
      />

      <form action={signOut}>
        <button
          type="submit"
          className={buttonClasses({ variant: "outline", className: "mt-6" })}
        >
          <LogOut className="h-4 w-4" />
          Esci
        </button>
      </form>
    </div>
  );
}

function PhoneRow({ initial }: { initial: string }) {
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
        <dt className="text-text-muted">Telefono</dt>
        <dd className="flex items-center gap-2 font-medium text-text">
          {phone || <span className="text-text-muted">non inserito</span>}
          <button
            onClick={beginEdit}
            title={phone ? "Modifica numero" : "Aggiungi numero"}
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
        <dt className="shrink-0 pt-1.5 text-text-muted">Telefono</dt>
        <dd className="min-w-0">
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <select
              value={knownDial ? dial : "__other__"}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "__other__") setDial("+");
                else setDial(v);
              }}
              aria-label="Prefisso internazionale"
              className="rounded-lg border border-primary/20 bg-white px-2 py-1.5 text-sm focus:border-accent focus:outline-none"
            >
              {DIAL_CODES.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.label}
                </option>
              ))}
              <option value="__other__">Altro…</option>
            </select>
            {!knownDial && (
              <input
                type="tel"
                value={dial}
                onChange={(e) => setDial(e.target.value.replace(/[^\d+]/g, ""))}
                placeholder="+xy"
                aria-label="Prefisso personalizzato"
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
              title="Salva"
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
              title="Annulla"
              className="grid h-7 w-7 place-items-center rounded-lg text-text-muted hover:bg-bg-muted disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-right text-[11px] text-text-muted">
            Scegli il prefisso paese (+39, +49…) poi il numero nazionale.
          </p>
        </dd>
      </div>
      {error && <p className="mt-1.5 text-right text-xs text-error">{error}</p>}
    </div>
  );
}

/*
  Crea/cambia password (opzionale): chi la imposta puo' accedere anche con
  email+password, chi non la imposta continua con magic link/OTP.
*/
function PasswordSection() {
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
        <p className="text-sm text-text-muted">
          Se vuoi, puoi creare una password per accedere più in fretta, senza
          aspettare il link via email.
        </p>
        {saved && (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success">
            <Check className="h-4 w-4" />
            Password salvata: dal prossimo accesso puoi usarla insieme agli
            altri metodi.
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
          {saved ? "Cambia password" : "Crea o cambia password"}
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
          Nuova password (minimo 8 caratteri)
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
          Ripeti la password
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
          <p className="mt-1.5 text-xs text-error">
            Le due password non coincidono.
          </p>
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
          Salva password
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={pending}
          className={buttonClasses({ variant: "ghost" })}
        >
          Annulla
        </button>
      </div>
    </div>
  );
}

function NotificationPrefs({
  initialEmail,
  initialWhatsapp,
}: {
  initialEmail: boolean;
  initialWhatsapp: boolean;
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
      if (res.ok) setMsg("Preferenze salvate.");
      else setMsg(res.error);
    });
  }

  return (
    <Card className="mt-6">
      <h2 className="text-sm font-semibold text-text">Preferenze notifiche</h2>
      <p className="mt-1 text-xs text-text-muted">
        Le email operative (pagamento, documenti, imposte, chiusura) restano
        sempre attive. Qui puoi disattivare solo i messaggi facoltativi, come
        la richiesta di recensione.
      </p>
      <div className="mt-3 space-y-3">
        <Toggle
          label="Email facoltative (es. recensione)"
          checked={emailNotif}
          disabled={pending}
          onChange={(v) => {
            setEmailNotif(v);
            save(v, waNotif);
          }}
        />
        <Toggle
          label="WhatsApp (in arrivo)"
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
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
