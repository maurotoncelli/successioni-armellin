export const VIDEO_IDS = ["benvenuto", "come_funziona", "gatti"] as const;

export type VideoId = (typeof VIDEO_IDS)[number];

/** Avvii che entrano nel totale in alto. I gattini restano una riga a parte. */
export const VIDEO_IDS_IN_TOTAL: readonly VideoId[] = [
  "benvenuto",
  "come_funziona",
];

export const VIDEO_LABELS: Record<VideoId, string> = {
  benvenuto: "Video di benvenuto",
  come_funziona: "Come funziona",
  gatti: "Video di gattini",
};

export function isVideoId(value: string): value is VideoId {
  return (VIDEO_IDS as readonly string[]).includes(value);
}
