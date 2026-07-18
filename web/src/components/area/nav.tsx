"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  FolderOpen,
  CreditCard,
  FileSignature,
  Download,
  Settings,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/area-riservata/dashboard", label: "Home", icon: LayoutDashboard, primary: true },
  { href: "/area-riservata/documenti", label: "Documenti", icon: FolderOpen, primary: true },
  { href: "/area-riservata/ordine", label: "Acquisto", icon: Receipt, primary: true },
  { href: "/area-riservata/comunicazioni", label: "Comunicazioni", icon: Inbox, primary: false },
  { href: "/area-riservata/dati", label: "I tuoi dati", icon: CreditCard, primary: false },
  { href: "/area-riservata/mandato", label: "Mandato", icon: FileSignature, primary: false },
  { href: "/area-riservata/conclusa", label: "Documenti finali", icon: Download, primary: false },
  { href: "/area-riservata/profilo", label: "Profilo", icon: Settings, primary: true },
];

export function AreaSidebar() {
  const pathname = usePathname();
  return (
    <nav className="hidden w-60 shrink-0 flex-col gap-1 border-r border-primary/10 bg-bg p-3 lg:flex">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent/10 text-accent-dark"
                : "text-text-muted hover:bg-bg-muted hover:text-text",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AreaBottomBar() {
  const pathname = usePathname();
  const primary = items.filter((i) => i.primary);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-primary/10 bg-bg/95 backdrop-blur lg:hidden">
      {primary.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              active ? "text-accent-dark" : "text-text-muted",
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
