"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
  Apparizione graduale delle sezioni allo scroll (fade-in + risalita).
  Scelte anti-bug:
  - Il CSS nasconde gli elementi SOLO quando <html> ha la classe
    `reveal-ready`, aggiunta qui a observer pronto: senza JS (o se
    l'observer manca) il contenuto resta visibile. Nessun rischio SEO.
  - `prefers-reduced-motion` disattiva tutto (qui e nel CSS).
  - Ogni elemento anima una volta sola (unobserve dopo il reveal).
  - Rieseguito a ogni cambio pagina (le sezioni si rimontano).
*/
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)"),
    );
    if (els.length === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      },
      // Parte quando il bordo alto della sezione supera ~l'8% dal fondo:
      // abbastanza presto da non sembrare "in ritardo" rispetto allo scroll.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    for (const el of els) io.observe(el);

    return () => {
      io.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, [pathname]);

  return null;
}
