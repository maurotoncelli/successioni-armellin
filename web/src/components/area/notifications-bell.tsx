"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  FileWarning,
  Landmark,
  Megaphone,
  PartyPopper,
  Undo2,
} from "lucide-react";
import type {
  ClientNotification,
  ClientNotificationKind,
} from "@/lib/client-notifications-shared";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/area-riservata/(app)/notifiche/actions";
import { cn } from "@/lib/utils";

const kindMeta: Record<
  ClientNotificationKind,
  { icon: typeof Bell; cls: string }
> = {
  stato: { icon: Megaphone, cls: "bg-primary/10 text-primary" },
  imposte: { icon: Landmark, cls: "bg-accent/15 text-accent-dark" },
  documento: { icon: FileWarning, cls: "bg-amber-100 text-amber-800" },
  finali: { icon: PartyPopper, cls: "bg-success/15 text-success" },
  recesso: { icon: Undo2, cls: "bg-red-50 text-red-700" },
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

export function NotificationsBell({
  initialItems,
  unreadCount,
  commsNewCount,
}: {
  initialItems: ClientNotification[];
  unreadCount: number;
  /** Novità nello storico comunicazioni (badge secondario sul link). */
  commsNewCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialItems);
  const [unread, setUnread] = useState(unreadCount);
  const [syncedFrom, setSyncedFrom] = useState({
    initialItems,
    unreadCount,
  });
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  // Sincronizza con i props server dopo refresh (senza useEffect → setState).
  if (
    initialItems !== syncedFrom.initialItems ||
    unreadCount !== syncedFrom.unreadCount
  ) {
    setSyncedFrom({ initialItems, unreadCount });
    setItems(initialItems);
    setUnread(unreadCount);
  }

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function openItem(n: ClientNotification) {
    startTransition(async () => {
      if (!n.readAt) {
        await markNotificationReadAction(n.id);
        setItems((prev) =>
          prev.map((x) =>
            x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x,
          ),
        );
        setUnread((u) => Math.max(0, u - 1));
      }
      setOpen(false);
      router.push(n.href || "/area-riservata/dashboard");
      router.refresh();
    });
  }

  function markAll() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      setItems((prev) =>
        prev.map((x) => ({ ...x, readAt: x.readAt ?? new Date().toISOString() })),
      );
      setUnread(0);
      router.refresh();
    });
  }

  const showBadge = unread > 0;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center rounded-[10px] px-3 py-2 text-text-muted hover:bg-bg-muted hover:text-text"
        aria-label={
          showBadge
            ? `Notifiche, ${unread} non lette`
            : "Notifiche"
        }
      >
        <Bell className="h-5 w-5" />
        {showBadge && (
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-primary/10 bg-bg shadow-xl">
          <div className="flex items-center justify-between border-b border-primary/10 px-4 py-3">
            <p className="text-sm font-semibold text-text">Novità</p>
            {unread > 0 && (
              <button
                type="button"
                disabled={pending}
                onClick={markAll}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent-dark hover:underline disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Segna tutte lette
              </button>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-text-muted">
                Nessuna notifica per ora.
              </li>
            )}
            {items.map((n) => {
              const meta = kindMeta[n.kind] ?? kindMeta.stato;
              const Icon = meta.icon;
              const unreadRow = !n.readAt;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => openItem(n)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-bg-muted",
                      unreadRow && "bg-sand/40",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                        meta.cls,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span
                          className={cn(
                            "text-sm text-text",
                            unreadRow && "font-semibold",
                          )}
                        >
                          {n.title}
                        </span>
                        <span className="shrink-0 text-[11px] text-text-muted">
                          {formatWhen(n.createdAt)}
                        </span>
                      </span>
                      {n.body && (
                        <span className="mt-0.5 block text-xs text-text-muted line-clamp-2">
                          {n.body}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-primary/10 px-4 py-3">
            <Link
              href="/area-riservata/comunicazioni"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-accent-dark hover:underline"
            >
              Vedi tutte le comunicazioni
              {commsNewCount > 0 ? ` (${commsNewCount} nuove)` : ""}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
