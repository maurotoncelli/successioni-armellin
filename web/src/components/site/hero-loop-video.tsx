"use client";

import { useEffect, useRef } from "react";

/**
 * Backdrop hero: muted / autoplay / loop / playsInline.
 * Con prefers-reduced-motion resta sul poster (niente motion).
 */
export function HeroLoopVideo({
  src,
  poster,
  objectPosition = "center 36%",
  className,
}: {
  src: string;
  poster: string;
  /** object-position CSS: tiene il volto in frame su crop stretto */
  objectPosition?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (mq.matches) {
        el.pause();
        el.currentTime = 0;
      } else {
        void el.play().catch(() => {
          /* autoplay bloccato: resta il poster */
        });
      }
    };

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      style={{ objectPosition }}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden
      disablePictureInPicture
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
