import itRaw from "@/content/content_entries.it.json";
import enRaw from "@/content/content_entries.en.json";
import deRaw from "@/content/content_entries.de.json";
import esRaw from "@/content/content_entries.es.json";
import frRaw from "@/content/content_entries.fr.json";
import ruRaw from "@/content/content_entries.ru.json";
import trRaw from "@/content/content_entries.tr.json";
import zhRaw from "@/content/content_entries.zh.json";
import hiRaw from "@/content/content_entries.hi.json";
import arRaw from "@/content/content_entries.ar.json";
import sqRaw from "@/content/content_entries.sq.json";

/*
  Loader contenuti del sito (Fase 1+).
  Legge i seed per-lingua a build-time. IT fa fede; le altre lingue, quando
  arriveranno, sono solo file aggiuntivi nel registry `sources` (stessa forma).

  Predisposizione multilingua (prep):
  - Indice separato per locale: `collection.key` -> Entry, una mappa per lingua.
  - Lookup con fallback: locale richiesto -> DEFAULT_LOCALE (IT) -> fallback statico.
    Cosi una traduzione mancante non rompe mai la pagina e mostra l'italiano.
  - Tutte le firme accettano un `locale` opzionale (default IT): i call-site
    attuali restano invariati; quando ci sara il routing per lingua bastera
    passare il locale corrente.
  In Fase 4 il registry verra alimentato da Supabase (CMS interno) con identica
  interfaccia. Vedi blueprint/07_Stack.
*/

export const DEFAULT_LOCALE = "it";
export const LOCALES = [
  "it",
  "en",
  "ar",
  "de",
  "es",
  "ru",
  "tr",
  "zh",
  "hi",
  "sq",
  "fr",
] as const;
export type Locale = (typeof LOCALES)[number];

export type Cta = { label: string; href: string };
export type ImageRef = { asset_key: string };

type Entry = {
  collection: string;
  key: string;
  locale: string;
  value: unknown;
  is_published: boolean;
};

type Source = { entries: Entry[] };

/*
  Registry delle lingue disponibili. Per aggiungere una lingua:
  1) creare `content_entries.<locale>.json` (stessa struttura del file IT);
  2) importarlo qui e aggiungere la voce alla mappa (es. `en: enRaw`).
  Le chiavi mancanti ricadono automaticamente sull'italiano.
*/
const sources: Partial<Record<Locale, Source>> = {
  it: itRaw as Source,
  // Prep multilingua: `ar` e `en` hanno parity content_entries; le altre
  // (de/es/…) per ora solo area_login → il resto ricade sull'italiano.
  en: enRaw as Source,
  de: deRaw as Source,
  es: esRaw as Source,
  fr: frRaw as Source,
  ru: ruRaw as Source,
  tr: trRaw as Source,
  zh: zhRaw as Source,
  hi: hiRaw as Source,
  ar: arRaw as Source,
  sq: sqRaw as Source,
};

const byLocale = new Map<string, Map<string, Entry>>();
for (const [locale, source] of Object.entries(sources)) {
  const map = new Map<string, Entry>();
  for (const entry of source!.entries) {
    if (entry.is_published) map.set(`${entry.collection}.${entry.key}`, entry);
  }
  byLocale.set(locale, map);
}

export function availableLocales(): Locale[] {
  return Object.keys(sources) as Locale[];
}

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

// Sceglie il primo candidato valido (es. ?lang= poi cookie); altrimenti IT.
export function coerceLocale(
  ...candidates: Array<string | string[] | undefined | null>
): Locale {
  for (const c of candidates) {
    const v = Array.isArray(c) ? c[0] : c;
    if (isLocale(v)) return v;
  }
  return DEFAULT_LOCALE;
}

function lookup(
  collection: string,
  key: string,
  locale: string,
): Entry | undefined {
  const id = `${collection}.${key}`;
  const hit = byLocale.get(locale)?.get(id);
  if (hit) return hit;
  if (locale !== DEFAULT_LOCALE) {
    return byLocale.get(DEFAULT_LOCALE)?.get(id);
  }
  return undefined;
}

/**
 * Ritorna il valore di un blocco di contenuto, con fallback robusto:
 * locale richiesto -> italiano -> fallback statico. Una voce mancante o non
 * pubblicata non rompe mai la pagina (@07 Zod+fallback).
 */
export function get<T = unknown>(
  collection: string,
  key: string,
  fallback: T,
  locale: string = DEFAULT_LOCALE,
): T {
  const entry = lookup(collection, key, locale);
  if (!entry) return fallback;
  return entry.value as T;
}

export function text(
  collection: string,
  key: string,
  fallback = "",
  locale: string = DEFAULT_LOCALE,
): string {
  const value = get<unknown>(collection, key, fallback, locale);
  return typeof value === "string" ? value : fallback;
}

export function cta(
  collection: string,
  key: string,
  fallback: Cta = { label: "", href: "#" },
  locale: string = DEFAULT_LOCALE,
): Cta {
  const value = get<Partial<Cta>>(collection, key, fallback, locale);
  return {
    label: value?.label ?? fallback.label,
    href: value?.href ?? fallback.href,
  };
}

export function list<T = unknown>(
  collection: string,
  key: string,
  locale: string = DEFAULT_LOCALE,
): T[] {
  const value = get<unknown>(collection, key, [], locale);
  return Array.isArray(value) ? (value as T[]) : [];
}

export function obj<T extends object>(
  collection: string,
  key: string,
  fallback: T,
  locale: string = DEFAULT_LOCALE,
): T {
  const value = get<unknown>(collection, key, fallback, locale);
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallback;
  }
  // Merge shallow: chiavi mancanti nella traduzione restano in italiano.
  return { ...fallback, ...(value as T) };
}
