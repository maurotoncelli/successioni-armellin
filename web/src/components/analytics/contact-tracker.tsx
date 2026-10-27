"use client";

import { useEffect } from "react";
import { trackEvent, trackAdsConversion } from "@/lib/analytics";
import { quoteCtaFromDataset } from "@/lib/quote";
import { trackQuoteCtaClick } from "@/app/(site)/preventivo/track-quote";

/*
  Tracker globale degli "intenti di contatto" (click su telefono, WhatsApp, email)
  ovunque nel sito, senza dover instrumentare ogni singolo link. GA4 NON traccia
  da solo i link tel:/mailto: (non sono "outbound"), quindi li intercettiamo qui.
  Rispetta il consenso: trackEvent passa da gtag, gated dal Consent Mode v2.
  Per i pulsanti chiave del risultato preventivo («Acquista il servizio» e
  «Chiedi le imposte su WhatsApp») aggiorna anche il contatore first-party del
  CRM (/crm/statistiche), così il dato resta completo anche senza cookie.
*/

const lastCtaPing = new Map<string, number>();
const CTA_COOLDOWN_MS = 3_000;

function pingQuoteCta(rawCta: string | undefined) {
  const cta = quoteCtaFromDataset(rawCta);
  if (!cta) return;
  const now = Date.now();
  const prev = lastCtaPing.get(cta) ?? 0;
  if (now - prev < CTA_COOLDOWN_MS) return;
  lastCtaPing.set(cta, now);

  const clickId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${now}-${Math.random().toString(16).slice(2)}`;
  const payload = JSON.stringify({ cta, clickId });

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon("/api/track-cta", blob)) return;
  }
  void trackQuoteCtaClick({ cta, clickId });
}

export function ContactTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a, button");
      if (!target) return;
      if (target instanceof HTMLButtonElement) {
        if (target.dataset.cta) {
          pingQuoteCta(target.dataset.cta);
          trackEvent("cta_click", {
            cta: target.dataset.cta,
            location: window.location.pathname,
          });
        }
        return;
      }
      const anchor = target as HTMLAnchorElement;
      const href = anchor.getAttribute("href") ?? "";

      pingQuoteCta(anchor.dataset.cta);

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
