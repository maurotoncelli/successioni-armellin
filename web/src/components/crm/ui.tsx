import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  actionOwnerMeta,
  statusLabels,
  type ActionOwner,
  type PracticeStatus,
} from "@/content/crm-data";

export function CrmCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-crm-border bg-crm-surface p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

const toneClasses: Record<string, string> = {
  accent: "bg-crm-accent/15 text-crm-accent",
  amber: "bg-crm-amber/15 text-crm-amber",
  green: "bg-crm-green/15 text-crm-green",
  rose: "bg-crm-rose/15 text-crm-rose",
  purple: "bg-crm-purple/15 text-crm-purple",
  muted: "bg-white/5 text-crm-text2",
};

export function Badge({
  tone = "muted",
  className,
  children,
}: {
  tone?: keyof typeof toneClasses | string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone] ?? toneClasses.muted,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ActionBadge({ owner }: { owner: ActionOwner }) {
  const meta = actionOwnerMeta[owner];
  if (owner === "NONE") return null;
  return (
    <Badge tone={meta.tone}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </Badge>
  );
}

const statusTone: Record<PracticeStatus, string> = {
  LEAD: "purple",
  PREVENTIVO_INVIATO: "amber",
  PAGATO: "accent",
  ATTESA_DOC: "amber",
  LAVORAZIONE: "accent",
  INVIATA: "muted",
  CHIUSA: "green",
  ANNULLATA: "rose",
};

export function StatusPill({ status }: { status: PracticeStatus }) {
  return <Badge tone={statusTone[status]}>{statusLabels[status]}</Badge>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-crm-muted">
      {children}
    </h2>
  );
}

export function PracticeLink({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={`/crm/pratiche/${id}`} className={className}>
      {children}
    </Link>
  );
}
