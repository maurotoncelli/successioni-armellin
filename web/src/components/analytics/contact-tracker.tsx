"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

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
      if (!method) return;

      trackEvent("contact_click", {
        method,
        link_url: href,
        location: window.location.pathname,
      });
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
