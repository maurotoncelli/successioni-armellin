import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "@/lib/content";

/*
  Locale SEO con prefisso path.
  IT resta sugli URL senza prefisso (nessun shock SEO).
  Tutte le altre lingue UI → `/en/...`, `/de/...`, ecc.
*/

export const SEO_PATH_LOCALES = LOCALES.filter(
  (l): l is Exclude<Locale, typeof DEFAULT_LOCALE> => l !== DEFAULT_LOCALE,
);
export type SeoPathLocale = (typeof SEO_PATH_LOCALES)[number];

const NO_SEO_PREFIX_PREFIXES = [
  "/area-riservata",
  "/crm",
  "/crm-login",
  "/api",
  "/brogliaccio",
] as const;

export function isSeoPathLocale(value: unknown): value is SeoPathLocale {
  return (
    typeof value === "string" &&
    (SEO_PATH_LOCALES as readonly string[]).includes(value)
  );
}

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.successioniarmellin.it"
  ).replace(/\/$/, "");
}

/** True se il path non deve mai avere prefisso locale (area, CRM, API…). */
export function isSeoExemptPath(pathname: string): boolean {
  return NO_SEO_PREFIX_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/**
 * Estrae locale da prefisso path (`/en/tariffe` → en + `/tariffe`).
 * Non tocca path exempt anche se per errore hanno prefisso.
 */
export function stripSeoLocalePrefix(pathname: string): {
  locale: SeoPathLocale | null;
  pathname: string;
} {
  const segments = pathname.split("/");
  const maybe = segments[1];
  if (!isSeoPathLocale(maybe)) {
    return { locale: null, pathname };
  }
  const rest = "/" + segments.slice(2).join("/");
  const stripped = rest === "/" ? "/" : rest.replace(/\/$/, "") || "/";
  return { locale: maybe, pathname: stripped === "//" ? "/" : stripped };
}

/** Prefissa href interni del sito pubblico per locale SEO. */
export function localePath(href: string, locale: Locale): string {
  if (!href.startsWith("/")) return href;
  if (href.startsWith("//")) return href;
  if (isSeoExemptPath(href)) return href;

  const { pathname: clean } = stripSeoLocalePrefix(href);
  if (!isSeoPathLocale(locale)) return clean;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}

/** Path “nudo” (senza prefisso locale) a partire dall’URL corrente. */
export function barePathFromLocation(
  pathname: string,
  search = "",
): { barePath: string; search: string } {
  const { pathname: bare } = stripSeoLocalePrefix(pathname);
  return { barePath: bare, search };
}

export function absoluteUrl(path: string): string {
  const base = siteBaseUrl();
  if (path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function languagesMap(barePath: string): Record<string, string> {
  const clean =
    !barePath || barePath === "/"
      ? "/"
      : barePath.startsWith("/")
        ? barePath
        : `/${barePath}`;

  const itUrl = absoluteUrl(clean === "/" ? "/" : clean);
  const languages: Record<string, string> = {
    it: itUrl,
    "x-default": itUrl,
  };
  for (const loc of SEO_PATH_LOCALES) {
    const p = localePath(clean, loc);
    languages[loc] = absoluteUrl(p === "/" ? `/${loc}` : p);
  }
  return languages;
}

/**
 * alternates.canonical + languages (it + tutte le SEO locales + x-default).
 * `barePath` = path senza prefisso locale (`/tariffe`, `/`).
 */
export function buildLocaleAlternates(
  barePath: string,
  currentLocale: Locale = DEFAULT_LOCALE,
): NonNullable<Metadata["alternates"]> {
  const clean =
    !barePath || barePath === "/"
      ? "/"
      : barePath.startsWith("/")
        ? barePath
        : `/${barePath}`;

  const canonicalPath = isSeoPathLocale(currentLocale)
    ? localePath(clean, currentLocale)
    : clean;

  return {
    canonical: absoluteUrl(canonicalPath === "/" ? "/" : canonicalPath),
    languages: languagesMap(clean),
  };
}

/** URL sitemap per IT + ogni locale SEO, con hreflang condiviso. */
export function sitemapEntriesForPath(
  barePath: string,
  priority: number,
  lastModified?: string | Date,
): {
  url: string;
  lastModified?: string | Date;
  priority: number;
  alternates: { languages: Record<string, string> };
}[] {
  const clean =
    !barePath || barePath === "/"
      ? "/"
      : barePath.startsWith("/")
        ? barePath
        : `/${barePath}`;
  const languages = languagesMap(clean);
  const base = { lastModified, priority, alternates: { languages } };
  return [
    { url: absoluteUrl(clean === "/" ? "/" : clean), ...base },
    ...SEO_PATH_LOCALES.map((loc) => {
      const p = localePath(clean, loc);
      return { url: absoluteUrl(p === "/" ? `/${loc}` : p), ...base };
    }),
  ];
}

export function resolvePublicLocale(
  pathLocale: string | null,
  queryLang: string | null,
  cookieLang: string | null,
): Locale {
  if (isSeoPathLocale(pathLocale)) return pathLocale;
  if (isLocale(queryLang)) return queryLang;
  if (isLocale(cookieLang)) return cookieLang;
  return DEFAULT_LOCALE;
}
