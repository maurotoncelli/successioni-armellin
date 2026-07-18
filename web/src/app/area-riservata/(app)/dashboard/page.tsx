import Link from "next/link";
import { ArrowRight, Receipt, Landmark, Ban } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { PageHeading, StatusTracker } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { ReviewBanner } from "@/components/area/review-banner";
import { requireClientView } from "@/lib/area";
import { t, tList, tObj } from "@/lib/locale";
import { getSafeExtras } from "@/lib/practice-extras";
import {
  currentStepIndex,
  isPracticeCancelled,
  nextAction,
  toClientDocState,
} from "@/content/area-data";
import { CLAIM_UI_IT, type ClaimUiLabels } from "@/lib/area-ui-labels";

export default async function DashboardPage() {
  const view = await requireClientView();
  const p = view.practice;

  const [
    welcomeTitle,
    welcomeSub,
    emptyTitle,
    emptyBody,
    claimUi,
    helloTpl,
    practiceTpl,
    cancelledTitle,
    cancelledRefunded,
    cancelledPending,
    cancelledFooter,
    cancelledCta,
    nextLabel,
    trackerHeading,
    docsHeading,
    docsProgressTpl,
    docsCta,
    summaryHeading,
    summaryPackage,
    summaryCta,
    taxesLabel,
    steps,
    actionClosedTitle,
    actionClosedCta,
    actionDocsTitle,
    actionDocsCta,
    actionWorkingTitle,
    actionWorkingCta,
    actionIdleTitle,
    actionIdleCta,
    reviewTitle,
    reviewCta,
    reviewBody,
  ] = await Promise.all([
    t("area", "welcome_title", "Area personale"),
    t("area", "welcome_subtitle", "Benvenuto."),
    t("area", "empty_title"),
    t("area", "empty_body"),
    tObj<ClaimUiLabels>("area", "claim_ui", CLAIM_UI_IT),
    t("area", "hello", "Ciao, {name}"),
    t("area", "practice_deceased", "Pratica {code} · defunto {name}"),
    t("area", "cancelled_title"),
    t("area", "cancelled_refunded"),
    t("area", "cancelled_pending"),
    t("area", "cancelled_footer"),
    t("area", "cancelled_cta"),
    t("area", "next_action_label"),
    t("area", "tracker_heading"),
    t("area", "docs_heading"),
    t("area", "docs_progress"),
    t("area", "docs_cta"),
    t("area", "summary_heading"),
    t("area", "summary_package"),
    t("area", "summary_cta_ordine"),
    t("area", "summary_taxes"),
    tList<string>("area", "client_steps"),
    t("area", "action_closed_title"),
    t("area", "action_closed_cta"),
    t("area", "action_docs_title"),
    t("area", "action_docs_cta"),
    t("area", "action_working_title"),
    t("area", "action_working_cta"),
    t("area", "action_idle_title"),
    t("area", "action_idle_cta"),
    t("area", "review_title"),
    t("area", "review_cta"),
    t("area", "review_body"),
  ]);

  if (!p) {
    return (
      <div>
        <PageHeading title={welcomeTitle} subtitle={welcomeSub} />
        <NoPracticeState
          defaultEmail={view.user.email ?? ""}
          title={emptyTitle}
          body={emptyBody}
          claimLabels={claimUi}
        />
      </div>
    );
  }

  const hello = helloTpl.replace("{name}", p.clientName.split(" ")[0] ?? "");
  const practiceLine = practiceTpl
    .replace("{code}", p.code)
    .replace("{name}", p.deceasedName);

  if (isPracticeCancelled(p)) {
    const refunded =
      p.paymentStatus === "REFUNDED" || p.paymentStatus === "PARTIALLY_REFUNDED";
    return (
      <div>
        <PageHeading title={hello} subtitle={practiceLine} />
        <Card className="border-primary/15 bg-bg-muted">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Ban className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-medium text-text">{cancelledTitle}</h2>
              <p className="mt-1 text-sm text-text-muted">
                {refunded ? cancelledRefunded : cancelledPending}{" "}
                {cancelledFooter}
              </p>
              <Link
                href="/area-riservata/ordine"
                className={buttonClasses({
                  variant: "outline",
                  className: "mt-4",
                })}
              >
                <Receipt className="h-4 w-4" />
                {cancelledCta}
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const { iban } = await getSafeExtras(p.id);
  const step = currentStepIndex(p.status);
  const action = nextAction(p, {
    closed_title: actionClosedTitle,
    closed_cta: actionClosedCta,
    docs_title: actionDocsTitle,
    docs_cta: actionDocsCta,
    working_title: actionWorkingTitle,
    working_cta: actionWorkingCta,
    idle_title: actionIdleTitle,
    idle_cta: actionIdleCta,
  });
  const reviewUrl = await t("settings", "review_url");
  const concluded = p.status === "CHIUSA";

  const visibleDocs = p.checklist.filter(
    (d) => toClientDocState(d.status) !== null,
  );
  const uploaded = visibleDocs.filter(
    (d) => toClientDocState(d.status) === "CARICATO",
  ).length;

  // Content `area.client_steps` (IT+AR); fallback IT solo se il blob manca.
  const trackerSteps =
    steps.length >= 4
      ? steps
      : steps.length > 0
        ? steps
        : [
            "Documenti da caricare",
            "In lavorazione",
            "Inviata all'Agenzia",
            "Conclusa",
          ];

  return (
    <div>
      <PageHeading title={hello} subtitle={practiceLine} />

      {concluded && reviewUrl && (
        <div className="mb-6">
          <ReviewBanner
            reviewUrl={reviewUrl}
            compact
            labels={{ title: reviewTitle, cta: reviewCta, body: reviewBody }}
          />
        </div>
      )}

      <Card className="border-accent/30 bg-accent/5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-dark">
          {nextLabel}
        </p>
        <p className="mt-1 text-lg font-medium text-text">{action.title}</p>
        <Link href={action.href} className={buttonClasses({ className: "mt-4" })}>
          {action.cta}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </Card>

      <Card className="mt-6">
        <h2 className="mb-4 text-sm font-semibold text-text">{trackerHeading}</h2>
        <StatusTracker steps={[...trackerSteps]} current={step} />
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold text-text">{docsHeading}</h2>
          <p className="mt-1 text-sm text-text-muted">
            {docsProgressTpl
              .replace("{uploaded}", String(uploaded))
              .replace("{total}", String(visibleDocs.length))}
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
            {docsCta} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-text">{summaryHeading}</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label={summaryPackage} value={p.selectedPackage ?? "—"} />
          </dl>
          <Link
            href="/area-riservata/ordine"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-dark hover:underline"
          >
            <Receipt className="h-3.5 w-3.5" /> {summaryCta}
          </Link>
        </Card>
      </div>

      {p.stateTaxes && (
        <Card className="mt-6">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Landmark className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-text">
                {taxesLabel}: {p.stateTaxes} €
              </h2>
              {!iban ? (
                <Link
                  href="/area-riservata/dati"
                  className="mt-2 inline-flex text-sm font-semibold text-accent-dark hover:underline"
                >
                  {await t("area", "summary_iban_missing")}
                </Link>
              ) : (
                <Link
                  href="/area-riservata/ordine"
                  className="mt-2 inline-block text-sm font-medium text-accent-dark hover:underline"
                >
                  {summaryCta}
                </Link>
              )}
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
