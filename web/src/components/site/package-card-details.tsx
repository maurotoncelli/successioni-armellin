"use client";

import { useState } from "react";
import { Check, ChevronDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  description: string;
  features: string[];
  /** check = pacchetti standard, message = card Su misura. */
  icon?: "check" | "message";
  /** Label del toggle mobile (es. "Cosa include"). */
  toggleLabel: string;
};

/**
 * Descrizione + lista voci di una card prezzo.
 * Mobile: chiusi dietro un toggle "Cosa include" per accorciare le card.
 * Da md: sempre visibili (layout classico).
 */
export function PackageCardDetails({
  description,
  features,
  icon = "check",
  toggleLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const BulletIcon = icon === "message" ? MessageCircle : Check;
  const bulletColor = icon === "message" ? "text-accent" : "text-success";

  const body = (
    <>
      <p className="mt-4 text-sm leading-relaxed text-text md:mt-5">
        {description}
      </p>
      <ul className="mt-4 space-y-3 md:mt-5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <BulletIcon
              className={cn("mt-0.5 h-4 w-4 shrink-0", bulletColor)}
              aria-hidden
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="flex-1">
      {/* Mobile: toggle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mt-4 flex w-full items-center justify-between gap-2 rounded-lg border border-primary/10 bg-bg-muted/60 px-3 py-2 text-sm font-medium text-primary md:hidden"
      >
        {toggleLabel}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-muted transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? <div className="md:hidden">{body}</div> : null}

      {/* Desktop: sempre visibile */}
      <div className="hidden md:block">{body}</div>
    </div>
  );
}
