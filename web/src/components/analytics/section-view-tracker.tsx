"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Manda a GA4 un evento `section_view` la prima volta che ogni elemento con
 * `data-track-section="<nome>"` entra in viewport (almeno 40% visibile).
 * Serve a capire fino a dove arrivano gli utenti prima di uscire (rimbalzo).
 * No-op senza gtag (consenso negato o GA non configurato).
 */
export function SectionViewTracker({ page }: { page: string }) {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-track-section]"),
    );
    if (nodes.length === 0) return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const name = (entry.target as HTMLElement).dataset.trackSection;
          if (!name || seen.has(name)) continue;
          seen.add(name);
          trackEvent("section_view", { section: name, page });
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.4 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [page]);
  return null;
}
