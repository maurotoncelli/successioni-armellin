import type { Metadata } from "next";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/content";

/*
  Locale SEO con prefisso path (Fase A: solo `ar`).
  IT resta sugli URL senza prefisso (nessun shock SEO). EN+ in Fase B.
*/

export const SEO_PATH_LOCALES = ["ar"] as const;
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

/** True se il path non deve mai avere prefisso /ar (area, CRM, API…). */
export function isSeoExemptPath(pathname: string): boolean {
  return NO_SEO_PREFIX_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/**
 * Estrae locale da prefisso path (`/ar/tariffe` → ar + `/tariffe`).
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

/** Path “nudo” (senza /ar) a partire dall’URL corrente. */
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

/**
 * alternates.canonical + languages (it, ar, x-default) per una pagina pubblica.
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

  const itPath = clean;
  const arPath = localePath(clean, "ar");
  const canonicalPath = isSeoPathLocale(currentLocale)
    ? localePath(clean, currentLocale)
    : itPath;

  return {
    canonical: absoluteUrl(canonicalPath === "/" ? "/" : canonicalPath),
    languages: {
      it: absoluteUrl(itPath === "/" ? "/" : itPath),
      ar: absoluteUrl(arPath === "/" ? "/ar" : arPath),
      "x-default": absoluteUrl(itPath === "/" ? "/" : itPath),
    },
  };
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
