"use client";

import { useEffect } from "react";
import { trackEvent, trackAdsConversion } from "@/lib/analytics";

/*
  Tracker globale degli "intenti di contatto" (click su telefono, WhatsApp, email)
  ovunque nel sito, senza dover instrumentare ogni singolo link. GA4 NON traccia
  da solo i link tel:/mailto: (non sono "outbound"), quindi li intercettiamo qui.
  Rispetta il consenso: trackEvent passa da gtag, gated dal Consent Mode v2.
*/

export function ContactTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";

      let method: "phone" | "email" | "whatsapp" | null = null;
      if (href.startsWith("tel:")) method = "phone";
      else if (href.startsWith("mailto:")) method = "email";
      else if (href.includes("wa.me") || href.includes("whatsapp")) method = "whatsapp";
      if (!method) {
        // Link interni con data-cta (es. "Calcola il preventivo" nell'hero di
        // Come funziona): evento leggero per capire quale bottone converte.
        if (anchor.dataset.cta) {
          trackEvent("cta_click", {
            cta: anchor.dataset.cta,
            link_url: href,
            location: window.location.pathname,
          });
        }
        return;
      }

      // `cta` = quale bottone (data-cta sul link), per distinguere in GA4 il
      // WhatsApp del risultato preventivo dal WhatsApp generico del footer.
      const cta = anchor.dataset.cta || "generic";
      trackEvent("contact_click", {
        method,
        cta,
        link_url: href,
        location: window.location.pathname,
      });

      // Telefono e WhatsApp = intento di contatto forte -> conversione Ads.
      // L'email la lasciamo come semplice evento GA4 (segnale piu debole).
      if (method === "phone" || method === "whatsapp") {
        trackAdsConversion("contact");
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
