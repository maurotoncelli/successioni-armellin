import type { Metadata } from "next";
import { getRequestLocale, navPageTitle, t, tCta, tList, tObj } from "@/lib/locale";
import {
  ArrowRight,
  Clock,
  FileCheck2,
  FileSignature,
  FileText,
  FolderOpen,
  Landmark,
  Map as MapIcon,
  Package,
  Receipt,
  RefreshCcw,
  Scale,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { PackageCards } from "@/components/site/package-cards";
import { CtaBand } from "@/components/site/cta-band";
import { AddonCards } from "@/components/site/addon-cards";
import { Emph, EmphBlock } from "@/components/site/emph";
import { getAddons } from "@/lib/cms";
import Link from "next/link";

/** Icone per `tariffe.deliverable_list` (ordine fisso delle voci in content). */
const DELIVERABLE_ICONS: LucideIcon[] = [
  FileCheck2,
  FileSignature,
  Landmark,
  MapIcon,
  Receipt,
];

const GUIDA_ICONS: { Icon: LucideIcon; accent: boolean }[] = [
  { Icon: Package, accent: true },
  { Icon: RefreshCcw, accent: false },
  { Icon: FolderOpen, accent: true },
  { Icon: Undo2, accent: false },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await navPageTitle("/tariffe", "Tariffe"),
    description: await t("tariffe", "hero_subtitle"),
  };
}

export default async function TariffePage() {
  const locale = await getRequestLocale();
  const deliverable = await tList<string>("tariffe", "deliverable_list");
  const finalCta = await tCta("tariffe", "cta_finale_button");
  const tiServeCta = await tCta("tariffe", "ti_serve_cta");
  const addons = await getAddons(locale);

  const telefono = await tObj("contatti", "telefono", {
    numero: "",
    cta_chiama: "tel:+393201570567",
  });
  const emailObj = await tObj("contatti", "email", { generale: "" });
  const addonContact = {
    phoneHref: telefono.cta_chiama || "tel:+393201570567",
    phoneLabel: await t("tariffe", "addon_phone_label", "Chiama Lorenzo"),
    emailHref: emailObj.generale ? `mailto:${emailObj.generale}` : "/contatti",
    emailLabel: await t("tariffe", "addon_email_label", "Scrivici via email"),
  };
  const addonDiscover = await t(
    "tariffe",
    "addon_discover",
    "Scopri come attivarlo",
  );
  const guidaItems = await tList<{ titolo: string; testo: string }>(
    "tariffe",
    "guida_scelta_items",
  );
  const guidaRecesso = await tCta("tariffe", "guida_scelta_recesso", {
    label: "Come funziona il recesso",
    href: "/recesso",
  });

  return (
    <>
      <PageHero
        eyebrow={await t("tariffe", "hero_eyebrow", "Prezzi chiari")}
        title={await t("tariffe", "hero_title")}
        subtitle={await t("tariffe", "hero_subtitle")}
      />

      <Section>
        <PackageCards />
        <p className="mt-5 text-center text-sm text-text-muted sm:mt-8">
          {await t("tariffe", "rate_text")}
        </p>
      </Section>

      <Section id="guida" tone="sand" className="scroll-mt-24">
        <SectionHeading
          title={await t("tariffe", "guida_scelta_title")}
          intro={await t("tariffe", "guida_scelta_body")}
        />
        <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
          {guidaItems.map((item, i) => {
            const { Icon, accent } = GUIDA_ICONS[i] ?? GUIDA_ICONS[0];
            return (
              <article
                key={item.titolo}
                className={cn(
                  "rounded-2xl border border-primary/10 border-s-4 bg-bg px-5 py-5 shadow-sm sm:px-6 sm:py-6",
                  accent ? "border-s-accent" : "border-s-primary",
                  "transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md",
                  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full ring-1",
                    accent
                      ? "bg-accent/15 text-accent ring-accent/40"
                      : "bg-primary/10 text-primary ring-primary/20",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary sm:text-xl">
                  {item.titolo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">
                  <Emph text={item.testo} />
                </p>
              </article>
            );
          })}
        </div>
        <div className="mt-6 text-center sm:mt-8">
          <Link
            href={guidaRecesso.href}
            className="inline-flex items-center gap-1.5 font-semibold text-accent hover:text-accent-dark"
          >
            {guidaRecesso.label}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <article
            className={cn(
              "rounded-2xl border border-primary/10 border-s-4 border-s-accent bg-bg px-5 py-6 shadow-sm sm:px-7 sm:py-8",
              "transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
          >
            <Scale className="h-8 w-8 text-accent" aria-hidden />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {await t("tariffe", "hero_eyebrow", "Prezzi chiari")}
            </p>
            <h3 className="mt-2 text-xl font-bold text-primary sm:text-2xl">
              {await t("tariffe", "box_trasparenza_title")}
            </h3>
            <EmphBlock
              className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base"
              text={await t("tariffe", "box_trasparenza_body")}
            />
          </article>
          <article
            className={cn(
              "rounded-2xl border border-primary/10 border-s-4 border-s-primary bg-bg px-5 py-6 shadow-sm sm:px-7 sm:py-8",
              "transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
          >
            <Clock className="h-8 w-8 text-primary" aria-hidden />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
              {await t("tariffe", "sla_eyebrow", "Tempi")}
            </p>
            <h3 className="mt-2 text-xl font-bold text-primary sm:text-2xl">
              {await t("tariffe", "sla_title")}
            </h3>
            <EmphBlock
              className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base"
              text={await t("tariffe", "sla_note")}
            />
          </article>
        </div>
      </Section>

      <Section>
        <div className="overflow-hidden rounded-2xl bg-sand">
          <div className="border-b border-primary/10 px-5 py-6 sm:px-8 sm:py-8">
            <h2 className="text-2xl sm:text-3xl">
              {await t("tariffe", "deliverable_title")}
            </h2>
          </div>
          <ul className="divide-y divide-primary/10">
            {deliverable.map((item, index) => {
              const Icon = DELIVERABLE_ICONS[index] ?? FileText;
              return (
                <li
                  key={item}
                  className="flex items-center gap-4 px-5 py-4 sm:px-8 sm:py-5"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg text-accent ring-1 ring-accent/30">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-sm font-medium text-primary sm:text-base">
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* Il blocco sparisce se dal CRM (listino) tutti gli addon sono
          disattivati; i singoli disattivati sono gia' filtrati a monte. */}
      {addons.length > 0 && (
        <Section tone="sand">
          <SectionHeading
            title={await t("tariffe", "addon_intro")}
            intro={await t("tariffe", "addon_subtitle")}
          />
          <AddonCards
            addons={addons}
            contactText={await t("tariffe", "addon_contact_text")}
            contact={addonContact}
            discoverLabel={addonDiscover}
          />
        </Section>
      )}

      <Section tone="sand">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-4xl">
            {await t("tariffe", "ti_serve_title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-muted sm:mt-4 sm:text-lg">
            {await t("tariffe", "ti_serve_body")}
          </p>
          <div className="mt-6 sm:mt-8">
            <ButtonLink href={tiServeCta.href} variant="primary" size="lg">
              {tiServeCta.label}
            </ButtonLink>
          </div>
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-text-muted sm:mt-10">
          {await t("tariffe", "su_misura_text")}
        </p>
        <p className="mt-3 text-sm text-text-muted">
          {await t("tariffe", "microtrust")}
        </p>
      </Section>

      <CtaBand
        title={await t("tariffe", "cta_finale_title")}
        button={finalCta}
      />
    </>
  );
}
