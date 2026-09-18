export const VIDEO_IDS = ["benvenuto", "come_funziona"] as const;

export type VideoId = (typeof VIDEO_IDS)[number];

export const VIDEO_LABELS: Record<VideoId, string> = {
  benvenuto: "Video di benvenuto",
  come_funziona: "Come funziona",
};

export function isVideoId(value: string): value is VideoId {
  return (VIDEO_IDS as readonly string[]).includes(value);
}
