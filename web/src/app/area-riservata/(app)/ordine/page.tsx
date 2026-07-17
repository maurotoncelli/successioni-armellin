import Link from "next/link";
import { Check, Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { InvoiceDownload } from "@/components/area/invoice-download";
import { requireClientView } from "@/lib/area";
import { isPracticeCancelled } from "@/content/area-data";
import { getPackages } from "@/lib/cms";
import { getSafeExtras } from "@/lib/practice-extras";

const paymentLabels: Record<string, string> = {
  PAID: "Pagato",
  PENDING: "In attesa",
  PARTIALLY_REFUNDED: "Rimborsato in parte",
  REFUNDED: "Rimborsato",
  NONE: "—",
};

export default async function OrdinePage() {
  const view = await requireClientView();
  const p = view.practice;
  if (!p) {
    return (
      <div>
        <PageHeading title="Il tuo acquisto" subtitle="Riepilogo ordine." />
        <NoPracticeState defaultEmail={view.user.email ?? ""} />
      </div>
    );
  }

  const packages = await getPackages();
  const pkg = packages.find((x) => x.key === p.selectedPackage);
  const { invoice } = await getSafeExtras(p.id);
  const cancelled = isPracticeCancelled(p);

  return (
    <div>
      <PageHeading
        title="Il tuo acquisto"
        subtitle="Cosa hai acquistato e cosa include. Puoi consultarlo quando vuoi."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Riepilogo ordine */}
        <Card>
          <h2 className="text-sm font-semibold text-text">Riepilogo ordine</h2>
          <div className="mt-3 space-y-2 text-sm">
            {p.lineItems.map((item, i) => (
              <div key={i} className="flex justify-between text-text-muted">
                <span>{item.label}</span>
                <span className="text-text">{item.amount} €</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-primary/10 pt-2 font-semibold text-text">
              <span>Totale onorario</span>
              <span>{p.price} €</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-text-muted">
            Importi comprensivi di IVA/Cassa dove dovuti. Le imposte sono
            separate (vedi sotto).
          </p>

          <dl className="mt-4 space-y-2 border-t border-primary/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">Stato pagamento</dt>
              <dd className="font-medium text-success">
                {paymentLabels[p.paymentStatus]}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Metodo</dt>
              <dd className="font-medium text-text">
                {p.paymentMethod === "STRIPE"
                  ? "Carta (online)"
                  : p.paymentMethod === "BANK_TRANSFER"
                    ? "Bonifico"
                    : "—"}
              </dd>
            </div>
          </dl>

          {invoice?.hasFile ? (
            <InvoiceDownload number={invoice.number} />
          ) : invoice ? (
            <p className="mt-4 text-sm text-text-muted">
              Fattura n. {invoice.number} emessa. Il PDF sara disponibile a breve.
            </p>
          ) : (
            <p className="mt-4 text-sm text-text-muted">
              La fattura sara disponibile qui non appena emessa.
            </p>
          )}
        </Card>

        {/* Cosa include */}
        <Card>
          <h2 className="text-sm font-semibold text-text">
            Cosa include {pkg ? `"${pkg.name}"` : "il pacchetto"}
          </h2>
          {pkg ? (
            <ul className="mt-3 space-y-2">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-text">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-text-muted">
              Dettaglio non disponibile.
            </p>
          )}
        </Card>
      </div>

      {/* Imposte */}
      <Card className="mt-6">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Landmark className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-text">Imposte</h2>
            {p.stateTaxes ? (
              <>
                <p className="mt-1 text-2xl font-semibold text-text">
                  {p.stateTaxes} €
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  Queste somme <strong>non sono il nostro onorario</strong>: sono
                  imposte che si versano allo Stato (modello F24, autoliquidazione).
                  Te le calcoliamo e comunichiamo prima dell&apos;invio.
                </p>
                {!cancelled && (
                  <Link
                    href="/area-riservata/dati"
                    className="mt-2 inline-block text-sm font-medium text-accent-dark hover:underline"
                  >
                    Inserisci l&apos;IBAN per l&apos;addebito
                  </Link>
                )}
              </>
            ) : (
              <p className="mt-1 text-sm text-text-muted">
                Le imposte ti verranno calcolate e comunicate prima
                dell&apos;invio.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Recesso (non proposto su pratiche gia annullate/rimborsate) */}
      {!cancelled && (
        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted">
            Hai cambiato idea?{" "}
            <Link
              href="/area-riservata/recesso"
              className="font-medium text-accent-dark hover:underline"
            >
              Richiedi il recesso
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
