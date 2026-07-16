"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, UserRound } from "lucide-react";
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
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-[15px] font-bold leading-none text-white"
          >
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

        <ul className="hidden items-center gap-1 xl:flex 2xl:gap-2">
          {menu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-text transition-colors hover:bg-primary/5 hover:text-accent 2xl:px-3"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/area-riservata"
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-primary hover:text-accent"
          >
            <UserRound className="h-4 w-4 shrink-0" />
            {areaLabel}
          </Link>
          <LanguageSwitcher align="right" />
          {/* Separatore: a destra le AZIONI (concettualmente diverse dalle voci di menu). */}
          <span className="h-5 w-px bg-primary/15" aria-hidden />
          <a
            href={ctaPhone.href}
            aria-label={ctaPhone.label}
            title={ctaPhone.label}
            className={buttonClasses({
              variant: "outline",
              className: "whitespace-nowrap",
            })}
          >
            <Phone className="h-4 w-4 shrink-0" />
            {/* Sotto i 1536px il pulsante resta solo icona: libera spazio e
                le voci di menu respirano. */}
            <span className="hidden 2xl:inline">{ctaPhone.label}</span>
          </a>
          {!hideQuoteCta && (
            <Link
              href={cta.href}
              className={buttonClasses({
                variant: "primary",
                className: "whitespace-nowrap",
              })}
            >
              {cta.label}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1 xl:hidden">
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
          "overflow-hidden border-t border-primary/10 bg-bg xl:hidden",
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
              <UserRound className="h-4 w-4 shrink-0" />
              {areaLabel}
            </Link>
          </li>
          {/* Azioni in fondo, separate dalle voci di menu. */}
          <li className="mt-3 border-t border-primary/10 pt-3">
            <a
              href={ctaPhone.href}
              className={buttonClasses({
                variant: "outline",
                className: "w-full",
              })}
              onClick={() => setOpen(false)}
            >
              <Phone className="h-4 w-4 shrink-0" />
              {ctaPhone.label}
            </a>
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
