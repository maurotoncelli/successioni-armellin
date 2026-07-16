import type { Metadata } from "next";
import { Check, Info } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { PackageCards } from "@/components/site/package-cards";
import { CtaBand } from "@/components/site/cta-band";
import { AddonCards } from "@/components/site/addon-cards";
import { getAddons } from "@/lib/cms";
import { cta, list, obj, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tariffe",
  description: text("tariffe", "hero_subtitle"),
};

export default async function TariffePage() {
  const deliverable = list<string>("tariffe", "deliverable_list");
  const finalCta = cta("tariffe", "cta_finale_button");
  const addons = await getAddons();

  const telefono = obj("contatti", "telefono", {
    numero: "",
    cta_chiama: "tel:+393201570567",
  });
  const emailObj = obj("contatti", "email", { generale: "" });
  const addonContact = {
    phoneHref: telefono.cta_chiama || "tel:+393201570567",
    phoneLabel: "Chiama Lorenzo",
    emailHref: emailObj.generale ? `mailto:${emailObj.generale}` : "/contatti",
    emailLabel: "Scrivici via email",
  };

  return (
    <>
      <PageHero
        eyebrow={text("tariffe", "hero_eyebrow", "Prezzi chiari")}
        title={text("tariffe", "hero_title")}
        subtitle={text("tariffe", "hero_subtitle")}
      />

      <Section>
        <PackageCards />
        <p className="mt-8 text-center text-sm text-text-muted">
          {text("tariffe", "rate_text")}
        </p>
      </Section>

      <Section tone="muted">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-2 text-primary">
              <Info className="h-5 w-5 text-accent" />
              <h3 className="text-xl">{text("tariffe", "box_trasparenza_title")}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {text("tariffe", "box_trasparenza_body")}
            </p>
          </Card>
          <Card>
            <h3 className="text-xl">{text("tariffe", "sla_title")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {text("tariffe", "sla_note")}
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeading title={text("tariffe", "deliverable_title")} />
        {/* w-fit: il blocco si centra sulla larghezza reale delle voci, cosi
            l'elenco risulta allineato al titolo centrato della sezione. */}
        <ul className="mx-auto mt-10 grid w-fit max-w-2xl gap-3">
          {deliverable.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check className="mt-1 h-5 w-5 shrink-0 text-success" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Il blocco sparisce se dal CRM (listino) tutti gli addon sono
          disattivati; i singoli disattivati sono gia' filtrati a monte. */}
      {addons.length > 0 && (
        <Section tone="sand">
          <SectionHeading
            title={text("tariffe", "addon_intro")}
            intro={text("tariffe", "addon_subtitle")}
          />
          <AddonCards
            addons={addons}
            contactText={text("tariffe", "addon_contact_text")}
            contact={addonContact}
          />
        </Section>
      )}

      <Section>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Card className="bg-bg-muted">
            <h3 className="text-xl">{text("tariffe", "ti_serve_title")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {text("tariffe", "ti_serve_body")}
            </p>
          </Card>
          <Card className="bg-bg-muted">
            <h3 className="text-xl">Casi particolari</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {text("tariffe", "su_misura_text")}
            </p>
          </Card>
        </div>
        <p className="mt-10 text-center text-sm text-text-muted">
          {text("tariffe", "microtrust")}
        </p>
      </Section>

      <CtaBand
        title={text("tariffe", "cta_finale_title")}
        button={finalCta}
      />
    </>
  );
}
