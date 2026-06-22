import raw from "@/content/content_entries.it.json";

/*
  Loader contenuti del prototipo (Fase 1).
  Legge il seed IT (blueprint/seed/content_entries.it.json) a build-time.
  In Fase 4 questo layer verra sostituito da letture da Supabase (CMS interno) con
  identica interfaccia, cosi le pagine non cambiano. Vedi blueprint/07_Stack.
*/

export type Cta = { label: string; href: string };
export type ImageRef = { asset_key: string };

type Entry = {
  collection: string;
  key: string;
  locale: string;
  value: unknown;
  is_published: boolean;
};

const entries = (raw as { entries: Entry[] }).entries;

const index = new Map<string, Entry>();
for (const entry of entries) {
  index.set(`${entry.collection}.${entry.key}`, entry);
}

/**
 * Ritorna il valore di un blocco di contenuto, con fallback robusto:
 * se la chiave manca o non e pubblicata, ritorna il fallback (default vuoto).
 * Questo garantisce che una voce mancante non rompa mai la pagina (@07 Zod+fallback).
 */
export function get<T = unknown>(
  collection: string,
  key: string,
  fallback: T,
): T {
  const entry = index.get(`${collection}.${key}`);
  if (!entry) return fallback;
  return entry.value as T;
}

export function text(collection: string, key: string, fallback = ""): string {
  const value = get<unknown>(collection, key, fallback);
  return typeof value === "string" ? value : fallback;
}

export function cta(
  collection: string,
  key: string,
  fallback: Cta = { label: "", href: "#" },
): Cta {
  const value = get<Partial<Cta>>(collection, key, fallback);
  return {
    label: value?.label ?? fallback.label,
    href: value?.href ?? fallback.href,
  };
}

export function list<T = unknown>(collection: string, key: string): T[] {
  const value = get<unknown>(collection, key, []);
  return Array.isArray(value) ? (value as T[]) : [];
}

export function obj<T extends object>(
  collection: string,
  key: string,
  fallback: T,
): T {
  const value = get<unknown>(collection, key, fallback);
  return value && typeof value === "object" ? (value as T) : fallback;
}
