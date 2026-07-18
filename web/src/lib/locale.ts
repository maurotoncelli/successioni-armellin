import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import {
  coerceLocale,
  cta as ctaRaw,
  list as listRaw,
  obj as objRaw,
  text as textRaw,
  type Cta,
  type Locale,
} from "@/lib/content";

/*
  Locale della richiesta: header x-locale (da proxy su ?lang=) → cookie "lang"
  → italiano. Usare nelle Server Component del sito pubblico; CRM resta IT.
  Helper t/tCta/tList/tObj = stessi di content.ts ma con locale della richiesta.
*/

export const getRequestLocale = cache(async (): Promise<Locale> => {
  const headerLang = (await headers()).get("x-locale");
  const cookieLang = (await cookies()).get("lang")?.value;
  return coerceLocale(headerLang, cookieLang);
});

export function isRtl(locale: Locale): boolean {
  return locale === "ar";
}

export async function t(
  collection: string,
  key: string,
  fallback = "",
): Promise<string> {
  return textRaw(collection, key, fallback, await getRequestLocale());
}

export async function tCta(
  collection: string,
  key: string,
  fallback?: Cta,
): Promise<Cta> {
  return ctaRaw(collection, key, fallback, await getRequestLocale());
}

export async function tList<T = unknown>(
  collection: string,
  key: string,
): Promise<T[]> {
  return listRaw<T>(collection, key, await getRequestLocale());
}

export async function tObj<T extends object>(
  collection: string,
  key: string,
  fallback: T,
): Promise<T> {
  return objRaw<T>(collection, key, fallback, await getRequestLocale());
}

/** Titolo corto da voce menu navbar (già tradotta), con fallback. */
export async function navPageTitle(
  href: string,
  fallback: string,
): Promise<string> {
  const menu = await tList<{ label: string; href: string }>("navbar", "menu");
  return menu.find((m) => m.href === href)?.label ?? fallback;
}
