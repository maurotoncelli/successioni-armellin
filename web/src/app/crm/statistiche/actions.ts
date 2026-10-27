"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { isVideoId, type VideoId } from "@/lib/video-ids";
import { isQuoteCtaId, type QuoteCtaId } from "@/lib/quote";
import {
  adjustVideoStarts,
  getVideoStats,
  pickVideoForAdjust,
} from "@/lib/video-stats";
import { adjustQuoteCompleted, adjustQuoteCta } from "@/lib/quote-stats";

export type StatAdjustKind = "video" | "quote" | "quote_cta";

export type StatAdjustResult = {
  ok: boolean;
  error?: string;
  videoId?: VideoId;
  ctaId?: QuoteCtaId;
};

export async function adjustStat(input: {
  kind: StatAdjustKind;
  delta: 1 | -1;
  videoId?: VideoId;
  ctaId?: QuoteCtaId;
}): Promise<StatAdjustResult> {
  await requireAdmin();
  try {
    if (input.kind === "quote") {
      const next = await adjustQuoteCompleted(input.delta);
      if (!next) return { ok: false, error: "Salvataggio non riuscito, riprova." };
      revalidatePath("/crm/statistiche");
      return { ok: true };
    }

    if (input.kind === "quote_cta") {
      if (!input.ctaId || !isQuoteCtaId(input.ctaId)) {
        return { ok: false, error: "Contatore non valido." };
      }
      const next = await adjustQuoteCta(input.ctaId, input.delta);
      if (!next) return { ok: false, error: "Salvataggio non riuscito, riprova." };
      revalidatePath("/crm/statistiche");
      return { ok: true, ctaId: input.ctaId };
    }

    let video = input.videoId;
    if (!video) {
      const stats = await getVideoStats();
      video = pickVideoForAdjust(stats) ?? undefined;
    }
    if (!video || !isVideoId(video)) {
      return { ok: false, error: "Nessuna riproduzione da correggere." };
    }
    const next = await adjustVideoStarts(video, input.delta);
    if (!next) return { ok: false, error: "Salvataggio non riuscito, riprova." };
    revalidatePath("/crm/statistiche");
    return { ok: true, videoId: video };
  } catch (err) {
    console.error("[crm] adjustStat:", err);
    return { ok: false, error: "Salvataggio non riuscito, riprova." };
  }
}
