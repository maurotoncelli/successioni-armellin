import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { DOC_BUCKET, ensureDocBucket } from "@/lib/documents";
import {
  VIDEO_IDS,
  VIDEO_IDS_IN_TOTAL,
  isVideoId,
  type VideoId,
} from "@/lib/video-ids";

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
  lastStartVideo: VideoId | null;
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
  lastStartVideo: null,
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
  const last =
    typeof o.lastStartVideo === "string" && isVideoId(o.lastStartVideo)
      ? o.lastStartVideo
      : null;
  return {
    totalStarts: Math.max(0, Number(o.totalStarts) || 0),
    totalCompletes: Math.max(0, Number(o.totalCompletes) || 0),
    byVideo,
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : null,
    lastStartVideo: last,
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

async function persist(next: VideoStats): Promise<VideoStats> {
  const admin = getAdminClient();
  await ensureDocBucket(admin);
  const blob = Buffer.from(JSON.stringify(next), "utf8");
  const { error } = await admin.storage.from(DOC_BUCKET).upload(STORAGE_PATH, blob, {
    contentType: "application/json",
    upsert: true,
  });
  if (error) throw error;
  return next;
}

function totalsFrom(byVideo: Record<VideoId, VideoClipStats>): {
  totalStarts: number;
  totalCompletes: number;
} {
  let totalStarts = 0;
  let totalCompletes = 0;
  for (const id of VIDEO_IDS_IN_TOTAL) {
    totalStarts += byVideo[id].starts;
    totalCompletes += byVideo[id].completes;
  }
  return { totalStarts, totalCompletes };
}

export async function incrementVideoEvent(
  video: VideoId,
  event: "start" | "complete",
): Promise<VideoStats | null> {
  if (!isAdminConfigured) return null;
  try {
    const current = await getVideoStats();
    const clipNext = { ...current.byVideo[video] };
    if (event === "start") clipNext.starts += 1;
    else clipNext.completes += 1;
    const byVideo = { ...current.byVideo, [video]: clipNext };
    const next: VideoStats = {
      ...totalsFrom(byVideo),
      byVideo,
      updatedAt: new Date().toISOString(),
      lastStartVideo: event === "start" ? video : current.lastStartVideo,
    };
    return await persist(next);
  } catch (err) {
    console.error("[video-stats] increment:", err);
    return null;
  }
}

/** Toglie o rimette un avvio (CRM: tasto − / Annulla). Completati non superano gli avvii. */
export async function adjustVideoStarts(
  video: VideoId,
  delta: 1 | -1,
): Promise<VideoStats | null> {
  if (!isAdminConfigured) return null;
  try {
    const current = await getVideoStats();
    const clipNext = { ...current.byVideo[video] };
    if (delta < 0) {
      if (clipNext.starts <= 0) return current;
      clipNext.starts -= 1;
      if (clipNext.completes > clipNext.starts) clipNext.completes -= 1;
    } else {
      clipNext.starts += 1;
    }
    const byVideo = { ...current.byVideo, [video]: clipNext };
    const next: VideoStats = {
      ...totalsFrom(byVideo),
      byVideo,
      updatedAt: new Date().toISOString(),
      lastStartVideo: delta > 0 ? video : current.lastStartVideo,
    };
    return await persist(next);
  } catch (err) {
    console.error("[video-stats] adjust:", err);
    return null;
  }
}

export function pickVideoForAdjust(stats: VideoStats): VideoId | null {
  if (
    stats.lastStartVideo &&
    (VIDEO_IDS_IN_TOTAL as readonly string[]).includes(stats.lastStartVideo) &&
    stats.byVideo[stats.lastStartVideo].starts > 0
  ) {
    return stats.lastStartVideo;
  }
  let best: VideoId | null = null;
  let max = 0;
  for (const id of VIDEO_IDS_IN_TOTAL) {
    if (stats.byVideo[id].starts > max) {
      max = stats.byVideo[id].starts;
      best = id;
    }
  }
  return best;
}
