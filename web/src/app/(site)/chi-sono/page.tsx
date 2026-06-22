import type { Metadata } from "next";
import { MapPin, BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Reviews } from "@/components/site/reviews";
import { CtaBand } from "@/components/site/cta-band";
import { cta, list, obj, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Chi sono",
  description: text("chi_siamo", "hero_subtitle"),
};

type Indirizzo = { via: string; cap: string; citta: string };

export default function ChiSonoPage() {
  const credenziali = list<{ voce: string; dettaglio: string }>(
    "chi_siamo",
    "credenziali_list",
  );
  const indirizzo = obj<Indirizzo>("chi_siamo", "studio_indirizzo", {
    via: "",
    cap: "",
    citta: "",
  });
  const finalButton = cta("chi_siamo", "cta_finale_button");
  const finalPhone = cta("chi_siamo", "cta_finale_phone");

  return (
    <>
      <PageHero
        eyebrow="Chi sono"
        title={text("chi_siamo", "hero_title")}
        subtitle={text("chi_siamo", "hero_subtitle")}
      />

      <Section>
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div className="aspect-[4/5] rounded-2xl bg-secondary/90" aria-hidden />
          <div>
            <h2 className="text-3xl">{text("chi_siamo", "team_title")}</h2>
            <p className="mt-4 leading-relaxed text-text-muted">
              {text("chi_siamo", "team_body")}
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">
              {text("chi_siamo", "perche_geometra_body")}
            </p>
          </div>
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading title={text("chi_siamo", "credenziali_title")} />
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {credenziali.map((c) => (
            <Card key={c.voce} className="text-center">
              <BadgeCheck className="mx-auto h-8 w-8 text-accent" />
              <h3 className="mt-3 text-base">{c.voce}</h3>
              <p className="mt-1 text-sm text-text-muted">{c.dettaglio}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <MapPin className="mx-auto h-8 w-8 text-accent" />
          <h2 className="mt-3 text-2xl">{text("chi_siamo", "studio_title")}</h2>
          <p className="mt-2 text-text-muted">
            {indirizzo.via}, {indirizzo.cap} {indirizzo.citta}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            {text("chi_siamo", "studio_nota")}
          </p>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading title={text("chi_siamo", "recensioni_title")} />
        <div className="mt-12">
          <Reviews />
        </div>
      </Section>

      <CtaBand
        title={text("chi_siamo", "cta_finale_title")}
        button={finalButton}
        phone={finalPhone}
      />
    </>
  );
}
