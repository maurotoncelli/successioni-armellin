export const COMMS_LOCALES = ["it", "ar", "en", "tr", "fr", "sq"] as const;
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
  { it: string; ar: string; en: string; tr: string; fr: string; sq: string }
> = {
  it: {
    it: "Italiano",
    ar: "الإيطالية",
    en: "Italian",
    tr: "İtalyanca",
    fr: "Italien",
    sq: "Italisht",
  },
  ar: {
    it: "Arabo",
    ar: "العربية",
    en: "Arabic",
    tr: "Arapça",
    fr: "Arabe",
    sq: "Arabisht",
  },
  en: {
    it: "Inglese",
    ar: "الإنجليزية",
    en: "English",
    tr: "İngilizce",
    fr: "Anglais",
    sq: "Anglisht",
  },
  tr: {
    it: "Turco",
    ar: "التركية",
    en: "Turkish",
    tr: "Türkçe",
    fr: "Turc",
    sq: "Turqisht",
  },
  fr: {
    it: "Francese",
    ar: "الفرنسية",
    en: "French",
    tr: "Fransızca",
    fr: "Français",
    sq: "Frëngjisht",
  },
  sq: {
    it: "Albanese",
    ar: "الألبانية",
    en: "Albanian",
    tr: "Arnavutça",
    fr: "Albanais",
    sq: "Shqip",
  },
};
