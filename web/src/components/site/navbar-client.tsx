"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Lock } from "lucide-react";
import type { Cta } from "@/lib/content";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";

type MenuItem = { label: string; href: string };

export function NavbarClient({
  menu,
  cta,
  ctaPhone,
  areaLabel,
}: {
  menu: MenuItem[];
  cta: Cta;
  ctaPhone: Cta;
  areaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Quando l'utente sta gia calcolando o pagando, il CTA "Calcola il preventivo
  // gratis" e fuorviante: lo nascondiamo su /preventivo e /checkout.
  const hideQuoteCta =
    pathname?.startsWith("/preventivo") || pathname?.startsWith("/checkout");

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary font-display text-lg font-bold text-white">
            A
          </span>
          <span className="font-serif text-lg font-semibold text-primary">
            Armellin
            <span className="hidden font-sans text-sm font-normal text-text-muted sm:inline">
              {" "}
              · Successioni
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {menu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-medium text-text transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={ctaPhone.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent"
          >
            <Phone className="h-4 w-4" />
            {ctaPhone.label}
          </a>
          <Link
            href="/area-riservata"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent"
          >
            <Lock className="h-4 w-4" />
            {areaLabel}
          </Link>
          <LanguageSwitcher align="right" />
          {!hideQuoteCta && (
            <Link
              href={cta.href}
              className={buttonClasses({ variant: "primary" })}
            >
              {cta.label}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher align="right" />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-primary"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "overflow-hidden border-t border-primary/10 bg-bg lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <ul className="flex flex-col gap-1 px-5 py-4">
          {menu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-md px-3 py-2.5 text-base font-medium text-text hover:bg-primary/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/area-riservata"
              className="flex items-center gap-2 rounded-md px-3 py-2.5 text-base font-medium text-text hover:bg-primary/5"
              onClick={() => setOpen(false)}
            >
              <Lock className="h-4 w-4" />
              {areaLabel}
            </Link>
          </li>
          {!hideQuoteCta && (
            <li className="mt-2">
              <Link
                href={cta.href}
                className={buttonClasses({
                  variant: "primary",
                  className: "w-full",
                })}
                onClick={() => setOpen(false)}
              >
                {cta.label}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
