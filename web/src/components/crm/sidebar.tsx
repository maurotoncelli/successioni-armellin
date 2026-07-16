"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  CalendarDays,
  Users,
  BarChart3,
  FileEdit,
  Lightbulb,
  PauseCircle,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/crm-login/actions";

const nav = [
  { href: "/crm", label: "Home operativa", icon: LayoutDashboard, exact: true },
  { href: "/crm/pratiche", label: "Pratiche", icon: KanbanSquare },
  { href: "/crm/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/crm/contatti", label: "Contatti", icon: Users },
  { href: "/crm/statistiche", label: "Statistiche", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-crm-border bg-crm-bg2 lg:flex">
      <div className="flex h-14 items-center gap-2.5 border-b border-crm-border px-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg crm-gradient text-sm font-bold text-white">
          A
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-crm-text">Flowdesk</p>
          <p className="text-[11px] text-crm-muted">Armellin</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 border-b border-crm-border px-4 py-3">
        <span className="grid h-8 w-8 place-items-center rounded-full crm-gradient text-xs font-bold text-white">
          LA
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium text-crm-text">Lorenzo Armellin</p>
          <p className="text-[11px] text-crm-muted">Amministratore</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-crm-muted">
          Lavoro
        </p>
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-crm-accent/15 text-crm-accent"
                  : "text-crm-text2 hover:bg-crm-hover hover:text-crm-text",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}

        <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-crm-muted">
          Sito
        </p>
        <Link
          href="/crm/listino"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/crm/listino")
              ? "bg-crm-accent/15 text-crm-accent"
              : "text-crm-text2 hover:bg-crm-hover hover:text-crm-text",
          )}
        >
          <FileEdit className="h-[18px] w-[18px]" />
          Listino e contenuti
        </Link>
        <Link
          href="/crm/migliorie"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/crm/migliorie")
              ? "bg-crm-accent/15 text-crm-accent"
              : "text-crm-text2 hover:bg-crm-hover hover:text-crm-text",
          )}
        >
          <Lightbulb className="h-[18px] w-[18px]" />
          Migliorie sito
        </Link>
        <Link
          href="/crm/modalita-offline"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/crm/modalita-offline")
              ? "bg-crm-accent/15 text-crm-accent"
              : "text-crm-text2 hover:bg-crm-hover hover:text-crm-text",
          )}
        >
          <PauseCircle className="h-[18px] w-[18px]" />
          Modalità offline
        </Link>
      </nav>

      <div className="space-y-1 border-t border-crm-border p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-crm-text2 hover:bg-crm-hover hover:text-crm-text"
        >
          <ExternalLink className="h-4 w-4" />
          Vai al sito pubblico
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-crm-text2 hover:bg-crm-hover hover:text-crm-text"
          >
            <LogOut className="h-4 w-4" />
            Esci
          </button>
        </form>
        <p className="px-3 pt-3 text-[10px] leading-snug text-crm-muted">
          Realizzato da{" "}
          <span className="font-medium text-crm-text2">AT STUDIO</span>
          <br />
          Mauro Toncelli
        </p>
      </div>
    </aside>
  );
}
