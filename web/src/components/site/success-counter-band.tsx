"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/site/count-up";

/*
  Banda "numeri reali" della home: contatore animato delle successioni gestite
  + riga oro che si riempie in sincrono col numero. Sfondo sabbia, tipografia
  display navy, accenti oro: stessa grammatica di TrustBar/SectionHeading.
  Layout: mobile impilato e centrato; da sm numero+etichetta a inizio riga
  (start) e nota a fine riga (end) — proprietà logiche, quindi ok anche in RTL.
  La riga: SSR/no-JS piena; con JS e animazioni permesse parte vuota (prima
  del paint) e si riempie al via del contatore. Mutazione DOM via ref, non
  setState (regola lint react-hooks/set-state-in-effect).
*/
export function SuccessCounterBand({
  target,
  suffix,
  eyebrow,
  label,
  note,
}: {
  target: number;
  suffix: string;
  eyebrow: string;
  label: string;
  note: string;
}) {
  const fillRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    if (fillRef.current) fillRef.current.style.width = "0%";
  }, []);

  const onStart = useCallback(() => {
    if (fillRef.current) fillRef.current.style.width = "100%";
  }, []);

  return (
    <section
      aria-label={`${target}${suffix} ${label}`}
      className="relative overflow-hidden bg-sand"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -start-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />
      <Container className="relative py-8 sm:py-10 lg:py-12">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:text-start">
          <div className="min-w-0">
            {eyebrow && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
                {eyebrow}
              </p>
            )}
            <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 sm:justify-start">
              <CountUp
                target={target}
                suffix={suffix}
                onStart={onStart}
                className="font-display text-5xl leading-none text-primary sm:text-6xl lg:text-7xl"
              />
              <span className="text-lg font-semibold leading-tight text-primary sm:text-xl lg:text-2xl">
                {label}
              </span>
            </div>
          </div>
          {note && (
            <p className="max-w-md text-sm leading-relaxed text-text-muted sm:max-w-sm sm:text-base lg:max-w-md">
              {note}
            </p>
          )}
        </div>

        <div
          aria-hidden
          className="mt-6 h-1 w-full overflow-hidden rounded-full bg-primary/10 sm:mt-8"
        >
          <div
            ref={fillRef}
            className="h-full w-full rounded-full bg-accent motion-safe:transition-[width] motion-safe:duration-[1800ms] motion-safe:ease-out"
          />
        </div>
      </Container>
    </section>
  );
}
