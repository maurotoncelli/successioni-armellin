"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type WelcomeVideoLabels = {
  title: string;
  caption: string;
  alt: string;
  playLabel: string;
  /** Mostrato se il file video non c'è ancora. */
  badgeSoon: string;
  /** Chip quando il video è disponibile (es. "Circa 1 min"). */
  duration: string;
};

type Props = {
  labels: WelcomeVideoLabels;
  poster: string;
  /** Se assente, facade non avvia il player (solo poster + badge). */
  src?: string | null;
  className?: string;
  /** Titolo sopra il player (default true). */
  showTitle?: boolean;
};

export function WelcomeVideo({
  labels,
  poster,
  src,
  className,
  showTitle = true,
}: Props) {
  const ready = Boolean(src);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function start() {
    if (!ready) return;
    setPlaying(true);
    requestAnimationFrame(() => {
      void videoRef.current?.play().catch(() => {
        setPlaying(false);
      });
    });
  }

  return (
    <div className={cn("mx-auto w-full max-w-3xl", className)}>
      {showTitle && (
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="font-display text-2xl text-primary sm:text-3xl">
            {labels.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
            {labels.caption}
          </p>
        </div>
      )}

      <figure>
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 shadow-md">
          {playing && src ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              controls
              playsInline
              preload="metadata"
              poster={poster}
              src={src}
            />
          ) : (
            <button
              type="button"
              onClick={start}
              disabled={!ready}
              aria-label={labels.playLabel}
              className={cn(
                "group relative block h-full w-full",
                ready ? "cursor-pointer" : "cursor-default",
              )}
            >
              <Image
                src={poster}
                alt={labels.alt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority={false}
              />
              <span className="absolute inset-0 bg-primary/25 transition-colors group-hover:bg-primary/15 group-disabled:bg-primary/30" />
              <span className="absolute inset-0 grid place-items-center">
                <span
                  className={cn(
                    "grid h-16 w-16 place-items-center rounded-full bg-white/90 text-primary shadow-lg transition-transform sm:h-20 sm:w-20",
                    ready && "group-hover:scale-105",
                    !ready && "opacity-80",
                  )}
                >
                  <Play className="h-7 w-7 translate-x-0.5 fill-current sm:h-8 sm:w-8" />
                </span>
              </span>
              <span className="absolute bottom-3 end-3 rounded-full bg-primary/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                {ready ? labels.duration : labels.badgeSoon}
              </span>
            </button>
          )}
        </div>
        {!showTitle && (
          <figcaption className="mt-4 text-center text-sm text-text-muted">
            {labels.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
