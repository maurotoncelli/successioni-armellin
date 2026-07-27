import { existsSync } from "node:fs";
import path from "node:path";
import {
  LOCALES,
  LOCALE_FLAGS,
  LOCALE_LABELS,
  WELCOME_CAPTIONS_DIR,
  type Locale,
  type WelcomeCaptionTrack,
} from "@/lib/welcome-video-shared";

export {
  WELCOME_VIDEO_SRC,
  WELCOME_VIDEO_POSTER,
  WELCOME_VIDEO_DURATION_ISO,
  WELCOME_CAPTIONS_DIR,
  LOCALE_FLAGS,
  localeFlag,
  type WelcomeCaptionTrack,
} from "@/lib/welcome-video-shared";

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
 * Solo server (usa fs).
 */
export function getWelcomeCaptionTracks(
  locale: Locale,
): WelcomeCaptionTrack[] {
  const preferred = captionFileExists(locale) ? locale : "it";
  return LOCALES.filter(captionFileExists).map((loc) => ({
    src: `${WELCOME_CAPTIONS_DIR}/benvenuto.${loc}.vtt`,
    srclang: loc,
    label: LOCALE_LABELS[loc],
    flag: LOCALE_FLAGS[loc],
    isDefault: loc === preferred,
  }));
}
