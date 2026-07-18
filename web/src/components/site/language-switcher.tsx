"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LOCALES, isLocale, type Locale } from "@/lib/content";
import {
  barePathFromLocation,
  isSeoExemptPath,
  isSeoPathLocale,
  localePath,
} from "@/lib/seo-locale";
import { cn } from "@/lib/utils";

/*
  Selettore lingua:
  - Lingue in SEO_PATH_LOCALES: naviga a /en/... /ar/... (URL indicizzabili)
  - IT: URL senza prefisso
  - Area/CRM: solo cookie (+ ?lang), mai prefisso SEO
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

const ORDER: Locale[] = [
  "it",
  "en",
  "fr",
  "de",
  "es",
  "sq",
  "ar",
  "zh",
  "ru",
  "tr",
  "hi",
];

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
  ariaLabel = "Seleziona lingua",
}: {
  locale?: string;
  align?: "left" | "right";
  tone?: "default" | "onDark";
  dropUp?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Locale>(
    isLocale(locale) ? locale : "it",
  );
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
    const { pathname, search } = window.location;
    const { barePath } = barePathFromLocation(pathname);
    const params = new URLSearchParams(search);
    params.delete("lang");

    // Area/CRM: niente prefisso SEO, solo cookie (+ ?lang per coerenza).
    if (isSeoExemptPath(barePath)) {
      if (loc !== "it") params.set("lang", loc);
      const q = params.toString();
      window.location.assign(`${barePath}${q ? `?${q}` : ""}`);
      return;
    }

    if (isSeoPathLocale(loc)) {
      const next = localePath(barePath, loc);
      const q = params.toString();
      window.location.assign(`${next}${q ? `?${q}` : ""}`);
      return;
    }

    // IT o lingue non-SEO: path nudo; ?lang= solo se ≠ it.
    if (loc !== "it") params.set("lang", loc);
    const q = params.toString();
    window.location.assign(`${barePath}${q ? `?${q}` : ""}`);
  };

  const items = ORDER.filter((l) => (LOCALES as readonly string[]).includes(l));

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
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
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={cn(
            // end/start logici: in RTL `right-0` spinge il menu fuori
            // dallo schermo quando lo switcher è sul bordo sinistro.
            "absolute z-50 max-h-80 w-44 max-w-[calc(100vw-1.5rem)] overflow-auto rounded-xl border border-primary/10 bg-bg p-1 shadow-lg",
            align === "right" ? "end-0" : "start-0",
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
                    <span className="text-xs uppercase text-text-muted">
                      {loc}
                    </span>
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
