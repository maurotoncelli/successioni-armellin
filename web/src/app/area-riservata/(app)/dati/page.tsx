"use client";

import { useState } from "react";
import { ShieldCheck, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { PageHeading } from "@/components/area/ui";

export default function DatiPage() {
  const [iban, setIban] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <PageHeading
        title="I tuoi dati"
        subtitle="Alcuni dati aggiuntivi che ci servono per completare la pratica."
      />

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="iban" className="mb-1.5 block text-sm font-medium text-text">
              IBAN dell&apos;erede
            </label>
            <input
              id="iban"
              value={iban}
              onChange={(e) => {
                setIban(e.target.value.toUpperCase());
                setSaved(false);
              }}
              placeholder="IT60 X054 2811 1010 0000 0123 456"
              className="w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
            />
            <p className="mt-1.5 flex items-start gap-1.5 text-xs text-text-muted">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Dato sensibile: serve solo per l&apos;eventuale addebito delle imposte
              (F24). Conservato in modo cifrato.
            </p>
          </div>

          <button type="submit" className={buttonClasses()}>
            Salva
          </button>

          {saved && (
            <p className="flex items-center gap-1.5 text-sm font-medium text-success">
              <Check className="h-4 w-4" />
              Dati salvati correttamente.
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
