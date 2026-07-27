"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Backdrop hero: muted / autoplay / loop / playsInline.
 * Desktop + opzionale clip mobile (source media).
 * Con prefers-reduced-motion resta sul poster (niente motion).
 */
export function HeroLoopVideo({
  src,
  poster,
  mobileSrc,
  mobilePoster,
  objectPosition = "center center",
  className,
}: {
  src: string;
  poster: string;
  /** Clip verticale per viewport stretti (<768px). */
  mobileSrc?: string;
  mobilePoster?: string;
  /** object-position CSS */
  objectPosition?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlay = () => {
      if (mqMotion.matches) {
        el.pause();
        el.currentTime = 0;
      } else {
        void el.play().catch(() => {
          /* autoplay bloccato: resta il poster */
        });
      }
    };

    // Alcuni browser non ri-valutano <source media> al resize: forziamo load.
    const mqViewport = window.matchMedia("(max-width: 767px)");
    const syncSource = () => {
      el.load();
      syncPlay();
    };

    syncPlay();
    mqMotion.addEventListener("change", syncPlay);
    mqViewport.addEventListener("change", syncSource);
    return () => {
      mqMotion.removeEventListener("change", syncPlay);
      mqViewport.removeEventListener("change", syncSource);
    };
  }, [src, mobileSrc]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Poster responsive sotto il video (il poster= nativo è uno solo). */}
      {mobilePoster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mobilePoster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover sm:hidden"
          style={{ objectPosition }}
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          mobilePoster ? "hidden sm:block" : "",
        )}
        style={{ objectPosition }}
      />
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={mobilePoster ?? poster}
        aria-hidden
        disablePictureInPicture
        tabIndex={-1}
      >
        {mobileSrc ? (
          <source
            src={mobileSrc}
            type="video/mp4"
            media="(max-width: 767px)"
          />
        ) : null}
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
