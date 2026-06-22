import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { notifyStatusChange } from "@/lib/notifications";
import { issueInvoiceForPractice, isInvoicingConfigured } from "@/lib/invoice";
import { slaDueDate } from "@/lib/cms";
import type { PracticeRow, PaymentStatusKey } from "@/lib/supabase/types";

/*
  POST /api/stripe/webhook (@SPEC_API_Contracts, @11)
  - verifica la firma Stripe (anti-spoofing);
  - idempotenza tramite la tabella `stripe_events` (un event id processato 1 volta);
  - su pagamento riuscito porta la pratica a PAGATO / PAID (payment_recorded_by=SYSTEM).
  La verita del pagamento e SEMPRE qui, mai sul redirect del browser.
*/

export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function nowStamp(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function POST(req: Request) {
  if (!isStripeConfigured || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook non configurato." },
      { status: 503 },
    );
  }
  if (!isAdminConfigured) {
    return NextResponse.json(
      { error: "Database non configurato." },
      { status: 503 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma mancante." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Firma non valida.";
    console.error("[stripe-webhook] firma:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const admin = getAdminClient();

  // Idempotenza: "rivendica" l'evento. Se gia presente -> gia processato.
  const { error: claimErr } = await admin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type });
  if (claimErr) {
    if (claimErr.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("[stripe-webhook] claim:", claimErr);
    return NextResponse.json({ error: claimErr.message }, { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(
          admin,
          event.id,
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      }
      case "charge.refunded": {
        await handleChargeRefunded(admin, event.data.object as Stripe.Charge);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    // Se il processing fallisce, libera l'evento cosi Stripe puo ritentarlo.
    await admin.from("stripe_events").delete().eq("id", event.id);
    console.error("[stripe-webhook] processing:", err);
    return NextResponse.json({ error: "Errore di elaborazione." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

type AdminClient = ReturnType<typeof getAdminClient>;

async function handleCheckoutCompleted(
  admin: AdminClient,
  eventId: string,
  session: Stripe.Checkout.Session,
) {
  if (session.payment_status !== "paid") return;
  const practiceId = session.metadata?.practice_id;
  if (!practiceId) return;

  const { data: practice } = await admin
    .from("practices")
    .select("*")
    .eq("id", practiceId)
    .maybeSingle();
  if (!practice) return;
  const row = practice as PracticeRow;
  if (row.payment_status === "PAID") return; // gia confermata

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  const stamp = nowStamp();
  const today = new Date().toISOString().slice(0, 10);

  const communications = asArray<Record<string, unknown>>(row.communications);
  communications.unshift({
    channel: "EMAIL",
    direction: "OUTBOUND",
    source: "AUTO",
    subject: "Pagamento ricevuto: la tua pratica e attiva",
    occurredAt: stamp,
  });

  const log = asArray<Record<string, unknown>>(row.log);
  log.unshift({ action: "pagamento_ricevuto", at: stamp });

  // Auto-calcolo consegna prevista da SLA pacchetto (se non gia impostata).
  let dueDate = row.due_date;
  if (!dueDate) {
    const due = await slaDueDate(row.selected_package, today);
    if (due) {
      dueDate = due;
      log.unshift({ action: "consegna_auto_sla", at: stamp });
    }
  }

  await admin
    .from("practices")
    .update({
      status: "PAGATO",
      action_owner: "CLIENT",
      payment_status: "PAID",
      payment_method: "STRIPE",
      payment_recorded_by: "SYSTEM",
      stripe_payment_intent_id: paymentIntentId,
      paid_at: new Date().toISOString(),
      opened_at: row.opened_at ?? today,
      due_date: dueDate,
      communications,
      log,
    })
    .eq("id", practiceId);

  await admin
    .from("stripe_events")
    .update({ practice_id: practiceId })
    .eq("id", eventId);

  // Notifica automatica al cliente: pagamento ricevuto + invito a caricare i
  // documenti (@05, transizione "Pagato" = auto via webhook). La comunicazione
  // e gia registrata sopra; qui parte l'email vera (no-op se Resend non attivo).
  if (row.client_email) {
    await notifyStatusChange(row.client_email, "PAGATO");
  }

  // Fatturazione automatica dell'onorario (Opzione L), solo se attivata via env.
  // Best-effort: un eventuale errore NON deve far fallire il webhook (Stripe
  // ritenterebbe il pagamento gia confermato). Lorenzo puo emetterla a mano.
  if (isInvoicingConfigured && process.env.INVOICE_AUTO_ON_PAYMENT === "1") {
    try {
      const res = await issueInvoiceForPractice(practiceId, { notifyClient: true });
      if (!res.ok) console.error("[stripe-webhook] fattura:", res.error);
    } catch (err) {
      console.error("[stripe-webhook] fattura (eccezione):", err);
    }
    revalidatePath("/area-riservata/ordine");
  }

  revalidatePath("/crm");
  revalidatePath("/crm/pratiche");
  revalidatePath("/crm/calendario");
  revalidatePath(`/crm/pratiche/${practiceId}`);
}

async function handleChargeRefunded(admin: AdminClient, charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : (charge.payment_intent?.id ?? null);
  if (!paymentIntentId) return;

  const { data: practice } = await admin
    .from("practices")
    .select("*")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();
  if (!practice) return;
  const row = practice as PracticeRow;

  const fullyRefunded = charge.amount_refunded >= charge.amount;
  const newStatus: PaymentStatusKey = fullyRefunded
    ? "REFUNDED"
    : "PARTIALLY_REFUNDED";

  const log = asArray<Record<string, unknown>>(row.log);
  log.unshift({
    action: fullyRefunded ? "rimborso_totale" : "rimborso_parziale",
    at: nowStamp(),
  });

  await admin
    .from("practices")
    .update({ payment_status: newStatus, log })
    .eq("id", row.id);

  revalidatePath(`/crm/pratiche/${row.id}`);
}
