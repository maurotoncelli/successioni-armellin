export const COMMS_LOCALES = ["it", "ar", "en"] as const;
export type CommsLocale = (typeof COMMS_LOCALES)[number];

export function isCommsLocale(value: unknown): value is CommsLocale {
  return (
    typeof value === "string" &&
    (COMMS_LOCALES as readonly string[]).includes(value)
  );
}

export function coerceCommsLocale(value: unknown): CommsLocale {
  return isCommsLocale(value) ? value : "it";
}

export const COMMS_LOCALE_LABELS: Record<
  CommsLocale,
  { it: string; ar: string; en: string }
> = {
  it: { it: "Italiano", ar: "الإيطالية", en: "Italian" },
  ar: { it: "Arabo", ar: "العربية", en: "Arabic" },
  en: { it: "Inglese", ar: "الإنجليزية", en: "English" },
};
