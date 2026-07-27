import type { Metadata } from "next";
import { getRequestLocale, navPageTitle, t, tCta, tList, tObj } from "@/lib/locale";
import {
  FileCheck2,
  FileSignature,
  FileText,
  FolderOpen,
  Landmark,
  Map as MapIcon,
  Receipt,
  Settings2,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { PackageCards } from "@/components/site/package-cards";
import { CtaBand } from "@/components/site/cta-band";
import { AddonCards } from "@/components/site/addon-cards";
import { getAddons } from "@/lib/cms";

/** Icone per `tariffe.deliverable_list` (ordine fisso delle voci in content). */
const DELIVERABLE_ICONS: LucideIcon[] = [
  FileCheck2,
  FileSignature,
  Landmark,
  MapIcon,
  Receipt,
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

  return (
    <>
      <PageHero
        eyebrow={await t("tariffe", "hero_eyebrow", "Prezzi chiari")}
        title={await t("tariffe", "hero_title")}
        subtitle={await t("tariffe", "hero_subtitle")}
      />

      <Section>
        <PackageCards />
        <p className="mt-8 text-center text-sm text-text-muted">
          {await t("tariffe", "rate_text")}
        </p>
      </Section>

      <Section tone="muted">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/10 text-accent">
              <Landmark className="h-7 w-7" />
            </span>
            <h3 className="mt-5 text-xl font-medium">{await t("tariffe", "box_trasparenza_title")}</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
              {await t("tariffe", "box_trasparenza_body")}
            </p>
          </Card>
          <Card className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/10 text-accent">
              <Timer className="h-7 w-7" />
            </span>
            <h3 className="mt-5 text-xl font-medium">{await t("tariffe", "sla_title")}</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
              {await t("tariffe", "sla_note")}
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeading title={await t("tariffe", "deliverable_title")} />
        <ul className="mx-auto mt-8 grid w-fit max-w-2xl gap-y-5 sm:mt-10">
          {deliverable.map((item, index) => {
            const Icon = DELIVERABLE_ICONS[index] ?? FileText;
            return (
              <li key={item} className="flex items-center gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-base font-medium">{item}</span>
              </li>
            );
          })}
        </ul>
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

      <Section>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Card className="bg-bg-muted text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <FolderOpen className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-medium">{await t("tariffe", "ti_serve_title")}</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
              {await t("tariffe", "ti_serve_body")}
            </p>
          </Card>
          <Card className="bg-bg-muted text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Settings2 className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-medium">
              {await t("pacchetti", "su_misura_title", "Preventivo personalizzato")}
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
              {await t("tariffe", "su_misura_text")}
            </p>
          </Card>
        </div>
        <p className="mt-8 text-center text-sm text-text-muted sm:mt-12">
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
