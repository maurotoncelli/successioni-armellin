import { existsSync } from "node:fs";
import path from "node:path";
import { LOCALES, type Locale } from "@/lib/content";

/** Path pubblico del video di benvenuto (stesso asset home + /chi-sono). */
export const WELCOME_VIDEO_SRC = "/videos/benvenuto-lorenzo.mp4";
export const WELCOME_VIDEO_POSTER = "/images/lorenzo-video-poster.png";
export const WELCOME_VIDEO_DURATION_ISO = "PT44S";
export const WELCOME_CAPTIONS_DIR = "/videos/captions";

const LOCALE_LABELS: Record<Locale, string> = {
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

export type WelcomeCaptionTrack = {
  src: string;
  srclang: Locale;
  label: string;
  /** Track pre-selezionata (lingua sito, con fallback IT). */
  isDefault: boolean;
};

/** True se il file è in `public/videos/`. Senza file resta la facade con badge. */
export function isWelcomeVideoReady(): boolean {
  return existsSync(
    path.join(process.cwd(), "public", "videos", "benvenuto-lorenzo.mp4"),
  );
}

function captionFileExists(locale: Locale): boolean {
  return existsSync(
    path.join(
      process.cwd(),
      "public",
      "videos",
      "captions",
      `benvenuto.${locale}.vtt`,
    ),
  );
}

/**
 * Track WebVTT per il player: una per lingua disponibile.
 * `default` = lingua richiesta se esiste, altrimenti IT.
 */
export function getWelcomeCaptionTracks(
  locale: Locale,
): WelcomeCaptionTrack[] {
  const preferred = captionFileExists(locale) ? locale : "it";
  return LOCALES.filter(captionFileExists).map((loc) => ({
    src: `${WELCOME_CAPTIONS_DIR}/benvenuto.${loc}.vtt`,
    srclang: loc,
    label: LOCALE_LABELS[loc],
    isDefault: loc === preferred,
  }));
}
