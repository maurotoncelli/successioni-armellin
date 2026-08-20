"use client";

import { useState } from "react";
import { Check, ChevronDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  description?: string;
  features: string[];
  /** check = pacchetti standard, message = card Su misura. */
  icon?: "check" | "message";
  /** Label del toggle mobile (es. "Cosa include"). */
  toggleLabel: string;
  /** Voci da pesare di più (USP della card). */
  peakFeatures?: string[];
};

function isPeak(feature: string, peaks: string[]) {
  if (peaks.includes(feature)) return true;
  return /catastal|voltura|geometr|cadastr|land registry|surveyor|kataster|cadastre|catastro|katast/.test(
    feature,
  );
}

/**
 * Lista voci di una card prezzo. Niente paragrafo ripetitivo:
 * il ritmo è prezzo → chip → cosa prendi.
 * Mobile: chiusi dietro un toggle per accorciare le card.
 */
export function PackageCardDetails({
  features,
  icon = "check",
  toggleLabel,
  peakFeatures = [],
}: Props) {
  const [open, setOpen] = useState(false);
  const BulletIcon = icon === "message" ? MessageCircle : Check;
  const bulletColor = icon === "message" ? "text-accent" : "text-success";

  const body = (
    <ul className="mt-4 space-y-3 md:mt-5">
      {features.map((feature) => {
        const peak = isPeak(feature, peakFeatures);
        return (
          <li
            key={feature}
            className={cn(
              "flex items-start gap-2.5 text-sm",
              peak && "font-semibold text-primary",
            )}
          >
            <BulletIcon
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                peak ? "text-accent" : bulletColor,
              )}
              aria-hidden
            />
            <span>{feature}</span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="flex-1">
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
      <div className="hidden md:block">{body}</div>
    </div>
  );
}
