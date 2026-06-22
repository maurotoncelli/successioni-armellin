// Helper GA4 lato client. No-op se gtag non e presente (ID non configurato o
// consenso negato): il sito funziona comunque. Consent Mode v2 gestito in
// components/analytics/google-analytics.tsx + consent-banner.tsx.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type ConsentChoice = "granted" | "denied";
export const CONSENT_KEY = "cookie-consent";

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params ?? {});
  }
}

export function updateConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: choice,
    analytics_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  });
}
