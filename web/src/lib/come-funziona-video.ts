import { existsSync } from "node:fs";
import path from "node:path";
import {
  getWelcomeCaptionTracks,
  isWelcomeVideoReady,
  WELCOME_VIDEO_SRC,
} from "@/lib/welcome-video";
import {
  LOCALES,
  LOCALE_FLAGS,
  LOCALE_LABELS,
  WELCOME_CAPTIONS_DIR,
  type Locale,
} from "@/lib/welcome-video-shared";

/** Master web 1080p. Finché manca, in pagina resta il benvenuto come posto. */
export const COME_FUNZIONA_VIDEO_SRC = "/videos/come-funziona.mp4";
/** Variante 720p per smartphone / tablet (stesso VO, meno bitrate). */
export const COME_FUNZIONA_VIDEO_SRC_MOBILE = "/videos/come-funziona-720.mp4";
export const COME_FUNZIONA_VIDEO_POSTER = "/images/come-funziona-hero.jpg";
export const COME_FUNZIONA_VIDEO_DURATION_ISO = "PT1M37S";

function publicFileExists(...segments: string[]): boolean {
  return existsSync(path.join(process.cwd(), "public", ...segments));
}

export function isComeFunzionaVideoReady(): boolean {
  return publicFileExists("videos", "come-funziona.mp4");
}

export function isComeFunzionaMobileVideoReady(): boolean {
  return publicFileExists("videos", "come-funziona-720.mp4");
}

/** Sorgente in pagina: master processo se c’è, altrimenti benvenuto (placeholder). */
export function getComeFunzionaVideoSrc(): string | null {
  if (isComeFunzionaVideoReady()) return COME_FUNZIONA_VIDEO_SRC;
  if (isWelcomeVideoReady()) return WELCOME_VIDEO_SRC;
  return null;
}

/** 720p solo quando c’è il master ufficiale (non sul placeholder benvenuto). */
export function getComeFunzionaVideoSrcMobile(): string | null {
  if (isComeFunzionaVideoReady() && isComeFunzionaMobileVideoReady()) {
    return COME_FUNZIONA_VIDEO_SRC_MOBILE;
  }
  return null;
}

function captionFileExists(locale: Locale): boolean {
  return publicFileExists("videos", "captions", `come-funziona.${locale}.vtt`);
}

/**
 * Track WebVTT: una per lingua disponibile.
 * `default` = lingua sito se esiste, altrimenti IT.
 */
export function getComeFunzionaCaptionTracks(locale: Locale) {
  if (isComeFunzionaVideoReady()) {
    const preferred = captionFileExists(locale) ? locale : "it";
    return LOCALES.filter(captionFileExists).map((loc) => ({
      src: `${WELCOME_CAPTIONS_DIR}/come-funziona.${loc}.vtt`,
      srclang: loc,
      label: LOCALE_LABELS[loc],
      flag: LOCALE_FLAGS[loc],
      isDefault: loc === preferred,
    }));
  }
  return isWelcomeVideoReady() ? getWelcomeCaptionTracks(locale) : [];
}
