"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { trackVideoPlay } from "@/app/(site)/track-video";

export function KittenPlayer({
  videoId,
  title,
  playLabel,
}: {
  videoId: string;
  title: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  function start() {
    setPlaying(true);
    const playId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${videoId}`;
    void trackVideoPlay({ video: "gatti", event: "start", playId });
  }

  return (
    <div className="aspect-video overflow-hidden rounded-[10px] bg-sand">
      {playing ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={start}
          className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 text-primary transition-colors hover:bg-sand/80"
          aria-label={`${playLabel}: ${title}`}
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-bg shadow-sm">
            <Play className="h-6 w-6 translate-x-0.5 fill-primary" />
          </span>
          <span className="text-sm font-medium">{playLabel}</span>
        </button>
      )}
    </div>
  );
}
