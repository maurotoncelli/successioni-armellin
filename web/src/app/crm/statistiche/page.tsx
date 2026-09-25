import {
  Briefcase,
  CircleDollarSign,
  TrendingUp,
  Receipt,
  ExternalLink,
  ClipboardList,
  Play,
} from "lucide-react";
import { statusLabels, type PackageType, type Practice } from "@/content/crm-data";
import { getPractices, deriveKpi, statusCounts } from "@/lib/crm";
import { getPackages } from "@/lib/cms";
import {
  getQuoteStats,
  romeDayKey,
  sumQuoteDays,
  type QuoteStats,
} from "@/lib/quote-stats";
import { getVideoStats } from "@/lib/video-stats";
import { VIDEO_IDS, VIDEO_LABELS } from "@/lib/video-ids";
import { FLAT_OFFER, hasFlatOfferLine, isFlatOfferOn } from "@/lib/flat-offer";
import { CrmCard, SectionTitle } from "@/components/crm/ui";
import { StatsAdjust } from "@/components/crm/stats-adjust";

export const dynamic = "force-dynamic";

const GA4_URL = "https://analytics.google.com/analytics/web/";
const DAY_MS = 86_400_000;
const FLAT_BEFORE_DAYS = 14;

type PackageKey = Exclude<PackageType, null>;

type FlatWindow = {
  days: number;
  /** null = contatore giornaliero non ancora attivo in quel periodo. */
  quizzes: number | null;
  requests: number;
  paid: number;
  paidFlat: number;
  revenue: number;
};

/* Test prezzo unico: stesso conteggio sul periodo del test e sui 14 giorni prima. */
function flatTestWindows(practices: Practice[], stats: QuoteStats) {
  const start = new Date(`${FLAT_OFFER.startsAt}T00:00:00+02:00`);
  const end = new Date(`${FLAT_OFFER.endsAt}T23:59:59+02:00`);
  const now = new Date();
  const testTo = now < end ? now : end;
  const firstTrackedDay = Object.keys(stats.byDay).sort()[0] ?? romeDayKey(now);

  const measure = (from: Date, to: Date): FlatWindow => {
    const inRange = (iso?: string | null) => {
      if (!iso) return false;
      const t = new Date(iso).getTime();
      return t >= from.getTime() && t <= to.getTime();
    };
    const paid = practices.filter((p) => p.paymentStatus === "PAID" && inRange(p.paidAt));
    const fromDay = romeDayKey(from);
    return {
      days: Math.max(1, Math.ceil((to.getTime() - from.getTime()) / DAY_MS)),
      quizzes:
        firstTrackedDay <= fromDay ? sumQuoteDays(stats, fromDay, romeDayKey(to)) : null,
      requests: practices.filter((p) => inRange(p.createdAtIso)).length,
      paid: paid.length,
      paidFlat: paid.filter((p) => hasFlatOfferLine(p.lineItems)).length,
      revenue: paid.reduce((s, p) => s + p.price, 0),
    };
  };

  const test = measure(start, testTo);
  // Il contatore giornaliero nasce col test: conta dal primo giorno registrato.
  if (test.quizzes === null && firstTrackedDay <= romeDayKey(testTo)) {
    test.quizzes = sumQuoteDays(stats, firstTrackedDay, romeDayKey(testTo));
  }
  return {
    before: measure(new Date(start.getTime() - FLAT_BEFORE_DAYS * DAY_MS), new Date(start.getTime() - 1)),
    test,
    started: now >= start,
    ended: now > end,
  };
}

export default async function StatistichePage() {
  const [practices, packages, quoteStats, videoStats] = await Promise.all([
    getPractices(),
    getPackages(),
    getQuoteStats(),
    getVideoStats(),
  ]);
  const kpi = deriveKpi(practices);
  const leadsFromSite = practices.filter((p) => p.status === "LEAD").length;
  const byStatus = statusCounts(practices);
  const maxCount = Math.max(...byStatus.map((s) => s.count), 1);

  const nameByKey = new Map(packages.map((p) => [p.key, p.name]));
  const paid = practices.filter((p) => p.paymentStatus === "PAID");
  const byPackage: {
    key: PackageKey;
    name: string;
    count: number;
    total: number;
  }[] = packages.map((pkg) => ({
    key: pkg.key,
    name: pkg.name,
    count: paid.filter((p) => p.selectedPackage === pkg.key).length,
    total: paid
      .filter((p) => p.selectedPackage === pkg.key)
      .reduce((s, p) => s + p.price, 0),
  }));

  // Pacchetti presenti nelle pratiche ma non più in listino attivo
  const orphanKeys = new Set<PackageKey>();
  for (const p of paid) {
    const key = p.selectedPackage;
    if (key && !nameByKey.has(key)) orphanKeys.add(key);
  }
  for (const key of orphanKeys) {
    byPackage.push({
      key,
      name: key.replaceAll("_", " "),
      count: paid.filter((p) => p.selectedPackage === key).length,
      total: paid
        .filter((p) => p.selectedPackage === key)
        .reduce((s, p) => s + p.price, 0),
    });
  }

  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const flatTest =
    isFlatOfferOn() || practices.some((p) => hasFlatOfferLine(p.lineItems))
      ? flatTestWindows(practices, quoteStats)
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-crm-text">Statistiche</h1>
          <p className="text-sm text-crm-text2">
            Pratiche, questionari e incassi dal gestionale.
          </p>
        </div>
        <a
          href={GA4_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-crm-border bg-crm-surface px-3 py-2 text-sm font-medium text-crm-text transition-colors hover:border-crm-accent/40 hover:text-crm-accent"
        >
          Apri Google Analytics
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {measurementId && (
        <p className="text-xs text-crm-muted">
          Property collegata: <span className="font-mono">{measurementId}</span>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          icon={<Briefcase className="h-5 w-5" />}
          value={practices.length}
          label="Pratiche totali"
        />
        <KpiCard
          icon={<ClipboardList className="h-5 w-5" />}
          value={quoteStats.totalCompleted}
          label="Questionari completati"
          hint={`Pacchetto proposto ${quoteStats.byEsito.b} · Su misura ${quoteStats.byEsito.c} · Possibile esonero ${quoteStats.byEsito.a} · lead aperti ${leadsFromSite}`}
        >
          <StatsAdjust
            kind="quote"
            disabled={quoteStats.totalCompleted <= 0}
          />
        </KpiCard>
        <KpiCard
          icon={<CircleDollarSign className="h-5 w-5" />}
          value={`${kpi.revenueYtd.toLocaleString("it-IT")} €`}
          label="Onorari incassati"
        />
        <KpiCard
          icon={<Receipt className="h-5 w-5" />}
          value={`${kpi.avgTicket} €`}
          label="Ticket medio"
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5" />}
          value={
            kpi.contactsWithReach === 0
              ? "0"
              : `${kpi.paidFromContact} su ${kpi.contactsWithReach}`
          }
          label="Pagate su chi ha lasciato un recapito"
          hint="I questionari senza telefono o email non contano."
        />
        <KpiCard
          icon={<Play className="h-5 w-5" />}
          value={videoStats.totalStarts}
          label="Riproduzioni video"
          hint={`Completati fino in fondo ${videoStats.totalCompletes}`}
        >
          <StatsAdjust
            kind="video"
            disabled={videoStats.totalStarts <= 0}
          />
        </KpiCard>
      </div>

      {flatTest && flatTest.started && (
        <CrmCard>
          <SectionTitle>Test prezzo unico {FLAT_OFFER.price} €</SectionTitle>
          <p className="mt-1 text-xs text-crm-muted">
            {flatTest.ended ? "Test concluso" : "Test in corso"}: dal {FLAT_OFFER.startsAt} al{" "}
            {FLAT_OFFER.endsAt}, confrontato con i {FLAT_BEFORE_DAYS} giorni prima (listino a
            pacchetti). I numeri &quot;al giorno&quot; tolgono l&apos;effetto della diversa durata.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="text-left text-xs text-crm-muted">
                  <th className="pb-2 font-medium">Misura</th>
                  <th className="pb-2 font-medium">
                    {FLAT_BEFORE_DAYS} giorni prima
                  </th>
                  <th className="pb-2 font-medium">
                    Test ({flatTest.test.days} {flatTest.test.days === 1 ? "giorno" : "giorni"})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-crm-border">
                <FlatRow
                  label="Questionari completati"
                  before={flatTest.before.quizzes}
                  test={flatTest.test.quizzes}
                  beforeDays={flatTest.before.days}
                  testDays={flatTest.test.days}
                />
                <FlatRow
                  label="Pratiche nate dal sito o dal CRM"
                  before={flatTest.before.requests}
                  test={flatTest.test.requests}
                  beforeDays={flatTest.before.days}
                  testDays={flatTest.test.days}
                />
                <FlatRow
                  label="Pratiche pagate"
                  before={flatTest.before.paid}
                  test={flatTest.test.paid}
                  beforeDays={flatTest.before.days}
                  testDays={flatTest.test.days}
                  testNote={`di cui a prezzo unico ${flatTest.test.paidFlat}`}
                />
                <FlatRow
                  label="Onorari delle pratiche pagate"
                  before={flatTest.before.revenue}
                  test={flatTest.test.revenue}
                  beforeDays={flatTest.before.days}
                  testDays={flatTest.test.days}
                  euro
                />
              </tbody>
            </table>
          </div>
          <p className="mt-3 rounded-lg bg-crm-bg2/60 p-3 text-xs text-crm-muted">
            Come leggerlo: se le pratiche pagate al giorno non salgono nemmeno a{" "}
            {FLAT_OFFER.price} €, il freno non è il prezzo; se salgono, gli onorari al giorno dicono
            se il prezzo più basso si ripaga. Questionari: il conteggio giornaliero parte con il
            test, quindi per il periodo prima non c&apos;è il dato (resta il totale in alto).
          </p>
        </CrmCard>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pratiche per stato */}
        <CrmCard>
          <SectionTitle>Pratiche per stato</SectionTitle>
          <div className="mt-4 space-y-3">
            {byStatus.map((s) => (
              <div key={s.status}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-crm-text2">{statusLabels[s.status]}</span>
                  <span className="text-crm-muted">{s.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-crm-bg2">
                  <div
                    className="h-full rounded-full crm-gradient"
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CrmCard>

        {/* Onorari per pacchetto */}
        <CrmCard>
          <SectionTitle>Onorari per pacchetto</SectionTitle>
          <div className="mt-4 space-y-3">
            {byPackage.map((b) => (
              <div
                key={b.key}
                className="flex items-center justify-between rounded-lg border border-crm-border bg-crm-bg2/40 px-3 py-2.5 text-sm"
              >
                <span className="text-crm-text">{b.name}</span>
                <span className="text-crm-text2">
                  {b.count} pratiche ·{" "}
                  <span className="font-medium text-crm-text">{b.total} €</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-crm-bg2/60 p-3 text-xs text-crm-muted">
            In produzione: incassi riconciliati da Stripe, traffico/funnel da
            GA4, spesa da Google Ads (dashboard marketing via Looker Studio).
          </p>
        </CrmCard>
      </div>

      <CrmCard>
        <SectionTitle>Riproduzioni video</SectionTitle>
        <p className="mt-1 text-xs text-crm-muted">
          Avvii dal tasto play (il loop muted in hero non conta). I video di
          gattini sono a parte e non entrano nel totale in alto. GA4 resta per
          il dettaglio 25/50/75% dei video del sito.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEO_IDS.map((id) => {
            const clip = videoStats.byVideo[id];
            const max = Math.max(
              ...VIDEO_IDS.map((k) => videoStats.byVideo[k].starts),
              1,
            );
            return (
              <div
                key={id}
                className="rounded-lg border border-crm-border bg-crm-bg2/40 px-3 py-3"
              >
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium text-crm-text">
                    {VIDEO_LABELS[id]}
                  </span>
                  <span className="tabular-nums text-crm-text2">
                    {clip.starts} avvii
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-crm-bg2">
                  <div
                    className="h-full rounded-full crm-gradient"
                    style={{ width: `${(clip.starts / max) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-crm-muted">
                  {id === "gatti"
                    ? "Ogni tap su Guarda conta un avvio."
                    : `Completati ${clip.completes}${
                        clip.starts > 0
                          ? ` · ${Math.round((clip.completes / clip.starts) * 100)}%`
                          : ""
                      }`}
                </p>
                <StatsAdjust
                  kind="video"
                  videoId={id}
                  disabled={clip.starts <= 0}
                />
              </div>
            );
          })}
        </div>
      </CrmCard>
    </div>
  );
}

function perDay(value: number, days: number, euro: boolean): string {
  const rate = value / Math.max(1, days);
  return euro
    ? `${Math.round(rate).toLocaleString("it-IT")} € al giorno`
    : `${rate.toLocaleString("it-IT", { maximumFractionDigits: 1 })} al giorno`;
}

function FlatRow({
  label,
  before,
  test,
  beforeDays,
  testDays,
  euro = false,
  testNote,
}: {
  label: string;
  before: number | null;
  test: number | null;
  beforeDays: number;
  testDays: number;
  euro?: boolean;
  testNote?: string;
}) {
  const cell = (value: number | null, days: number, note?: string) =>
    value === null ? (
      <span className="text-crm-muted">—</span>
    ) : (
      <>
        <span className="font-medium text-crm-text">
          {euro ? `${value.toLocaleString("it-IT")} €` : value}
        </span>
        <span className="block text-[11px] text-crm-muted">
          {perDay(value, days, euro)}
          {note ? ` · ${note}` : ""}
        </span>
      </>
    );
  return (
    <tr>
      <td className="py-2 pr-3 text-crm-text2">{label}</td>
      <td className="py-2 pr-3">{cell(before, beforeDays)}</td>
      <td className="py-2">{cell(test, testDays, testNote)}</td>
    </tr>
  );
}

function KpiCard({
  icon,
  value,
  label,
  hint,
  children,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <CrmCard>
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-crm-accent/15 text-crm-accent">
        {icon}
      </span>
      <p className="mt-3 text-2xl font-semibold text-crm-text">{value}</p>
      <p className="text-xs text-crm-text2">{label}</p>
      {hint && <p className="mt-1 text-[11px] text-crm-muted">{hint}</p>}
      {children}
    </CrmCard>
  );
}
