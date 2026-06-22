"use client";

import { useState } from "react";
import Link from "next/link";
import { KanbanSquare, List, Home, AlertCircle } from "lucide-react";
import {
  pipelineOrder,
  statusLabels,
  type Practice,
} from "@/content/crm-data";
import { ActionBadge, StatusPill } from "@/components/crm/ui";
import { cn } from "@/lib/utils";

type View = "kanban" | "list";

export function PracticesBoard({ practices }: { practices: Practice[] }) {
  const [view, setView] = useState<View>("kanban");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-crm-text">Pratiche</h1>
          <p className="text-sm text-crm-text2">
            {practices.length} pratiche · pipeline allineata al pagamento anticipato
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-crm-border bg-crm-surface p-1">
          <ToggleButton
            active={view === "kanban"}
            onClick={() => setView("kanban")}
            icon={<KanbanSquare className="h-4 w-4" />}
            label="Kanban"
          />
          <ToggleButton
            active={view === "list"}
            onClick={() => setView("list")}
            icon={<List className="h-4 w-4" />}
            label="Lista"
          />
        </div>
      </div>

      {view === "kanban" ? (
        <KanbanView practices={practices} />
      ) : (
        <ListView practices={practices} />
      )}
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-crm-accent/15 text-crm-accent"
          : "text-crm-text2 hover:text-crm-text",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function KanbanView({ practices }: { practices: Practice[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3">
      {pipelineOrder.map((status) => {
        const items = practices.filter((p) => p.status === status);
        return (
          <div key={status} className="w-72 shrink-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-crm-text2">
                {statusLabels[status]}
              </h2>
              <span className="rounded-full bg-crm-surface px-2 py-0.5 text-xs text-crm-muted">
                {items.length}
              </span>
            </div>
            <div className="space-y-2">
              {items.map((p) => (
                <KanbanCard key={p.id} practice={p} />
              ))}
              {items.length === 0 && (
                <div className="rounded-[12px] border border-dashed border-crm-border px-3 py-6 text-center text-xs text-crm-muted">
                  Vuota
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({ practice }: { practice: Practice }) {
  return (
    <Link
      href={`/crm/pratiche/${practice.id}`}
      className="block rounded-[12px] border border-crm-border bg-crm-surface p-3.5 transition-colors hover:border-crm-accent/40"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-crm-accent">{practice.code}</span>
        {practice.urgent && (
          <span className="inline-flex items-center gap-1 text-xs text-crm-rose">
            <AlertCircle className="h-3.5 w-3.5" />
            Urgente
          </span>
        )}
      </div>
      <p className="mt-1.5 text-sm font-medium text-crm-text">
        {practice.clientName}
      </p>
      <div className="mt-0.5 flex items-center gap-1 text-xs text-crm-muted">
        <Home className="h-3 w-3" />
        Defunto: {practice.deceasedName}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <ActionBadge owner={practice.actionOwner} />
        {practice.price > 0 && (
          <span className="text-xs font-medium text-crm-text2">
            {practice.price} €
          </span>
        )}
      </div>
    </Link>
  );
}

function ListView({ practices }: { practices: Practice[] }) {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-crm-border bg-crm-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-crm-border text-left text-xs uppercase tracking-wide text-crm-muted">
            <th className="px-4 py-3 font-medium">Pratica</th>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Defunto</th>
            <th className="px-4 py-3 font-medium">Stato</th>
            <th className="px-4 py-3 font-medium">Azione</th>
            <th className="px-4 py-3 text-right font-medium">Onorario</th>
          </tr>
        </thead>
        <tbody>
          {practices.map((p) => (
            <tr
              key={p.id}
              className="border-b border-crm-border last:border-0 hover:bg-crm-hover/40"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/crm/pratiche/${p.id}`}
                  className="font-mono text-xs text-crm-accent hover:underline"
                >
                  {p.code}
                </Link>
              </td>
              <td className="px-4 py-3 text-crm-text">{p.clientName}</td>
              <td className="px-4 py-3 text-crm-text2">{p.deceasedName}</td>
              <td className="px-4 py-3">
                <StatusPill status={p.status} />
              </td>
              <td className="px-4 py-3">
                <ActionBadge owner={p.actionOwner} />
              </td>
              <td className="px-4 py-3 text-right text-crm-text2">
                {p.price > 0 ? `${p.price} €` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
