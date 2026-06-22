import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Hand,
  Clock,
  AlertTriangle,
  Calendar,
  CircleDollarSign,
  FileWarning,
} from "lucide-react";
import { CrmCard, ActionBadge, SectionTitle, PracticeLink } from "@/components/crm/ui";
import {
  practices,
  alerts,
  kpi,
  statusLabels,
} from "@/content/crm-data";

const alertIcons = {
  scadenza: AlertTriangle,
  documenti: FileWarning,
  pagamento: CircleDollarSign,
  ferma: Clock,
  consegna: Calendar,
} as const;

export default function CrmHomePage() {
  // Aggregazione To-Do da tutte le pratiche
  const allTasks = practices.flatMap((p) =>
    p.tasks
      .filter((t) => !t.done)
      .map((t) => ({ ...t, code: p.code, practiceId: p.id })),
  );

  const toContact = practices.filter((p) => p.actionOwner === "ADMIN");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-crm-text">Home operativa</h1>
        <p className="text-sm text-crm-text2">
          A che punto sono e cosa devo fare adesso.
        </p>
      </div>

      {/* KPI sintesi */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          value={kpi.activePractices}
          label="Schede attive"
          hint={`${kpi.toDoNow} tocca a te · ${kpi.waitingClient} attesa cliente`}
          tone="accent"
        />
        <StatCard
          icon={<Hand className="h-5 w-5" />}
          value={kpi.toDoNow}
          label="Da fare subito"
          hint="Pratiche dove tocca a te"
          tone="amber"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          value={kpi.closedThisYear}
          label="Completate nell'anno"
          hint="Pratiche chiuse nel 2026"
          tone="green"
        />
        <StatCard
          icon={<CircleDollarSign className="h-5 w-5" />}
          value={`${kpi.revenueYtd.toLocaleString("it-IT")} €`}
          label="Onorari incassati"
          hint={`Ticket medio ${kpi.avgTicket} €`}
          tone="purple"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alert automatici */}
        <CrmCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <SectionTitle>Alert automatici</SectionTitle>
            <span className="text-xs text-crm-muted">{alerts.length} attivi</span>
          </div>
          <ul className="mt-4 space-y-2">
            {alerts.map((alert, i) => {
              const Icon = alertIcons[alert.kind];
              return (
                <li key={i}>
                  <PracticeLink
                    id={alert.practiceId}
                    className="flex items-center gap-3 rounded-lg border border-crm-border bg-crm-bg2/50 px-3 py-2.5 text-sm text-crm-text2 transition-colors hover:border-crm-accent/40 hover:text-crm-text"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-crm-amber" />
                    {alert.text}
                  </PracticeLink>
                </li>
              );
            })}
          </ul>
        </CrmCard>

        {/* To-Do */}
        <CrmCard>
          <SectionTitle>I miei To-Do</SectionTitle>
          <ul className="mt-4 space-y-2">
            {allTasks.map((task, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-crm-border bg-crm-bg2/50 px-3 py-2.5"
              >
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-crm-border-strong" />
                <div className="min-w-0">
                  <p className="text-sm text-crm-text">{task.title}</p>
                  <Link
                    href={`/crm/pratiche/${task.practiceId}`}
                    className="text-xs text-crm-accent hover:underline"
                  >
                    {task.code}
                    {task.dueDate ? ` · ${task.dueDate}` : ""}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </CrmCard>
      </div>

      {/* Da fare velocemente */}
      <CrmCard>
        <SectionTitle>Tocca a te</SectionTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-crm-muted">
                <th className="pb-2 font-medium">Pratica</th>
                <th className="pb-2 font-medium">Cliente</th>
                <th className="pb-2 font-medium">Stato</th>
                <th className="pb-2 font-medium">Azione</th>
              </tr>
            </thead>
            <tbody>
              {toContact.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-crm-border text-crm-text2"
                >
                  <td className="py-2.5">
                    <PracticeLink
                      id={p.id}
                      className="font-medium text-crm-text hover:text-crm-accent"
                    >
                      {p.code}
                    </PracticeLink>
                  </td>
                  <td className="py-2.5">{p.clientName}</td>
                  <td className="py-2.5">{statusLabels[p.status]}</td>
                  <td className="py-2.5">
                    <ActionBadge owner={p.actionOwner} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CrmCard>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  hint: string;
  tone: "accent" | "amber" | "green" | "purple";
}) {
  const toneClasses = {
    accent: "bg-crm-accent/15 text-crm-accent",
    amber: "bg-crm-amber/15 text-crm-amber",
    green: "bg-crm-green/15 text-crm-green",
    purple: "bg-crm-purple/15 text-crm-purple",
  }[tone];

  return (
    <CrmCard>
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${toneClasses}`}>
          {icon}
        </span>
        <div>
          <p className="text-2xl font-semibold text-crm-text">{value}</p>
          <p className="text-xs text-crm-text2">{label}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-crm-muted">{hint}</p>
    </CrmCard>
  );
}
