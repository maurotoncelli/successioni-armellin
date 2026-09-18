import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { DOC_BUCKET, ensureDocBucket } from "@/lib/documents";
import { VIDEO_IDS, type VideoId } from "@/lib/video-ids";

/*
  Contatore riproduzioni video (tasto play, non il loop muted in hero).
  NO-DDL: JSON in Storage `practice-docs/site/_video-stats.json`.
  Complementare a GA4: qui il totale resta nel CRM anche senza consenso cookie.
*/

const STORAGE_PATH = "site/_video-stats.json";

export type VideoClipStats = {
  starts: number;
  completes: number;
};

export type VideoStats = {
  totalStarts: number;
  totalCompletes: number;
  byVideo: Record<VideoId, VideoClipStats>;
  updatedAt: string | null;
};

function emptyByVideo(): Record<VideoId, VideoClipStats> {
  return Object.fromEntries(
    VIDEO_IDS.map((id) => [id, { starts: 0, completes: 0 }]),
  ) as Record<VideoId, VideoClipStats>;
}

const EMPTY: VideoStats = {
  totalStarts: 0,
  totalCompletes: 0,
  byVideo: emptyByVideo(),
  updatedAt: null,
};

function clip(raw: unknown): VideoClipStats {
  const o = raw && typeof raw === "object" ? (raw as Partial<VideoClipStats>) : {};
  return {
    starts: Math.max(0, Number(o.starts) || 0),
    completes: Math.max(0, Number(o.completes) || 0),
  };
}

function normalize(raw: unknown): VideoStats {
  if (!raw || typeof raw !== "object") {
    return { ...EMPTY, byVideo: emptyByVideo() };
  }
  const o = raw as Partial<VideoStats> & {
    byVideo?: Partial<Record<VideoId, unknown>>;
  };
  const byVideo = emptyByVideo();
  for (const id of VIDEO_IDS) {
    byVideo[id] = clip(o.byVideo?.[id]);
  }
  return {
    totalStarts: Math.max(0, Number(o.totalStarts) || 0),
    totalCompletes: Math.max(0, Number(o.totalCompletes) || 0),
    byVideo,
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : null,
  };
}

export async function getVideoStats(): Promise<VideoStats> {
  if (!isAdminConfigured) return { ...EMPTY, byVideo: emptyByVideo() };
  try {
    const { data, error } = await getAdminClient()
      .storage.from(DOC_BUCKET)
      .download(STORAGE_PATH);
    if (error || !data) return { ...EMPTY, byVideo: emptyByVideo() };
    return normalize(JSON.parse(await data.text()));
  } catch (err) {
    console.error("[video-stats] read:", err);
    return { ...EMPTY, byVideo: emptyByVideo() };
  }
}

export async function incrementVideoEvent(
  video: VideoId,
  event: "start" | "complete",
): Promise<VideoStats | null> {
  if (!isAdminConfigured) return null;
  try {
    const admin = getAdminClient();
    await ensureDocBucket(admin);
    const current = await getVideoStats();
    const clipNext = { ...current.byVideo[video] };
    if (event === "start") clipNext.starts += 1;
    else clipNext.completes += 1;
    const next: VideoStats = {
      totalStarts: current.totalStarts + (event === "start" ? 1 : 0),
      totalCompletes: current.totalCompletes + (event === "complete" ? 1 : 0),
      byVideo: { ...current.byVideo, [video]: clipNext },
      updatedAt: new Date().toISOString(),
    };
    const blob = Buffer.from(JSON.stringify(next), "utf8");
    const { error } = await admin.storage.from(DOC_BUCKET).upload(STORAGE_PATH, blob, {
      contentType: "application/json",
      upsert: true,
    });
    if (error) throw error;
    return next;
  } catch (err) {
    console.error("[video-stats] increment:", err);
    return null;
  }
}
