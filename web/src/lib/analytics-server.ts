/**
 * GA4 Measurement Protocol (server-side).
 * Usato dal webhook Stripe per l'evento `purchase` (resiliente ad ad-blocker).
 * No-op se mancano NEXT_PUBLIC_GA4_MEASUREMENT_ID o GA4_API_SECRET.
 */

import { createHash } from "node:crypto";

const MP_URL = "https://www.google-analytics.com/mp/collect";

export function isGa4MeasurementProtocolConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() &&
      process.env.GA4_API_SECRET?.trim(),
  );
}

function sha256Hex(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function digitsPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

export async function sendGa4Purchase(params: {
  transactionId: string;
  value: number;
  currency?: string;
  packageKey?: string;
  /** Stesso client_id del cookie _ga: serve ad attribuire il click Ads. */
  clientId?: string;
  email?: string;
  phone?: string;
}): Promise<void> {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
  const apiSecret = process.env.GA4_API_SECRET?.trim();
  if (!measurementId || !apiSecret) return;
  if (!params.transactionId) return;

  const userData: Record<string, string> = {};
  if (params.email?.includes("@")) {
    userData.sha256_email_address = sha256Hex(params.email);
  }
  const phone = params.phone ? digitsPhone(params.phone) : "";
  if (phone) userData.sha256_phone_number = sha256Hex(phone);

  const body = {
    client_id: params.clientId?.trim() || crypto.randomUUID(),
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
    ...(Object.keys(userData).length > 0 ? { user_data: userData } : {}),
  };

  try {
    const url = `${MP_URL}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
    console.error("[ga4-mp] purchase:", err);
  }
}
