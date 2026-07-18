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
import { getRequestLocale, t, tObj } from "@/lib/locale";
import {
  CLAIM_UI_IT,
  INVOICE_UI_IT,
  ORDINE_UI_IT,
  fillTemplate,
  type ClaimUiLabels,
  type InvoiceUiLabels,
  type OrdineUiLabels,
} from "@/lib/area-ui-labels";

export default async function OrdinePage() {
  const view = await requireClientView();
  const [
    title,
    subtitle,
    summaryLabel,
    totalLabel,
    noIva,
    paymentStatusLabel,
    methodLabel,
    cardLabel,
    transferLabel,
    paidLabel,
    pendingLabel,
    partialLabel,
    refundedLabel,
    refundNote,
    emptyTitle,
    emptyBody,
    ordineUi,
    invoiceUi,
    claimUi,
  ] = await Promise.all([
    t("area", "ordine_title", "Il tuo acquisto"),
    t(
      "area",
      "ordine_subtitle",
      "Cosa hai acquistato e cosa include. Puoi consultarlo quando vuoi.",
    ),
    t("area", "ordine_summary", "Riepilogo ordine"),
    t("area", "ordine_total", "Totale onorario"),
    t(
      "area",
      "ordine_no_iva",
      "Onorario senza IVA (regime forfettario). Le imposte sono separate (vedi sotto).",
    ),
    t("area", "ordine_payment_status", "Stato pagamento"),
    t("area", "ordine_method", "Metodo"),
    t("area", "ordine_card", "Carta (online)"),
    t("area", "ordine_transfer", "Bonifico"),
    t("area", "ordine_paid", "Pagato"),
    t("area", "ordine_pending", "In attesa"),
    t("area", "ordine_partial", "Rimborsato in parte"),
    t("area", "ordine_refunded", "Rimborsato"),
    t(
      "area",
      "ordine_refund_note",
      "Rimborso emesso: di norma lo vedi sulla carta entro 5-10 giorni lavorativi (tempi della tua banca o dell'emittente della carta).",
    ),
    t("area", "empty_title", "Nessuna pratica collegata a questo accesso"),
    t(
      "area",
      "empty_body",
      "Se hai già pagato un preventivo, collega la pratica con l'email usata al checkout. Altrimenti calcola un preventivo dal sito.",
    ),
    tObj<OrdineUiLabels>("area", "ordine_ui", ORDINE_UI_IT),
    tObj<InvoiceUiLabels>("area", "invoice_ui", INVOICE_UI_IT),
    tObj<ClaimUiLabels>("area", "claim_ui", CLAIM_UI_IT),
  ]);

  const paymentLabels: Record<string, string> = {
    PAID: paidLabel,
    PENDING: pendingLabel,
    PARTIALLY_REFUNDED: partialLabel,
    REFUNDED: refundedLabel,
    NONE: "—",
  };

  const p = view.practice;
  if (!p) {
    return (
      <div>
        <PageHeading title={title} subtitle={subtitle} />
        <NoPracticeState
          defaultEmail={view.user.email ?? ""}
          title={emptyTitle}
          body={emptyBody}
          claimLabels={claimUi}
        />
      </div>
    );
  }

  const packages = await getPackages(await getRequestLocale());
  const pkg = packages.find((x) => x.key === p.selectedPackage);
  const { invoice, iban } = await getSafeExtras(p.id);
  const cancelled = isPracticeCancelled(p);
  const needsIban = Boolean(p.stateTaxes) && !iban && !cancelled;

  return (
    <div>
      <PageHeading title={title} subtitle={subtitle} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Riepilogo ordine */}
        <Card>
          <h2 className="text-sm font-semibold text-text">{summaryLabel}</h2>
          <div className="mt-3 space-y-2 text-sm">
            {p.lineItems.map((item, i) => (
              <div key={i} className="flex justify-between text-text-muted">
                <span>{item.label}</span>
                <span className="text-text">{item.amount} €</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-primary/10 pt-2 font-semibold text-text">
              <span>{totalLabel}</span>
              <span>{p.price} €</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-text-muted">{noIva}</p>

          <dl className="mt-4 space-y-2 border-t border-primary/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">{paymentStatusLabel}</dt>
              <dd className="font-medium text-success">
                {paymentLabels[p.paymentStatus]}
              </dd>
            </div>
            {(p.paymentStatus === "REFUNDED" ||
              p.paymentStatus === "PARTIALLY_REFUNDED") && (
              <p className="text-xs leading-relaxed text-text-muted">
                {refundNote}
              </p>
            )}
            <div className="flex justify-between">
              <dt className="text-text-muted">{methodLabel}</dt>
              <dd className="font-medium text-text">
                {p.paymentMethod === "STRIPE"
                  ? cardLabel
                  : p.paymentMethod === "BANK_TRANSFER"
                    ? transferLabel
                    : "—"}
              </dd>
            </div>
          </dl>

          {invoice?.hasFile ? (
            <InvoiceDownload number={invoice.number} labels={invoiceUi} />
          ) : invoice ? (
            <p className="mt-4 text-sm text-text-muted">
              {fillTemplate(invoiceUi.issued_soon, { number: invoice.number })}
            </p>
          ) : (
            <p className="mt-4 text-sm text-text-muted">{invoiceUi.pending}</p>
          )}
        </Card>

        {/* Cosa include */}
        <Card>
          <h2 className="text-sm font-semibold text-text">
            {pkg
              ? fillTemplate(ordineUi.includes_named, { name: pkg.name })
              : ordineUi.includes_generic}
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
              {ordineUi.includes_missing}
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
            <h2 className="text-sm font-semibold text-text">
              {ordineUi.taxes_title}
            </h2>
            {p.stateTaxes ? (
              <>
                <p className="mt-1 text-2xl font-semibold text-text">
                  {p.stateTaxes} €
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  {ordineUi.taxes_body}
                </p>
                {needsIban ? (
                  <div className="mt-3 rounded-[10px] border border-accent/30 bg-sand/60 p-3">
                    <p className="text-sm text-text">
                      {ordineUi.taxes_need_iban}
                    </p>
                    <Link
                      href="/area-riservata/dati"
                      className="mt-2 inline-flex text-sm font-semibold text-accent-dark hover:underline"
                    >
                      {ordineUi.taxes_iban_cta}
                    </Link>
                  </div>
                ) : iban && !cancelled ? (
                  <p className="mt-2 text-sm text-text-muted">
                    {fillTemplate(ordineUi.taxes_iban_saved, {
                      last4: iban.last4,
                    })}{" "}
                    <Link
                      href="/area-riservata/dati"
                      className="font-medium text-accent-dark hover:underline"
                    >
                      {ordineUi.taxes_iban_edit}
                    </Link>
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-1 text-sm text-text-muted">
                {ordineUi.taxes_pending}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Recesso (non proposto su pratiche gia annullate/rimborsate) */}
      {!cancelled && (
        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted">
            {ordineUi.withdrawal_prompt}{" "}
            <Link
              href="/area-riservata/recesso"
              className="font-medium text-accent-dark hover:underline"
            >
              {ordineUi.withdrawal_cta}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
