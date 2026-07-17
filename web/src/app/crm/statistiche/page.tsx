import {
  Briefcase,
  CircleDollarSign,
  TrendingUp,
  Receipt,
  ExternalLink,
  ClipboardList,
} from "lucide-react";
import { statusLabels, type PackageType } from "@/content/crm-data";
import { getPractices, deriveKpi, statusCounts } from "@/lib/crm";
import { getPackages } from "@/lib/cms";
import { getQuoteStats } from "@/lib/quote-stats";
import { CrmCard, SectionTitle } from "@/components/crm/ui";

export const dynamic = "force-dynamic";

const GA4_URL = "https://analytics.google.com/analytics/web/";

type PackageKey = Exclude<PackageType, null>;

export default async function StatistichePage() {
  const [practices, packages, quoteStats] = await Promise.all([
    getPractices(),
    getPackages(),
    getQuoteStats(),
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-crm-text">Statistiche</h1>
          <p className="text-sm text-crm-text2">
            KPI operativi e finanziari (dati simulati).
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          icon={<Briefcase className="h-5 w-5" />}
          value={practices.length}
          label="Pratiche totali"
        />
        <KpiCard
          icon={<ClipboardList className="h-5 w-5" />}
          value={quoteStats.totalCompleted}
          label="Questionari completati"
          hint={`A ${quoteStats.byEsito.a} · B ${quoteStats.byEsito.b} · C ${quoteStats.byEsito.c} · lead aperti ${leadsFromSite}`}
        />
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
          value={`${kpi.conversionRate}%`}
          label="Conversione lead → cliente"
        />
      </div>

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
    </div>
  );
}

function KpiCard({
  icon,
  value,
  label,
  hint,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  hint?: string;
}) {
  return (
    <CrmCard>
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-crm-accent/15 text-crm-accent">
        {icon}
      </span>
      <p className="mt-3 text-2xl font-semibold text-crm-text">{value}</p>
      <p className="text-xs text-crm-text2">{label}</p>
      {hint && <p className="mt-1 text-[11px] text-crm-muted">{hint}</p>}
    </CrmCard>
  );
}
