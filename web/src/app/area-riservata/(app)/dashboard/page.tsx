import Link from "next/link";
import { ArrowRight, Receipt, Landmark, Ban } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { PageHeading, StatusTracker } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { ReviewBanner } from "@/components/area/review-banner";
import { requireClientView } from "@/lib/area";
import { text } from "@/lib/content";
import {
  clientSteps,
  currentStepIndex,
  isPracticeCancelled,
  nextAction,
  toClientDocState,
} from "@/content/area-data";

export default async function DashboardPage() {
  const view = await requireClientView();
  const p = view.practice;
  if (!p) {
    return (
      <div>
        <PageHeading title="Area personale" subtitle="Benvenuto." />
        <NoPracticeState defaultEmail={view.user.email ?? ""} />
      </div>
    );
  }

  // Pratica annullata/rimborsata: vista "storico", niente azioni da fare.
  if (isPracticeCancelled(p)) {
    const refunded =
      p.paymentStatus === "REFUNDED" || p.paymentStatus === "PARTIALLY_REFUNDED";
    return (
      <div>
        <PageHeading
          title={`Ciao, ${p.clientName.split(" ")[0]}`}
          subtitle={`Pratica ${p.code} · defunto ${p.deceasedName}`}
        />
        <Card className="border-primary/15 bg-bg-muted">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Ban className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-medium text-text">
                Questa pratica è stata annullata.
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {refunded
                  ? "Il recesso è stato accettato e il rimborso è stato emesso: lo vedrai sulla carta usata per il pagamento entro pochi giorni lavorativi."
                  : "Il recesso è stato accettato. Se è previsto un rimborso, lo riceverai sulla carta usata per il pagamento."}{" "}
                Non c&apos;è nient&apos;altro da fare: qui sotto trovi il
                riepilogo del tuo acquisto, che resta consultabile.
              </p>
              <Link
                href="/area-riservata/ordine"
                className={buttonClasses({ variant: "outline", className: "mt-4" })}
              >
                <Receipt className="h-4 w-4" />
                Vedi il tuo acquisto
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const step = currentStepIndex(p.status);
  const action = nextAction(p);
  const reviewUrl = text("settings", "review_url");
  const concluded = p.status === "CHIUSA";

  const visibleDocs = p.checklist.filter(
    (d) => toClientDocState(d.status) !== null,
  );
  const uploaded = visibleDocs.filter(
    (d) => toClientDocState(d.status) === "CARICATO",
  ).length;

  return (
    <div>
      <PageHeading
        title={`Ciao, ${p.clientName.split(" ")[0]}`}
        subtitle={`Pratica ${p.code} · defunto ${p.deceasedName}`}
      />

      {concluded && reviewUrl && (
        <div className="mb-6">
          <ReviewBanner reviewUrl={reviewUrl} compact />
        </div>
      )}

      {/* Prossima azione */}
      <Card className="border-accent/30 bg-accent/5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-dark">
          Prossima azione
        </p>
        <p className="mt-1 text-lg font-medium text-text">{action.title}</p>
        <Link href={action.href} className={buttonClasses({ className: "mt-4" })}>
          {action.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>

      {/* Tracker stato */}
      <Card className="mt-6">
        <h2 className="mb-4 text-sm font-semibold text-text">
          A che punto è la tua pratica
        </h2>
        <StatusTracker steps={clientSteps} current={step} />
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Avanzamento documenti */}
        <Card>
          <h2 className="text-sm font-semibold text-text">Documenti</h2>
          <p className="mt-1 text-sm text-text-muted">
            {uploaded} di {visibleDocs.length} caricati
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-muted">
            <div
              className="h-full rounded-full bg-accent"
              style={{
                width: `${(uploaded / Math.max(visibleDocs.length, 1)) * 100}%`,
              }}
            />
          </div>
          <Link
            href="/area-riservata/documenti"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-dark hover:underline"
          >
            Vai ai documenti <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>

        {/* Riepilogo pratica */}
        <Card>
          <h2 className="text-sm font-semibold text-text">Riepilogo</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Pacchetto" value={p.selectedPackage ?? "—"} />
            <Row label="Eredi" value={String(p.heirsCount)} />
            <Row
              label="Immobili"
              value={p.hasRealEstate ? `Sì (${p.realEstateCount})` : "No"}
            />
          </dl>
          <Link
            href="/area-riservata/ordine"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-dark hover:underline"
          >
            <Receipt className="h-3.5 w-3.5" /> Vedi il tuo acquisto
          </Link>
        </Card>
      </div>

      {/* Imposte (solo se comunicate) */}
      {p.stateTaxes && (
        <Card className="mt-6">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Landmark className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-text">
                Imposte comunicate: {p.stateTaxes} €
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Sono separate dal nostro onorario e si versano allo Stato
                (modello F24).
              </p>
              <Link
                href="/area-riservata/ordine"
                className="mt-2 inline-block text-sm font-medium text-accent-dark hover:underline"
              >
                Vedi dettaglio
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-text-muted">{label}</dt>
      <dd className="font-medium text-text">{value}</dd>
    </div>
  );
}
