import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/payments";
import type { PackageKey } from "@/lib/supabase/types";

/*
  POST /api/checkout (@SPEC_API_Contracts)
  Crea la sessione di pagamento Stripe per UN ordine singolo legato a una pratica.
  La conferma del pagamento avviene via webhook, non qui.
*/

export const runtime = "nodejs";

const PACKAGE_KEYS: PackageKey[] = ["SEMPLICE", "COMPLETO", "ZERO_STRESS"];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "bad_request", message: "Corpo non valido." } },
      { status: 400 },
    );
  }

  const data = (body ?? {}) as {
    practiceId?: string;
    addonKeys?: string[];
    packageKey?: string;
  };

  if (!data.practiceId) {
    return NextResponse.json(
      { error: { code: "missing_practice", message: "practiceId mancante." } },
      { status: 400 },
    );
  }

  const packageKey =
    data.packageKey && PACKAGE_KEYS.includes(data.packageKey as PackageKey)
      ? (data.packageKey as PackageKey)
      : undefined;

  const origin = new URL(req.url).origin;

  const result = await createCheckoutSession(data.practiceId, {
    origin,
    addonKeys: Array.isArray(data.addonKeys) ? data.addonKeys : undefined,
    packageKey,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: { code: "checkout_failed", message: result.error } },
      { status: 400 },
    );
  }

  return NextResponse.json({ url: result.url });
}
