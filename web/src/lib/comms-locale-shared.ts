export const COMMS_LOCALES = ["it", "ar"] as const;
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

export const COMMS_LOCALE_LABELS: Record<CommsLocale, { it: string; ar: string }> =
  {
    it: { it: "Italiano", ar: "الإيطالية" },
    ar: { it: "Arabo", ar: "العربية" },
  };
