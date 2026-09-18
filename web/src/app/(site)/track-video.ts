"use server";

import { revalidatePath } from "next/cache";
import { isVideoId } from "@/lib/video-ids";
import { incrementVideoEvent } from "@/lib/video-stats";

const recentPlayEvents = new Map<string, number>();
const DEDUPE_MS = 30 * 60_000;

function prune(now: number) {
  for (const [k, t] of recentPlayEvents) {
    if (now - t > DEDUPE_MS) recentPlayEvents.delete(k);
  }
}

/*
  Conta un avvio / completamento video per le Statistiche CRM.
  playId = uuid per sessione di play (anti doppio fire da Strict Mode / retry).
*/
export async function trackVideoPlay(input: {
  video: string;
  event: "start" | "complete";
  playId: string;
}): Promise<{ ok: boolean }> {
  if (!isVideoId(input.video)) return { ok: false };
  if (input.event !== "start" && input.event !== "complete") return { ok: false };
  const playId = (input.playId || "").slice(0, 80);
  if (!playId) return { ok: false };

  const now = Date.now();
  prune(now);
  const key = `${playId}:${input.event}`;
  if (recentPlayEvents.has(key)) return { ok: true };
  recentPlayEvents.set(key, now);

  await incrementVideoEvent(input.video, input.event);
  revalidatePath("/crm/statistiche");
  return { ok: true };
}
