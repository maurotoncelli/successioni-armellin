"use client";

import { useState } from "react";
import { Plus, ChevronDown, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export type AddonItem = {
  key: string;
  name: string;
  description: string;
  price: number;
};

export type AddonContact = {
  phoneHref: string;
  phoneLabel: string;
  emailHref: string;
  emailLabel: string;
};

/*
  Card dei servizi aggiuntivi (upsell @tariffe). Eleganti, con hover, e a click
  espandono un riassunto che invita al contatto telefonico/email. In questa fase
  i servizi NON sono acquistabili dal sito (restano fuori dal CRM): si attivano
  su richiesta. L'integrazione nel flusso d'acquisto arrivera piu avanti.
*/
export function AddonCards({
  addons,
  contactText,
  contact,
}: {
  addons: AddonItem[];
  contactText: string;
  contact: AddonContact;
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:mt-10 sm:grid-cols-2">
      {addons.map((addon) => {
        const open = openKey === addon.key;
        const panelId = `addon-panel-${addon.key}`;
        return (
          <div
            key={addon.key}
            className={cn(
              "group rounded-2xl border bg-bg p-5 shadow-sm transition-all duration-200",
              open
                ? "border-accent/50 shadow-md"
                : "border-primary/10 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenKey(open ? null : addon.key)}
              aria-expanded={open}
              aria-controls={panelId}
              className="flex w-full items-start justify-between gap-4 text-left"
            >
              <div className="min-w-0">
                <h3 className="text-lg text-primary transition-colors group-hover:text-accent">
                  {addon.name}
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  {addon.description}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="font-display text-xl font-bold text-primary">
                  +{addon.price}&euro;
                </span>
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full bg-sand text-accent transition-transform duration-200",
                    open && "rotate-180",
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </div>
            </button>

            {/* Pannello riassuntivo: animazione di altezza fluida (grid-rows). */}
            <div
              id={panelId}
              className={cn(
                "grid transition-all duration-300 ease-out",
                open
                  ? "mt-4 grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t border-primary/10 pt-4">
                  <p className="text-sm leading-relaxed text-text-muted">
                    {contactText}
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <a
                      href={contact.phoneHref}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark"
                    >
                      <Phone className="h-4 w-4" />
                      {contact.phoneLabel}
                    </a>
                    <a
                      href={contact.emailHref}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                    >
                      <Mail className="h-4 w-4" />
                      {contact.emailLabel}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {!open && (
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors group-hover:text-accent">
                <Plus className="h-3.5 w-3.5" />
                Scopri come attivarlo
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
