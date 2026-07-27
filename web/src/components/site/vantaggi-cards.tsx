"use client";

import { useState } from "react";
import {
  ChevronDown,
  HeartHandshake,
  House,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const icons = [House, ShieldCheck, HeartHandshake];

type Item = { titolo: string; testo: string };

/**
 * Vantaggi "Zero code / Zero errori / Assistenza umana".
 * Mobile: righe compatte espandibili (accordion) per dimezzare l'altezza.
 * Da md: card classiche a 3 colonne, testo sempre visibile.
 */
export function VantaggiCards({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-4 grid gap-2 sm:mt-12 sm:gap-6 md:grid-cols-3">
      {items.map((v, i) => {
        const Icon = icons[i % icons.length];
        const isOpen = openIndex === i;
        return (
          <Card key={v.titolo} className="p-0 md:p-6 md:text-center">
            {/* Mobile: riga tappabile, il testo si apre solo su richiesta */}
            <h3 className="md:hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand text-accent">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1 text-base leading-snug">
                  {v.titolo}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-text-muted transition-transform",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            {isOpen ? (
              <p className="px-3 pb-3 ps-[3.75rem] text-sm leading-relaxed text-text-muted md:hidden">
                {v.testo}
              </p>
            ) : null}

            {/* Desktop: card classica sempre espansa */}
            <div className="hidden md:block">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sand text-accent">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-4 text-xl">{v.titolo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {v.testo}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
