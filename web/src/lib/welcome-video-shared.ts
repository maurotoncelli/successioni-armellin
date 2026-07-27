import { LOCALES, type Locale } from "@/lib/content";

/** Path pubblico del video di benvenuto (stesso asset home + /chi-sono). */
export const WELCOME_VIDEO_SRC = "/videos/benvenuto-lorenzo.mp4";
export const WELCOME_VIDEO_POSTER = "/images/lorenzo-video-poster.jpg";
export const WELCOME_VIDEO_DURATION_ISO = "PT44S";
export const WELCOME_CAPTIONS_DIR = "/videos/captions";

export const LOCALE_LABELS: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  ar: "العربية",
  de: "Deutsch",
  es: "Español",
  ru: "Русский",
  tr: "Türkçe",
  zh: "中文",
  hi: "हिन्दी",
  sq: "Shqip",
  fr: "Français",
};

/** Bandiere emoji per il selettore sottotitoli (UI). */
export const LOCALE_FLAGS: Record<Locale, string> = {
  it: "🇮🇹",
  en: "🇬🇧",
  ar: "🇸🇦",
  de: "🇩🇪",
  es: "🇪🇸",
  ru: "🇷🇺",
  tr: "🇹🇷",
  zh: "🇨🇳",
  hi: "🇮🇳",
  sq: "🇦🇱",
  fr: "🇫🇷",
};

export function localeFlag(locale: string): string {
  return (LOCALE_FLAGS as Record<string, string>)[locale] ?? "🌐";
}

export type WelcomeCaptionTrack = {
  src: string;
  srclang: Locale;
  label: string;
  flag: string;
  /** Track pre-selezionata (lingua sito, con fallback IT). */
  isDefault: boolean;
};

export { LOCALES };
export type { Locale };
