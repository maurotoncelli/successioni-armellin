/**
 * GA4 Measurement Protocol (server-side).
 * Usato dal webhook Stripe per l'evento `purchase` (resiliente ad ad-blocker).
 * No-op se mancano NEXT_PUBLIC_GA4_MEASUREMENT_ID o GA4_API_SECRET.
 */

const MP_URL = "https://www.google-analytics.com/mp/collect";

export function isGa4MeasurementProtocolConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() &&
      process.env.GA4_API_SECRET?.trim(),
  );
}

export async function sendGa4Purchase(params: {
  transactionId: string;
  value: number;
  currency?: string;
  /** Parametro custom (pacchetto scelto). */
  packageKey?: string;
}): Promise<void> {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
  const apiSecret = process.env.GA4_API_SECRET?.trim();
  if (!measurementId || !apiSecret) return;
  if (!params.transactionId) return;

  const body = {
    // Senza cookie browser: client_id sintetico. Il purchase server-side e la
    // fonte di verita sul valore; attribution resta su begin_checkout/page_view.
    client_id: crypto.randomUUID(),
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: params.transactionId,
          value: params.value,
          currency: (params.currency ?? "EUR").toUpperCase(),
          engagement_time_msec: 1,
          ...(params.packageKey ? { package: params.packageKey } : {}),
        },
      },
    ],
  };

  try {
    const url = `${MP_URL}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // Non bloccare il webhook su reti lente.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(
        "[ga4-mp] purchase HTTP",
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (err) {
    // Best-effort: non far fallire Stripe / la pratica.
    console.error("[ga4-mp] purchase:", err);
  }
}
