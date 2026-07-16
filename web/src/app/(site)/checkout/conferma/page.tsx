import type { Metadata } from "next";
import { CheckCircle2, Clock } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { PurchaseEvent } from "@/components/analytics/purchase-event";

export const metadata: Metadata = {
  title: "Pagamento ricevuto",
  robots: { index: false },
};

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
          {paid ? "Pagamento ricevuto, grazie!" : "Stiamo confermando il pagamento"}
        </h1>

        <Card className="mt-8 text-left">
          <p className="leading-relaxed text-text-muted">
            {paid
              ? "Il tuo pagamento è andato a buon fine e la tua pratica è ora attiva. A breve riceverai un'email con il riepilogo e le istruzioni per accedere alla tua area personale, dove caricare i documenti."
              : "Abbiamo ricevuto l'ordine. La conferma definitiva del pagamento arriva dal nostro sistema in pochi istanti: riceverai un'email appena è tutto a posto. Puoi già accedere all'area personale."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/area-riservata" variant="primary">
              Vai all&apos;area personale
            </ButtonLink>
            <ButtonLink href="/" variant="outline">
              Torna alla home
            </ButtonLink>
          </div>
        </Card>

        <p className="mt-6 text-sm text-text-muted">
          Le imposte sono separate dall&apos;onorario: te le calcoliamo e
          comunichiamo prima dell&apos;invio.
        </p>
      </div>
    </Section>
  );
}
