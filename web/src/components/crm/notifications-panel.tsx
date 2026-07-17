"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Bell,
  CircleDollarSign,
  ClipboardList,
  FileCheck2,
  Landmark,
  OctagonAlert,
  PenLine,
  Undo2,
  UserPlus,
  X,
} from "lucide-react";
import { CrmCard, SectionTitle } from "@/components/crm/ui";
import type {
  CrmNotification,
  CrmNotificationKind,
} from "@/lib/crm-notifications";
import {
  dismissNotification,
  dismissAllNotifications,
} from "@/app/crm/notifications/actions";
import { cn } from "@/lib/utils";

/*
  Centro notifiche della Home CRM: eventi puntuali (pagamenti, lead, recesso,
  documenti, mandato, questionari) eliminabili. Filtro locale (localStorage):
  "Importanti" nasconde i questionari preventivo; "Tutte" + chip per tipo.
*/

const STORAGE_KEY = "crm-notif-filter-v1";

type FilterMode = "important" | "all";

type FilterState = {
  mode: FilterMode;
  /** Kind nascosti quando mode === "all". */
  hiddenKinds: CrmNotificationKind[];
};

const DEFAULT_FILTER: FilterState = { mode: "important", hiddenKinds: [] };

const KIND_ORDER: CrmNotificationKind[] = [
  "pagamento",
  "rimborso",
  "lead",
  "recesso",
  "documenti",
  "mandato",
  "iban",
  "preventivo",
];

const kindMeta: Record<
  CrmNotificationKind,
  { icon: typeof Bell; cls: string; label: string }
> = {
  pagamento: {
    icon: CircleDollarSign,
    cls: "bg-crm-green/15 text-crm-green",
    label: "Pagamenti",
  },
  rimborso: {
    icon: Undo2,
    cls: "bg-crm-amber/15 text-crm-amber",
    label: "Rimborsi",
  },
  lead: {
    icon: UserPlus,
    cls: "bg-crm-purple/15 text-crm-purple",
    label: "Lead",
  },
  recesso: {
    icon: OctagonAlert,
    cls: "bg-crm-rose/15 text-crm-rose",
    label: "Recesso",
  },
  documenti: {
    icon: FileCheck2,
    cls: "bg-crm-accent/15 text-crm-accent",
    label: "Documenti",
  },
  mandato: {
    icon: PenLine,
    cls: "bg-crm-accent/15 text-crm-accent",
    label: "Mandato",
  },
  iban: {
    icon: Landmark,
    cls: "bg-crm-green/15 text-crm-green",
    label: "IBAN",
  },
  preventivo: {
    icon: ClipboardList,
    cls: "bg-crm-bg2 text-crm-text2",
    label: "Questionari",
  },
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (sameDay) return `oggi ${time}`;
  return `${d.toLocaleDateString("it-IT", { day: "numeric", month: "short" })} ${time}`;
}

function loadFilter(): FilterState {
  if (typeof window === "undefined") return DEFAULT_FILTER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FILTER;
    const parsed = JSON.parse(raw) as Partial<FilterState>;
    return {
      mode: parsed.mode === "all" ? "all" : "important",
      hiddenKinds: Array.isArray(parsed.hiddenKinds)
        ? (parsed.hiddenKinds.filter((k) =>
            KIND_ORDER.includes(k as CrmNotificationKind),
          ) as CrmNotificationKind[])
        : [],
    };
  } catch {
    return DEFAULT_FILTER;
  }
}

export function NotificationsPanel({
  notifications,
}: {
  notifications: CrmNotification[];
}) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [clearedAll, setClearedAll] = useState(false);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [hydrated, setHydrated] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setFilter(loadFilter());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filter));
    } catch {
      /* ignore */
    }
  }, [filter, hydrated]);

  const presentKinds = useMemo(() => {
    const set = new Set(notifications.map((n) => n.kind));
    return KIND_ORDER.filter((k) => set.has(k));
  }, [notifications]);

  const visible = useMemo(() => {
    if (clearedAll) return [];
    return notifications.filter((n) => {
      if (hidden.has(n.id)) return false;
      if (filter.mode === "important" && n.kind === "preventivo") return false;
      if (filter.mode === "all" && filter.hiddenKinds.includes(n.kind))
        return false;
      return true;
    });
  }, [notifications, hidden, clearedAll, filter]);

  const hiddenByFilter = clearedAll
    ? 0
    : notifications.filter((n) => !hidden.has(n.id)).length - visible.length;

  function dismiss(id: string) {
    setHidden((prev) => new Set(prev).add(id));
    startTransition(async () => {
      const res = await dismissNotification(id);
      if (!res.ok) {
        setHidden((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    });
  }

  function dismissAll() {
    setClearedAll(true);
    startTransition(async () => {
      const res = await dismissAllNotifications();
      if (!res.ok) setClearedAll(false);
    });
  }

  function toggleKind(kind: CrmNotificationKind) {
    setFilter((prev) => {
      const hiddenKinds = prev.hiddenKinds.includes(kind)
        ? prev.hiddenKinds.filter((k) => k !== kind)
        : [...prev.hiddenKinds, kind];
      return { ...prev, mode: "all", hiddenKinds };
    });
  }

  return (
    <CrmCard>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-crm-accent" />
          <SectionTitle>Notifiche</SectionTitle>
          {visible.length > 0 && (
            <span className="rounded-full bg-crm-accent/15 px-2 py-0.5 text-[11px] font-semibold text-crm-accent">
              {visible.length}
            </span>
          )}
        </div>
        {visible.length > 1 && (
          <button
            type="button"
            onClick={dismissAll}
            className="shrink-0 text-xs font-medium text-crm-muted transition-colors hover:text-crm-rose"
          >
            Elimina tutte
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setFilter((f) => ({ ...f, mode: "important" }))}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
            filter.mode === "important"
              ? "bg-crm-accent text-white"
              : "bg-crm-bg2 text-crm-text2 hover:bg-crm-hover",
          )}
        >
          Importanti
        </button>
        <button
          type="button"
          onClick={() => setFilter((f) => ({ ...f, mode: "all" }))}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
            filter.mode === "all"
              ? "bg-crm-accent text-white"
              : "bg-crm-bg2 text-crm-text2 hover:bg-crm-hover",
          )}
        >
          Tutte
        </button>
        {filter.mode === "all" &&
          presentKinds.map((kind) => {
            const on = !filter.hiddenKinds.includes(kind);
            return (
              <button
                key={kind}
                type="button"
                onClick={() => toggleKind(kind)}
                title={on ? `Nascondi ${kindMeta[kind].label}` : `Mostra ${kindMeta[kind].label}`}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  on
                    ? "bg-crm-surface text-crm-text ring-1 ring-crm-border"
                    : "bg-crm-bg2/60 text-crm-muted line-through",
                )}
              >
                {kindMeta[kind].label}
              </button>
            );
          })}
      </div>

      {filter.mode === "important" && (
        <p className="mt-2 text-[11px] text-crm-muted">
          Nasconde i questionari preventivo. Passa a Tutte per vederli o
          filtrare per tipo.
        </p>
      )}

      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-crm-muted">
          {hiddenByFilter > 0
            ? `${hiddenByFilter} notifiche nascoste dal filtro. Passa a Tutte o riattiva i tipi.`
            : "Nessuna nuova notifica. Qui arrivano pagamenti, lead, documenti, recesso e (in Tutte) i questionari completati."}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {visible.map((n) => {
            const meta = kindMeta[n.kind] ?? kindMeta.documenti;
            const Icon = meta.icon;
            return (
              <li
                key={n.id}
                className="flex items-start gap-3 rounded-lg border border-crm-border bg-crm-bg2/50 px-3 py-2.5"
              >
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${meta.cls}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-crm-text">{n.title}</p>
                  {n.body && (
                    <p className="mt-0.5 text-xs leading-relaxed text-crm-text2">
                      {n.body}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-crm-muted">
                    {formatWhen(n.createdAt)}
                    {n.practiceId && (
                      <>
                        {" · "}
                        <Link
                          href={`/crm/pratiche/${n.practiceId}`}
                          className="font-mono text-crm-accent hover:underline"
                        >
                          {n.practiceCode || "apri pratica"}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(n.id)}
                  aria-label="Elimina notifica"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-crm-muted transition-colors hover:bg-crm-hover hover:text-crm-rose"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </CrmCard>
  );
}
