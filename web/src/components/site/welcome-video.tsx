"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Captions, ChevronDown, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  localeFlag,
  type WelcomeCaptionTrack,
} from "@/lib/welcome-video-shared";

export type WelcomeVideoLabels = {
  title: string;
  caption: string;
  alt: string;
  playLabel: string;
  /** Mostrato se il file video non c'è ancora. */
  badgeSoon: string;
  /** Chip quando il video è disponibile (es. "Circa 1 min"). */
  duration: string;
  /** Label del selettore sottotitoli. */
  captionsLabel: string;
  /** Opzione per spegnere i sottotitoli. */
  captionsOff: string;
};

type Props = {
  labels: WelcomeVideoLabels;
  poster: string;
  /** Se assente, facade non avvia il player (solo poster + badge). */
  src?: string | null;
  /** WebVTT captions (default = lingua sito). */
  captions?: WelcomeCaptionTrack[];
  className?: string;
  /** Titolo sopra il player (default true). */
  showTitle?: boolean;
};

type CaptionChoice = string; // locale code or "off"

export function WelcomeVideo({
  labels,
  poster,
  src,
  captions = [],
  className,
  showTitle = true,
}: Props) {
  const ready = Boolean(src);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const defaultLang = useMemo(
    () =>
      captions.find((c) => c.isDefault)?.srclang ??
      captions[0]?.srclang ??
      "it",
    [captions],
  );
  const [captionLang, setCaptionLang] = useState<CaptionChoice>(defaultLang);

  useEffect(() => {
    setCaptionLang(defaultLang);
  }, [defaultLang]);

  function applyCaptionTracks(el: HTMLVideoElement, choice: CaptionChoice) {
    for (const track of Array.from(el.textTracks)) {
      if (choice === "off") {
        track.mode = "disabled";
        continue;
      }
      track.mode = track.language === choice ? "showing" : "disabled";
    }
  }

  useEffect(() => {
    const el = videoRef.current;
    if (!playing || !el) return;

    applyCaptionTracks(el, captionLang);

    const tryPlay = () => {
      void el.play().catch(() => {
        setPlaying(false);
      });
    };

    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      tryPlay();
    } else {
      el.addEventListener("loadeddata", tryPlay, { once: true });
      el.load();
      return () => el.removeEventListener("loadeddata", tryPlay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useEffect(() => {
    const el = videoRef.current;
    if (!playing || !el) return;
    applyCaptionTracks(el, captionLang);
  }, [playing, captionLang]);

  function start() {
    if (!ready) return;
    setPlaying(true);
  }

  const showCaptionPicker = ready && captions.length > 0;
  const currentFlag =
    captionLang === "off" ? null : localeFlag(captionLang);

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
              className="welcome-video-player absolute inset-0 h-full w-full object-cover"
              controls
              playsInline
              preload="auto"
              poster={poster}
              src={src}
            >
              {captions.map((track) => (
                <track
                  key={track.srclang}
                  kind="captions"
                  srcLang={track.srclang}
                  label={`${track.flag} ${track.label}`}
                  src={track.src}
                  default={track.isDefault}
                />
              ))}
            </video>
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

        {showCaptionPicker ? (
          <div className="mt-3 flex justify-center sm:justify-end">
            <label
              htmlFor="welcome-captions-lang"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/15 bg-bg px-3 py-1.5 text-sm text-primary shadow-sm transition-colors hover:border-accent/50 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30"
            >
              <Captions className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              {currentFlag ? (
                <span className="text-base leading-none" aria-hidden>
                  {currentFlag}
                </span>
              ) : null}
              <span className="font-medium">{labels.captionsLabel}</span>
              <select
                id="welcome-captions-lang"
                value={captionLang}
                onChange={(e) => setCaptionLang(e.target.value)}
                className="max-w-[10rem] cursor-pointer appearance-none border-0 bg-transparent py-0 pe-5 text-sm text-primary outline-none"
                aria-label={labels.captionsLabel}
              >
                <option value="off">{labels.captionsOff}</option>
                {captions.map((track) => (
                  <option key={track.srclang} value={track.srclang}>
                    {track.flag} {track.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none -ms-4 h-3.5 w-3.5 text-text-muted"
                aria-hidden
              />
            </label>
          </div>
        ) : null}

        {!showTitle && (
          <figcaption className="mt-4 text-center text-sm text-text-muted">
            {labels.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
