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

function adsId(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() ?? "";
}

function adsLabel(kind: "lead" | "purchase" | "contact"): string {
  // Riferimenti statici a process.env: Next.js inlinea le NEXT_PUBLIC_* solo con
  // accesso diretto per nome (process.env[dinamico] NON verrebbe sostituito lato client).
  const label =
    kind === "purchase"
      ? process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL
      : kind === "contact"
        ? process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL
        : process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;
  return label?.trim() ?? "";
}

/** Conversione nativa Google Ads (oltre all'evento GA4). No-op se manca AW-/label. */
export function trackAdsConversion(
  kind: "lead" | "purchase" | "contact",
  params?: { value?: number; currency?: string; transaction_id?: string },
): void {
  const id = adsId();
  const label = adsLabel(kind);
  if (!id || !label || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", "conversion", {
    send_to: `${id}/${label}`,
    ...(params?.value != null ? { value: params.value } : {}),
    currency: params?.currency ?? "EUR",
    ...(params?.transaction_id ? { transaction_id: params.transaction_id } : {}),
  });
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
