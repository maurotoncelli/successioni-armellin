import "server-only";
import type Stripe from "stripe";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getPackagesAdmin, getAddons } from "@/lib/cms";
import { buildOrder } from "@/lib/order";
import type { PackageKey, PackageRow, PracticeRow } from "@/lib/supabase/types";
import { parseAttribution } from "@/lib/attribution-shared";
import type { Package } from "@/content/site";
import {
  getPaymentPlanRaw,
  isBalanceDue,
  upsertPaymentPlan,
  clearUnpaidPaymentPlan,
} from "@/lib/practice-extras";
import {
  isCheckoutPlan,
  splitHonorarium,
  type CheckoutPlan,
} from "@/lib/payment-plan";

/*
  Logica condivisa di creazione della sessione di pagamento Stripe per UNA pratica.
  Usata sia dal checkout pubblico (POST /api/checkout) sia dal flusso assistito del
  CRM ("Genera link di pagamento"): un solo punto di verita per prezzo e snapshot.
  La CONFERMA del pagamento avviene solo via webhook (@SPEC_API_Contracts).
*/

export type CheckoutResult =
  | { ok: true; url: string; total: number }
  | { ok: false; error: string };

function stripeAttributionMeta(
  raw: PracticeRow["attribution"],
): Record<string, string> {
  const a = parseAttribution(raw);
  const meta: Record<string, string> = {};
  if (a.gclid) meta.gclid = a.gclid.slice(0, 200);
  if (a.gbraid) meta.gbraid = a.gbraid.slice(0, 200);
  if (a.utm_source) meta.utm_source = a.utm_source.slice(0, 100);
  if (a.utm_campaign) meta.utm_campaign = a.utm_campaign.slice(0, 100);
  if (a.ga_client_id) meta.ga_client_id = a.ga_client_id.slice(0, 80);
  return meta;
}

/*
  Coupon Stripe della promo: id = code (es. LANCIO20), percent_off, durata
  "once" (mode payment). Creato la prima volta e riusato; se esiste già con la
  stessa percentuale va bene, altrimenti (percentuale cambiata a parità di id,
  non dovrebbe succedere: il code include la percentuale) si crea un id nuovo.
  Se Stripe fallisce qui l'errore risale e il pagamento NON parte: meglio un
  errore che far pagare al cliente il listino pieno dopo aver visto lo sconto.
*/
async function ensurePromoCoupon(
  stripe: Stripe,
  code: string,
  percent: number,
  name: string,
): Promise<string> {
  try {
    const existing = await stripe.coupons.retrieve(code);
    if (existing.valid && existing.percent_off === percent) return existing.id;
    // Stesso id ma parametri diversi/coupon non più valido: id derivato.
    const altId = `${code}_P${percent}`;
    try {
      const alt = await stripe.coupons.retrieve(altId);
      if (alt.valid && alt.percent_off === percent) return alt.id;
    } catch {
      /* non esiste: lo creiamo sotto */
    }
    const created = await stripe.coupons.create({
      id: altId,
      percent_off: percent,
      duration: "once",
      name,
    });
    return created.id;
  } catch (err) {
    const code_ = (err as { code?: string }).code;
    const status = (err as { statusCode?: number }).statusCode;
    if (code_ !== "resource_missing" && status !== 404) throw err;
  }
  const created = await stripe.coupons.create({
    id: code,
    percent_off: percent,
    duration: "once",
    name,
  });
  return created.id;
}

export type CreateCheckoutOptions = {
  origin: string;
  addonKeys?: string[];
  /** Pacchetto forzato (es. dal checkout pubblico); altrimenti usa quello della pratica. */
  packageKey?: PackageKey;
  /** full = onorario intero; deposit = acconto 50%; balance = saldo 50%. */
  plan?: CheckoutPlan;
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
  const plan: CheckoutPlan = isCheckoutPlan(opts.plan) ? opts.plan : "full";
  const existingPlan = await getPaymentPlanRaw(practiceId);

  if (row.payment_status === "PAID" && !isBalanceDue(existingPlan)) {
    return { ok: false, error: "Questa pratica risulta gia pagata." };
  }
  if (row.payment_status === "PAID" && plan !== "balance") {
    return { ok: false, error: "Resta solo il saldo del 50%: usa il link saldo." };
  }
  if (plan === "balance" && !isBalanceDue(existingPlan)) {
    return { ok: false, error: "Nessun saldo 50% da incassare su questa pratica." };
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

  // Self-serve pubblico: Zero Stress fuori vetrina (quiz non lo propone più).
  if (opts.packageKey === "ZERO_STRESS") {
    return {
      ok: false,
      error:
        "Questo pacchetto non è più in vetrina: richiedi un preventivo su misura.",
    };
  }

  // Catalogo admin (include pacchetti disattivati) per pratiche storiche / CRM.
  const [adminRows, addons] = await Promise.all([
    getPackagesAdmin(),
    getAddons(),
  ]);
  const packagesForOrder: Package[] = adminRows.map((r: PackageRow) => ({
    key: r.key,
    name: r.name,
    tagline: r.tagline ?? "",
    description: r.description,
    features: Array.isArray(r.features) ? r.features : [],
    price: Number(r.price),
    extraPropertyFee:
      r.extra_property_fee === null ? null : Number(r.extra_property_fee),
    slaDays: r.sla_days === null ? null : Number(r.sla_days),
    badge: r.badge,
    sortOrder: r.sort_order,
  }));
  // Prezzo SEMPRE ricalcolato lato server dai dati della pratica (immobili ed
  // eredi oltre la capienza inclusa → sovrapprezzi), mai dal client.
  const order = buildOrder(
    {
      packageKey,
      addonKeys: opts.addonKeys,
      realEstateCount: row.real_estate_count,
      heirsCount: row.heirs_count,
    },
    packagesForOrder,
    addons,
  );
  if (!order || order.total <= 0) {
    return { ok: false, error: "Importo dell'ordine non valido." };
  }

  const split = existingPlan?.plan === "split50"
    ? { deposit: existingPlan.deposit, balance: existingPlan.balance }
    : splitHonorarium(order.total);
  const chargeAmount =
    plan === "deposit"
      ? split.deposit
      : plan === "balance"
        ? split.balance
        : order.total;
  if (chargeAmount < 0.5) {
    return { ok: false, error: "Importo dell'ordine non valido." };
  }

  // Snapshot prezzo/righe sulla pratica. PENDING solo se non è già pagato
  // l'acconto (il saldo non deve far tornare la pratica in attesa).
  const practicePatch: Partial<PracticeRow> = {
    selected_package: order.packageKey,
    price: order.total,
    line_items: order.lineItems,
  };
  if (row.payment_status !== "PAID") {
    practicePatch.payment_status = "PENDING";
  }
  const { error: updErr } = await admin
    .from("practices")
    .update(practicePatch)
    .eq("id", practiceId);
  if (updErr) return { ok: false, error: updErr.message };

  if (plan === "deposit") {
    await upsertPaymentPlan(practiceId, {
      plan: "split50",
      total: order.total,
      deposit: split.deposit,
      balance: split.balance,
    });
  } else if (plan === "full") {
    await clearUnpaidPaymentPlan(practiceId);
  }

  try {
    const stripe = getStripe();
    const pkgLabel =
      order.lineItems.find((li) => li.type === "PACKAGE")?.label ??
      "Onorario dichiarazione di successione";
    const splitLineName =
      plan === "deposit"
        ? `Acconto 50% — ${pkgLabel}`
        : `Saldo 50% — ${pkgLabel}`;
    const useSplitLine = plan === "deposit" || plan === "balance";

    // Promo a tempo: Stripe non accetta righe negative, quindi le righe
    // positive restano a listino e lo sconto va come coupon percent_off (lo
    // vede anche il cliente nella pagina Stripe: "Sconto lancio −20%").
    // Sull'acconto/saldo lo sconto è già nel totale spezzato: niente coupon.
    const discountLine = order.lineItems.find((li) => li.type === "DISCOUNT");
    const coupon =
      !useSplitLine && order.discount && discountLine
        ? await ensurePromoCoupon(stripe, order.discount.code, order.discount.percent, discountLine.label)
        : null;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "it",
      currency: "eur",
      client_reference_id: row.code,
      customer_email: row.client_email || undefined,
      line_items: useSplitLine
        ? [
            {
              quantity: 1,
              price_data: {
                currency: "eur",
                unit_amount: Math.round(chargeAmount * 100),
                product_data: { name: splitLineName },
              },
            },
          ]
        : order.lineItems
            .filter((item) => item.type !== "DISCOUNT")
            .map((item) => ({
              quantity: 1,
              price_data: {
                currency: "eur",
                unit_amount: Math.round(item.amount * 100),
                product_data: { name: item.label },
              },
            })),
      ...(coupon ? { discounts: [{ coupon }] } : {}),
      metadata: {
        practice_id: row.id,
        practice_code: row.code,
        installment: plan,
        ...(order.discount
          ? { promo_code: order.discount.code, promo_percent: String(order.discount.percent) }
          : {}),
        ...stripeAttributionMeta(row.attribution),
      },
      payment_intent_data: {
        metadata: {
          practice_id: row.id,
          practice_code: row.code,
          installment: plan,
          ...stripeAttributionMeta(row.attribution),
        },
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

    return { ok: true, url: session.url, total: chargeAmount };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore Stripe.";
    console.error("[payments] createCheckoutSession:", err);
    return { ok: false, error: message };
  }
}
