import { existsSync } from "node:fs";
import path from "node:path";

/** Path pubblico del video di benvenuto (stesso asset home + /chi-sono). */
export const WELCOME_VIDEO_SRC = "/videos/benvenuto-lorenzo.mp4";
export const WELCOME_VIDEO_POSTER = "/images/lorenzo-video-poster.png";

/** True se il file è in `public/videos/`. Senza file resta la facade con badge. */
export function isWelcomeVideoReady(): boolean {
  return existsSync(
    path.join(process.cwd(), "public", "videos", "benvenuto-lorenzo.mp4"),
  );
}
