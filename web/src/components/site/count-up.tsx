"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/*
  Numero che "sale" da 0 al valore finale quando entra in viewport.
  Scelte anti-bug (stesse di scroll-reveal.tsx):
  - SSR e no-JS mostrano subito il valore finale: nessun rischio SEO/a11y.
  - `prefers-reduced-motion` o observer assente -> resta il valore finale.
  - Anima una volta sola; easing ease-out per "atterrare" con calma.
  - Aggiorna il DOM direttamente (textContent) invece di passare da setState:
    niente re-render a 60fps e niente setState negli effect (regola lint).
  - Il numero e' sempre in cifre occidentali e forzato LTR (anche in arabo),
    come gli importi altrove nel sito.
*/
function canAnimate() {
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    "IntersectionObserver" in window
  );
}

export function CountUp({
  target,
  suffix = "",
  duration = 1800,
  className,
  onStart,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
  onStart?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  // Prima del paint post-idratazione: se possiamo animare, partiamo da 0
  // (evita il "salto" visibile 250 -> 0 -> 250).
  useLayoutEffect(() => {
    if (canAnimate() && numRef.current) numRef.current.textContent = "0";
  }, []);

  useEffect(() => {
    const el = ref.current;
    const num = numRef.current;
    if (!el || !num || !canAnimate()) return;

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        onStart?.();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          num.textContent = String(Math.round(target * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration, onStart]);

  return (
    <span
      ref={ref}
      dir="ltr"
      className={className}
      aria-label={`${target}${suffix}`}
    >
      <span ref={numRef} aria-hidden className="tabular-nums">
        {target}
      </span>
      {suffix && (
        <span aria-hidden className="text-accent">
          {suffix}
        </span>
      )}
    </span>
  );
}
