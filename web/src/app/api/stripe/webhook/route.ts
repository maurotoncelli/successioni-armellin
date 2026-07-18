import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { notifyStatusChange } from "@/lib/notifications";
import { pushCrmNotification } from "@/lib/crm-notifications";
import { pushClientStatusNotification } from "@/lib/client-notifications";
import { getCommsLocaleForContact } from "@/lib/comms-locale";
import { paymentReceivedCommSubject } from "@/lib/comms-copy";
import { issueInvoiceForPractice, isInvoicingConfigured } from "@/lib/invoice";
import { slaDueDate } from "@/lib/cms";
import { generateChecklist } from "@/lib/checklist";
import { sendGa4Purchase } from "@/lib/analytics-server";
import { upsertContactByEmail } from "@/lib/contacts";
import { createAreaAccessLink } from "@/lib/area-access-link";
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

function eur(n: number): string {
  return `${n.toLocaleString("it-IT")} €`;
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

  // Backfill dei dati cliente da Stripe quando la pratica e nata "anonima"
  // (checkout diretto dal sito): cosi il CRM sa chi ha pagato e parte la mail.
  const customer = session.customer_details;
  const backfill: Record<string, string> = {};
  if (!row.client_email && customer?.email) backfill.client_email = customer.email;
  if (row.client_name.trim() === "" && customer?.name)
    backfill.client_name = customer.name;
  if (!row.client_phone && customer?.phone)
    backfill.client_phone = customer.phone;
  const clientEmail = row.client_email || customer?.email || "";

  // Aggancio all'anagrafica (contacts): le pratiche nate dal checkout diretto
  // non hanno contact_id, ma la RLS dell'area personale mostra al cliente solo
  // le pratiche con il SUO contact_id. Upsert per email (no duplicati).
  let contactId = row.contact_id;
  if (!contactId && clientEmail) {
    const fullName = (backfill.client_name ?? row.client_name ?? "").trim();
    const [first, ...rest] = fullName.split(/\s+/);
    contactId = await upsertContactByEmail({
      email: clientEmail,
      firstName: first || "Cliente",
      lastName: rest.join(" "),
      phone: backfill.client_phone ?? row.client_phone ?? null,
      source: "Checkout sito",
    });
    if (!contactId) {
      console.error("[stripe-webhook] upsert contatto fallito per", clientEmail);
    }
  }

  const commsLocale = await getCommsLocaleForContact(contactId);
  const communications = asArray<Record<string, unknown>>(row.communications);
  communications.unshift({
    channel: "EMAIL",
    direction: "OUTBOUND",
    source: "AUTO",
    subject: paymentReceivedCommSubject(commsLocale),
    occurredAt: stamp,
  });

  const log = asArray<Record<string, unknown>>(row.log);
  log.unshift({ action: "pagamento_ricevuto", at: stamp });
  if (!contactId) {
    log.unshift({ action: "contatto_non_agganciato", at: stamp });
  }

  // Auto-calcolo consegna prevista da SLA pacchetto (se non gia impostata).
  let dueDate = row.due_date;
  if (!dueDate) {
    const due = await slaDueDate(row.selected_package, today);
    if (due) {
      dueDate = due;
      log.unshift({ action: "consegna_auto_sla", at: stamp });
    }
  }

  // Checklist documenti auto-generata al pagamento (@06): senza, il cliente
  // pagante troverebbe l'area documenti vuota. Solo se non gia presente
  // (una checklist personalizzata da Lorenzo non va mai sovrascritta).
  const existingChecklist = asArray<unknown>(row.checklist);
  let checklist = row.checklist;
  if (existingChecklist.length === 0) {
    checklist = await generateChecklist({
      hasRealEstate: row.has_real_estate,
      realEstateCount: row.real_estate_count,
      hasWill: row.has_will,
      hasMinorHeirs: row.has_minor_heirs,
    });
    log.unshift({ action: "checklist_generata", at: stamp });
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
      contact_id: contactId,
      paid_at: new Date().toISOString(),
      opened_at: row.opened_at ?? today,
      due_date: dueDate,
      checklist,
      communications,
      log,
      ...backfill,
    })
    .eq("id", practiceId);

  await admin
    .from("stripe_events")
    .update({ practice_id: practiceId })
    .eq("id", eventId);

  await pushCrmNotification({
    kind: "pagamento",
    title: `Pagamento ricevuto: ${eur(Number(row.price))}`,
    body: `${(backfill.client_name ?? row.client_name) || clientEmail || "Cliente"} ha pagato con carta. La pratica è ora attiva.`,
    practiceId,
    practiceCode: row.code,
  });

  // Notifica automatica al cliente: pagamento ricevuto + invito a caricare i
  // documenti (@05, transizione "Pagato" = auto via webhook). La comunicazione
  // e gia registrata sopra; qui parte l'email vera (no-op se Resend non attivo).
  if (clientEmail) {
    // Magic link sulla stessa email Stripe: un click e entra nella pratica giusta.
    const accessLink = await createAreaAccessLink(clientEmail);
    await notifyStatusChange(clientEmail, "PAGATO", {
      ctaHref: accessLink ?? undefined,
      practiceCode: row.code,
      locale: commsLocale,
    });
  }
  await pushClientStatusNotification(practiceId, "PAGATO");

  // Purchase GA4 via Measurement Protocol (fonte di verita server-side).
  // Best-effort: non deve far fallire il webhook. transaction_id = session Stripe
  // (stesso id usato dal fallback client se GA4_API_SECRET non e configurato).
  const amountTotal =
    typeof session.amount_total === "number"
      ? session.amount_total / 100
      : Number(row.price) || 0;
  await sendGa4Purchase({
    transactionId: session.id,
    value: amountTotal,
    currency: session.currency ?? "EUR",
    packageKey: row.selected_package ?? undefined,
  });

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

  // Rimborso TOTALE = contratto sciolto: la pratica va in ANNULLATA (se non
  // gia chiusa/annullata) cosi l'area cliente passa in modalita' storico.
  const cancelPractice =
    fullyRefunded && row.status !== "CHIUSA" && row.status !== "ANNULLATA";
  if (cancelPractice) {
    log.unshift({ action: "cambio_stato:ANNULLATA", at: nowStamp() });
  }

  await admin
    .from("practices")
    .update({
      payment_status: newStatus,
      log,
      ...(cancelPractice ? { status: "ANNULLATA", action_owner: "NONE" } : {}),
    })
    .eq("id", row.id);

  await pushCrmNotification({
    kind: "rimborso",
    title: fullyRefunded
      ? `Rimborso totale di ${eur(charge.amount_refunded / 100)}`
      : `Rimborso parziale di ${eur(charge.amount_refunded / 100)}`,
    body: cancelPractice
      ? "Il rimborso totale ha annullato automaticamente la pratica."
      : "Rimborso registrato da Stripe.",
    practiceId: row.id,
    practiceCode: row.code,
  });

  revalidatePath(`/crm/pratiche/${row.id}`);
  revalidatePath("/crm/pratiche");
  revalidatePath("/crm");
}
