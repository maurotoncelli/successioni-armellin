"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  IconRemote,
  IconTimeline,
  IconVerify,
} from "@/components/site/come-funziona-icons";
import { EmphBlock } from "@/components/site/emph";
import { cn } from "@/lib/utils";

const panelIcons = [
  { Icon: IconTimeline, color: "text-accent" },
  { Icon: IconVerify, color: "text-primary" },
  { Icon: IconRemote, color: "text-primary" },
];

type Item = { titolo: string; testo: string };

const cardClass =
  "rounded-2xl border border-primary/10 bg-bg shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/**
 * Pannelli "Quanto tempo / Cosa facciamo / Tutto online".
 * Mobile: righe compatte espandibili al tap.
 * Da md: card a 3 colonne con testo sempre visibile.
 */
export function ComeFunzionaPanels({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="grid gap-2 sm:gap-4 md:grid-cols-3">
      {items.map((item, i) => {
        const { Icon, color } = panelIcons[i % panelIcons.length];
        const isOpen = openIndex === i;
        return (
          <div key={item.titolo} className={cn(cardClass, "md:p-6")}>
            {/* Mobile: riga tappabile, il testo si apre solo su richiesta */}
            <h3 className="md:hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <Icon className={cn("h-7 w-7 shrink-0", color)} aria-hidden />
                <span className="min-w-0 flex-1 text-base font-bold leading-snug text-primary">
                  {item.titolo}
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
              <EmphBlock
                className="px-3 pb-3 ps-[3.25rem] text-sm leading-relaxed text-text-muted first:mt-0 [&:not(:first-child)]:mt-2.5 md:hidden"
                text={item.testo}
              />
            ) : null}

            {/* Desktop: card classica sempre espansa */}
            <div className="hidden md:block">
              <Icon className={cn("h-9 w-9", color)} aria-hidden />
              <h3 className="mt-5 text-xl font-bold text-primary">{item.titolo}</h3>
              <EmphBlock
                className="mt-2.5 text-sm leading-relaxed text-text-muted first:mt-2.5"
                text={item.testo}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
