import type { Metadata } from "next";
import { CheckCircle2, Clock } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { PurchaseEvent } from "@/components/analytics/purchase-event";
import { t, tObj } from "@/lib/locale";
import {
  CONFERMA_UI_IT,
  type ConfermaUiLabels,
} from "@/lib/site-ui-labels";

export async function generateMetadata(): Promise<Metadata> {
  const ui = await tObj<ConfermaUiLabels>(
    "site_ui",
    "conferma_ui",
    CONFERMA_UI_IT,
  );
  return {
    title: ui.meta_title,
    robots: { index: false },
  };
}

export const dynamic = "force-dynamic";

type PaymentInfo = { paid: boolean; amount?: number; currency?: string };

async function getPaymentInfo(sessionId?: string): Promise<PaymentInfo> {
  if (!sessionId || !isStripeConfigured) return { paid: false };
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return { paid: false };
    return {
      paid: true,
      amount: session.amount_total ? session.amount_total / 100 : undefined,
      currency: session.currency?.toUpperCase(),
    };
  } catch {
    return { paid: false };
  }
}

export default async function ConfermaPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const info = await getPaymentInfo(session_id);
  const paid = info.paid;
  const ui = await tObj<ConfermaUiLabels>(
    "site_ui",
    "conferma_ui",
    CONFERMA_UI_IT,
  );

  return (
    <Section tone="muted">
      {/* Fallback client solo se il purchase server-side (MP) non e attivo:
          altrimenti doppio conteggio con client_id diversi. */}
      {paid && session_id && !process.env.GA4_API_SECRET && (
        <PurchaseEvent
          transactionId={session_id}
          value={info.amount}
          currency={info.currency}
        />
      )}
      <div className="mx-auto max-w-2xl text-center">
        {paid ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        ) : (
          <Clock className="mx-auto h-12 w-12 text-accent" />
        )}
        <h1 className="mt-4 text-3xl sm:text-4xl">
          {paid ? ui.title_paid : ui.title_pending}
        </h1>

        <Card className="mt-8 text-start">
          <p className="leading-relaxed text-text-muted">
            {paid ? ui.body_paid : ui.body_pending}
          </p>
          {paid && (
            <p className="mt-3 rounded-[10px] border border-accent/25 bg-sand/40 px-3 py-2.5 text-sm text-text">
              {ui.email_note_before}{" "}
              <strong className="font-medium text-primary">
                {ui.email_note_strong}
              </strong>
              {ui.email_note_after}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/area-riservata" variant="primary">
              {ui.cta_area}
            </ButtonLink>
            <ButtonLink href="/" variant="outline">
              {ui.cta_home}
            </ButtonLink>
          </div>
        </Card>

        <p className="mt-6 text-sm text-text-muted">{ui.taxes_note}</p>
      </div>
    </Section>
  );
}
