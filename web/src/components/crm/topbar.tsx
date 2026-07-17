"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Plus, Menu, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNav = [
  { href: "/crm", label: "Home" },
  { href: "/crm/pratiche", label: "Pratiche" },
  { href: "/crm/calendario", label: "Calendario" },
  { href: "/crm/contatti", label: "Contatti" },
  { href: "/crm/statistiche", label: "Statistiche" },
  { href: "/crm/listino", label: "Listino e contenuti" },
  { href: "/crm/tipologie-documenti", label: "Tipologie di documenti" },
  { href: "/crm/migliorie", label: "Migliorie sito" },
  { href: "/crm/modalita-offline", label: "Modalità offline" },
];

export function Topbar({ notificationCount = 0 }: { notificationCount?: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    router.push(`/crm/cerca?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-crm-border bg-crm-bg2/80 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-crm-text2 hover:bg-crm-hover lg:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <form onSubmit={onSearch} className="relative flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-crm-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per codice pratica, CF defunto, nome, email..."
            className="h-9 w-full rounded-lg border border-crm-border bg-crm-surface pl-9 pr-3 text-sm text-crm-text placeholder:text-crm-muted focus:border-crm-accent focus:outline-none"
          />
        </form>

        {/* Campanella: porta al pannello Notifiche della Home operativa. */}
        <Link
          href="/crm"
          aria-label={
            notificationCount > 0
              ? `${notificationCount} notifiche da leggere`
              : "Notifiche"
          }
          className="relative grid h-9 w-9 place-items-center rounded-lg text-crm-text2 hover:bg-crm-hover"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-crm-rose px-1 text-[10px] font-bold leading-none text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </Link>

        <Link
          href="/crm/pratiche/nuova"
          className="hidden items-center gap-1.5 rounded-lg crm-gradient px-3.5 py-2 text-sm font-semibold text-white sm:inline-flex"
        >
          <Plus className="h-4 w-4" />
          Nuova pratica
        </Link>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-crm-border p-3 lg:hidden">
          {mobileNav.map((item) => {
            const active =
              item.href === "/crm"
                ? pathname === "/crm"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  active
                    ? "bg-crm-accent/15 text-crm-accent"
                    : "text-crm-text2 hover:bg-crm-hover",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <p className="px-3 pt-3 text-[10px] leading-snug text-crm-muted">
            Realizzato da AT STUDIO · Mauro Toncelli
          </p>
        </nav>
      )}
    </header>
  );
}
