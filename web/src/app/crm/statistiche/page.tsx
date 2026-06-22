import {
  Briefcase,
  CircleDollarSign,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { statusLabels } from "@/content/crm-data";
import { getPractices, deriveKpi, statusCounts } from "@/lib/crm";
import { CrmCard, SectionTitle } from "@/components/crm/ui";

export const dynamic = "force-dynamic";

export default async function StatistichePage() {
  const practices = await getPractices();
  const kpi = deriveKpi(practices);
  const byStatus = statusCounts(practices);
  const maxCount = Math.max(...byStatus.map((s) => s.count), 1);

  const paid = practices.filter((p) => p.paymentStatus === "PAID");
  const byPackage = (["SEMPLICE", "COMPLETO", "ZERO_STRESS"] as const).map(
    (pkg) => ({
      pkg,
      count: paid.filter((p) => p.selectedPackage === pkg).length,
      total: paid
        .filter((p) => p.selectedPackage === pkg)
        .reduce((s, p) => s + p.price, 0),
    }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-crm-text">Statistiche</h1>
        <p className="text-sm text-crm-text2">
          KPI operativi e finanziari (dati simulati).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<Briefcase className="h-5 w-5" />}
          value={practices.length}
          label="Pratiche totali"
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
                key={b.pkg}
                className="flex items-center justify-between rounded-lg border border-crm-border bg-crm-bg2/40 px-3 py-2.5 text-sm"
              >
                <span className="text-crm-text">
                  {b.pkg.replace("_", " ")}
                </span>
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
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <CrmCard>
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-crm-accent/15 text-crm-accent">
        {icon}
      </span>
      <p className="mt-3 text-2xl font-semibold text-crm-text">{value}</p>
      <p className="text-xs text-crm-text2">{label}</p>
    </CrmCard>
  );
}
