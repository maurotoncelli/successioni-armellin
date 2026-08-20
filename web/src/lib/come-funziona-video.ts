import { existsSync } from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/content";
import {
  getWelcomeCaptionTracks,
  isWelcomeVideoReady,
  WELCOME_VIDEO_SRC,
} from "@/lib/welcome-video";

/** File definitivo (da girare). Finché manca, si usa il benvenuto come posto. */
export const COME_FUNZIONA_VIDEO_SRC = "/videos/come-funziona.mp4";
export const COME_FUNZIONA_VIDEO_POSTER = "/images/come-funziona-hero.jpg";

export function isComeFunzionaVideoReady(): boolean {
  return existsSync(
    path.join(process.cwd(), "public", "videos", "come-funziona.mp4"),
  );
}

/** Sorgente in pagina: master processo se c’è, altrimenti benvenuto (placeholder). */
export function getComeFunzionaVideoSrc(): string | null {
  if (isComeFunzionaVideoReady()) return COME_FUNZIONA_VIDEO_SRC;
  if (isWelcomeVideoReady()) return WELCOME_VIDEO_SRC;
  return null;
}

export function getComeFunzionaCaptionTracks(locale: Locale) {
  if (isComeFunzionaVideoReady()) return [];
  return isWelcomeVideoReady() ? getWelcomeCaptionTracks(locale) : [];
}
