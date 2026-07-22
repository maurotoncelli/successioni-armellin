import "server-only";
import { t } from "@/lib/locale";
import type { WelcomeVideoLabels } from "@/components/site/welcome-video";

export async function getWelcomeVideoLabels(): Promise<WelcomeVideoLabels> {
  return {
    title: await t("chi_siamo", "video_title", "Hai un minuto? Ascoltami"),
    caption: await t(
      "chi_siamo",
      "video_caption",
      "Ti spiego in prima persona come mi occupo della tua pratica.",
    ),
    alt: await t(
      "chi_siamo",
      "video_alt",
      "Video di benvenuto del Geom. Lorenzo Armellin",
    ),
    playLabel: await t(
      "chi_siamo",
      "video_play",
      "Riproduci il video di benvenuto",
    ),
    badgeSoon: await t("chi_siamo", "video_badge", "Video in arrivo"),
    duration: await t("chi_siamo", "video_duration", "Circa 1 min"),
  };
}
