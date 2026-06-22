"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { PageHeading } from "@/components/area/ui";
import { useAreaData } from "@/components/area/area-context";
import { signOut } from "../../actions";

export default function ProfiloPage() {
  const { account } = useAreaData();
  const [emailNotif, setEmailNotif] = useState(true);
  const [waNotif, setWaNotif] = useState(false);

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
          <div className="flex justify-between">
            <dt className="text-text-muted">Telefono</dt>
            <dd className="font-medium text-text">{account.phone}</dd>
          </div>
        </dl>
      </Card>

      <Card className="mt-6">
        <h2 className="text-sm font-semibold text-text">Preferenze notifiche</h2>
        <div className="mt-3 space-y-3">
          <Toggle
            label="Notifiche via email"
            checked={emailNotif}
            onChange={setEmailNotif}
          />
          <Toggle
            label="Notifiche via WhatsApp"
            checked={waNotif}
            onChange={setWaNotif}
          />
        </div>
      </Card>

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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between text-sm text-text">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
