import "server-only";
import { cookies } from "next/headers";
import { coerceLocale, text, type Locale } from "@/lib/content";

/** Locale dalle server actions / API (cookie `lang`). */
export async function getActionLocale(): Promise<Locale> {
  const cookieLang = (await cookies()).get("lang")?.value;
  return coerceLocale(cookieLang);
}

/** Testo localizzato per errori/messaggi delle actions. */
export async function actionText(
  collection: string,
  key: string,
  fallback: string,
): Promise<string> {
  return text(collection, key, fallback, await getActionLocale());
}
