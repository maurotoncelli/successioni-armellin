import "server-only";
import { t } from "@/lib/locale";
import type { WelcomeVideoLabels } from "@/components/site/welcome-video";
import { isComeFunzionaVideoReady } from "@/lib/come-funziona-video";

export async function getComeFunzionaVideoLabels(): Promise<WelcomeVideoLabels> {
  const ready = isComeFunzionaVideoReady();
  return {
    title: await t("come_funziona", "video_title", "Guarda come funziona"),
    caption: await t(
      "come_funziona",
      "video_caption",
      "Una ragazza fa la successione sul sito: dal preventivo ai documenti, da casa. Due minuti.",
    ),
    alt: await t(
      "come_funziona",
      "video_alt",
      "Video esplicativo: una ragazza completa la dichiarazione di successione sul sito",
    ),
    playLabel: await t(
      "come_funziona",
      "video_play",
      "Riproduci il video su come funziona",
    ),
    badgeSoon: await t("come_funziona", "video_badge", "Video in arrivo"),
    duration: ready
      ? await t("come_funziona", "video_duration", "Circa 2 min")
      : await t(
          "come_funziona",
          "video_duration_placeholder",
          "Anteprima — video definitivo in arrivo",
        ),
    captionsLabel: await t("come_funziona", "video_captions_label", "Sottotitoli"),
    captionsOff: await t("come_funziona", "video_captions_off", "Nessuno"),
  };
}
