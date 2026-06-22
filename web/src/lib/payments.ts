import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getPackages, getAddons } from "@/lib/cms";
import { buildOrder } from "@/lib/order";
import type { PackageKey, PracticeRow } from "@/lib/supabase/types";

/*
  Logica condivisa di creazione della sessione di pagamento Stripe per UNA pratica.
  Usata sia dal checkout pubblico (POST /api/checkout) sia dal flusso assistito del
  CRM ("Genera link di pagamento"): un solo punto di verita per prezzo e snapshot.
  La CONFERMA del pagamento avviene solo via webhook (@SPEC_API_Contracts).
*/

export type CheckoutResult =
  | { ok: true; url: string; total: number }
  | { ok: false; error: string };

export type CreateCheckoutOptions = {
  origin: string;
  addonKeys?: string[];
  /** Pacchetto forzato (es. dal checkout pubblico); altrimenti usa quello della pratica. */
  packageKey?: PackageKey;
};

export async function createCheckoutSession(
  practiceId: string,
  opts: CreateCheckoutOptions,
): Promise<CheckoutResult> {
  if (!isAdminConfigured) {
    return { ok: false, error: "Database non configurato." };
  }
  if (!isStripeConfigured) {
    return {
      ok: false,
      error:
        "Pagamenti non ancora attivi: imposta le chiavi Stripe in .env.local / Vercel.",
    };
  }

  const admin = getAdminClient();

  const { data: practice, error: loadErr } = await admin
    .from("practices")
    .select("*")
    .eq("id", practiceId)
    .maybeSingle();
  if (loadErr) return { ok: false, error: loadErr.message };
  if (!practice) return { ok: false, error: "Pratica non trovata." };

  const row = practice as PracticeRow;

  if (row.payment_status === "PAID") {
    return { ok: false, error: "Questa pratica risulta gia pagata." };
  }

  const packageKey =
    opts.packageKey ?? row.selected_package ?? row.suggested_package;
  if (!packageKey) {
    return {
      ok: false,
      error:
        "Nessun pacchetto associato alla pratica: serve un preventivo prima del pagamento.",
    };
  }

  const [packages, addons] = await Promise.all([getPackages(), getAddons()]);
  const order = buildOrder(
    { packageKey, addonKeys: opts.addonKeys, realEstateCount: row.real_estate_count },
    packages,
    addons,
  );
  if (!order || order.total <= 0) {
    return { ok: false, error: "Importo dell'ordine non valido." };
  }

  // Snapshot prezzo/righe sulla pratica + stato PENDING (in attesa del pagamento).
  const { error: updErr } = await admin
    .from("practices")
    .update({
      selected_package: order.packageKey,
      price: order.total,
      line_items: order.lineItems,
      payment_status: "PENDING",
    })
    .eq("id", practiceId);
  if (updErr) return { ok: false, error: updErr.message };

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "it",
      currency: "eur",
      client_reference_id: row.code,
      customer_email: row.client_email || undefined,
      line_items: order.lineItems.map((item) => ({
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(item.amount * 100),
          product_data: { name: item.label },
        },
      })),
      metadata: { practice_id: row.id, practice_code: row.code },
      payment_intent_data: {
        metadata: { practice_id: row.id, practice_code: row.code },
      },
      success_url: `${opts.origin}/checkout/conferma?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${opts.origin}/checkout?practice=${row.id}&annullato=1`,
    });

    if (!session.url) {
      return { ok: false, error: "Stripe non ha restituito un URL di pagamento." };
    }

    await admin
      .from("practices")
      .update({ stripe_session_id: session.id })
      .eq("id", practiceId);

    return { ok: true, url: session.url, total: order.total };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore Stripe.";
    console.error("[payments] createCheckoutSession:", err);
    return { ok: false, error: message };
  }
}
