"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Bell,
  CircleDollarSign,
  FileCheck2,
  Landmark,
  OctagonAlert,
  PenLine,
  Undo2,
  UserPlus,
  X,
} from "lucide-react";
import { CrmCard, SectionTitle } from "@/components/crm/ui";
import type { CrmNotification } from "@/lib/crm-notifications";
import {
  dismissNotification,
  dismissAllNotifications,
} from "@/app/crm/notifications/actions";

/*
  Centro notifiche della Home CRM: eventi puntuali (pagamenti, lead, recesso,
  documenti, mandato) che Lorenzo puo ELIMINARE una volta letti, uno alla volta
  o tutti insieme. Complementare agli "Alert automatici", che invece derivano
  dallo stato delle pratiche e restano finche la condizione persiste.
*/

const kindMeta: Record<
  CrmNotification["kind"],
  { icon: typeof Bell; cls: string }
> = {
  pagamento: { icon: CircleDollarSign, cls: "bg-crm-green/15 text-crm-green" },
  rimborso: { icon: Undo2, cls: "bg-crm-amber/15 text-crm-amber" },
  lead: { icon: UserPlus, cls: "bg-crm-purple/15 text-crm-purple" },
  recesso: { icon: OctagonAlert, cls: "bg-crm-rose/15 text-crm-rose" },
  documenti: { icon: FileCheck2, cls: "bg-crm-accent/15 text-crm-accent" },
  mandato: { icon: PenLine, cls: "bg-crm-accent/15 text-crm-accent" },
  iban: { icon: Landmark, cls: "bg-crm-green/15 text-crm-green" },
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

export function NotificationsPanel({
  notifications,
}: {
  notifications: CrmNotification[];
}) {
  // Rimozione ottimistica: l'elemento sparisce subito, il server conferma.
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [clearedAll, setClearedAll] = useState(false);
  const [, startTransition] = useTransition();

  const visible = clearedAll
    ? []
    : notifications.filter((n) => !hidden.has(n.id));

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

  return (
    <CrmCard>
      <div className="flex items-center justify-between">
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
            className="text-xs font-medium text-crm-muted transition-colors hover:text-crm-rose"
          >
            Elimina tutte
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-crm-muted">
          Nessuna nuova notifica. Qui arrivano pagamenti, nuovi lead, documenti
          inviati e richieste di recesso.
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
