"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, UserRound } from "lucide-react";
import type { Cta } from "@/lib/content";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { stripSeoLocalePrefix } from "@/lib/seo-locale";

type MenuItem = { label: string; href: string };

export function NavbarClient({
  menu,
  cta,
  ctaPhone,
  areaLabel,
  ctaShort = "Preventivo",
  brandTagline = "Successioni",
  locale,
  menuOpenLabel = "Apri menu",
  menuCloseLabel = "Chiudi menu",
  langAriaLabel = "Seleziona lingua",
  homeHref = "/",
}: {
  menu: MenuItem[];
  cta: Cta;
  ctaPhone: Cta;
  areaLabel: string;
  ctaShort?: string;
  brandTagline?: string;
  locale?: string;
  menuOpenLabel?: string;
  menuCloseLabel?: string;
  langAriaLabel?: string;
  homeHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const barePath = pathname
    ? stripSeoLocalePrefix(pathname).pathname
    : "";

  // Quando l'utente sta gia calcolando o pagando, il CTA "Calcola il preventivo
  // gratis" e fuorviante: lo nascondiamo su /preventivo e /checkout.
  const hideQuoteCta =
    barePath.startsWith("/preventivo") || barePath.startsWith("/checkout");

  return (
    <header className="sticky top-0 z-40 overflow-x-clip border-b border-primary/10 bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link
          href={homeHref}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Home"
        >
          <svg
            aria-hidden
            width="36"
            height="36"
            viewBox="0 0 36 36"
            className="h-9 w-9 shrink-0 text-accent"
          >
            <circle cx="18" cy="18" r="18" fill="currentColor" />
            <text
              x="18"
              y="18"
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize="15"
              fontWeight="700"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              A
            </text>
          </svg>
          <span className="font-serif text-lg font-semibold text-primary">
            Armellin
            <span className="ms-1.5 hidden font-sans text-sm font-normal text-text-muted xl:inline">
              · {brandTagline}
            </span>
          </span>
        </Link>

        <ul className="hidden items-center xl:flex">
          {menu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-text transition-colors hover:bg-primary/5 hover:text-accent 2xl:px-2.5"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Azioni compatte: la nav e' max-w-7xl (1280px), testi lunghi qui
            facevano overfloware Contatti sopra Area personale. */}
        <div className="hidden shrink-0 items-center gap-2 xl:flex 2xl:gap-3">
          <Link
            href="/area-riservata"
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-primary hover:text-accent"
          >
            <UserRound className="h-4 w-4 shrink-0" />
            <span className="max-2xl:sr-only">{areaLabel}</span>
          </Link>
          <LanguageSwitcher
            locale={locale}
            align="right"
            ariaLabel={langAriaLabel}
          />
          <span className="h-5 w-px bg-primary/15" aria-hidden />
          <a
            href={ctaPhone.href}
            aria-label={ctaPhone.label}
            title={ctaPhone.label}
            className={buttonClasses({
              variant: "outline",
              className: "shrink-0",
            })}
          >
            <Phone className="h-4 w-4 shrink-0" />
          </a>
          {!hideQuoteCta && (
            <Link
              href={cta.href}
              className={buttonClasses({
                variant: "primary",
                className: "whitespace-nowrap",
              })}
            >
              <span className="2xl:hidden">{ctaShort}</span>
              <span className="hidden 2xl:inline">{cta.label}</span>
            </Link>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 xl:hidden">
          <LanguageSwitcher
            locale={locale}
            align="right"
            ariaLabel={langAriaLabel}
          />
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center rounded-md p-2 text-primary"
            aria-label={open ? menuCloseLabel : menuOpenLabel}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "overflow-x-clip border-t border-primary/10 bg-bg xl:hidden",
          open ? "block" : "hidden",
        )}
      >
        <ul className="flex w-full max-w-full flex-col gap-1 px-5 py-4">
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
                className: "w-full max-w-full whitespace-normal",
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
                  className: "w-full max-w-full whitespace-normal",
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
