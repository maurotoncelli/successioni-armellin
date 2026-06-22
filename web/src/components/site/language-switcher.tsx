"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LOCALES, isLocale, type Locale } from "@/lib/content";
import { cn } from "@/lib/utils";

/*
  Selettore lingua (data driven sui LOCALES del content system).
  - Mostra TUTTE le lingue target. Oggi solo l'area login e tradotta: le altre
    pagine ricadono sull'italiano (predisposizione multilingua).
  - Salva la scelta in un cookie "lang" (persistente) e aggiorna il parametro
    ?lang= della pagina corrente, cosi le pagine locale-aware reagiscono subito.
*/

const LANGUAGE_LABELS: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  sq: "Shqip",
  ar: "العربية",
  zh: "中文",
  ru: "Русский",
  tr: "Türkçe",
  hi: "हिन्दी",
};

// Ordine di visualizzazione (IT prima, poi per diffusione attesa tra i clienti).
const ORDER: Locale[] = ["it", "en", "fr", "de", "es", "sq", "ar", "zh", "ru", "tr", "hi"];

function setLangCookie(locale: string) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `lang=${locale}; path=/; max-age=${oneYear}; samesite=lax`;
}

export function LanguageSwitcher({
  locale,
  align = "right",
  tone = "default",
  dropUp = false,
  className,
}: {
  // Se assente (es. nella navbar statica) la lingua attiva si rileva dal cookie.
  locale?: string;
  align?: "left" | "right";
  // "onDark": testo chiaro per sfondi scuri (es. footer).
  tone?: "default" | "onDark";
  // Apre il menu verso l'alto (utile nel footer, in fondo alla pagina).
  dropUp?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Locale>(isLocale(locale) ? locale : "it");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLocale(locale)) {
      setCurrent(locale);
      return;
    }
    const m = document.cookie.match(/(?:^|;\s*)lang=([^;]+)/);
    const fromCookie = m?.[1];
    if (isLocale(fromCookie)) setCurrent(fromCookie);
  }, [locale]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const select = (loc: Locale) => {
    setLangCookie(loc);
    const url = new URL(window.location.href);
    if (loc === "it") url.searchParams.delete("lang");
    else url.searchParams.set("lang", loc);
    window.location.assign(url.toString());
  };

  const items = ORDER.filter((l) => (LOCALES as readonly string[]).includes(l));

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Seleziona lingua"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
          tone === "onDark"
            ? "text-white/80 hover:text-white"
            : "text-primary hover:text-accent",
        )}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{current}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={cn(
            "absolute z-50 max-h-80 w-44 overflow-auto rounded-xl border border-primary/10 bg-bg p-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
            dropUp ? "bottom-full mb-1" : "mt-1",
          )}
        >
          {items.map((loc) => {
            const active = loc === current;
            return (
              <li key={loc}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  dir={loc === "ar" ? "rtl" : "ltr"}
                  onClick={() => select(loc)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/5 font-semibold text-primary"
                      : "text-text hover:bg-primary/5",
                  )}
                >
                  <span>{LANGUAGE_LABELS[loc]}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-xs uppercase text-text-muted">{loc}</span>
                    {active && <Check className="h-3.5 w-3.5 text-accent" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
