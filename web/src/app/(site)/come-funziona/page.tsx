import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { CtaBand } from "@/components/site/cta-band";
import { cta, list, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Come funziona",
  description: text("come_funziona", "hero_subtitle"),
};

type Step = { numero: number; titolo: string; testo: string; dettaglio: string };

export default function ComeFunzionaPage() {
  const steps = list<Step>("come_funziona", "steps");
  const deliverable = list<string>("come_funziona", "deliverable_list");
  const finalButton = cta("come_funziona", "cta_button");
  const finalPhone = cta("come_funziona", "cta_phone");

  return (
    <>
      <PageHero
        eyebrow={text("come_funziona", "hero_eyebrow", "Il processo")}
        title={text("come_funziona", "hero_title")}
        subtitle={text("come_funziona", "hero_subtitle")}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
          {steps.map((step) => (
            <div key={step.numero} className="flex gap-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary font-display text-xl font-bold text-white">
                {step.numero}
              </span>
              <div>
                <h3 className="text-xl">{step.titolo}</h3>
                <p className="mt-2 leading-relaxed text-text-muted">
                  {step.testo}
                </p>
                <p className="mt-2 text-sm font-medium text-accent">
                  {step.dettaglio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="text-xl">{text("come_funziona", "sla_title")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {text("come_funziona", "sla_body")}
            </p>
          </Card>
          <Card>
            <h3 className="text-xl">{text("come_funziona", "valore_title")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {text("come_funziona", "valore_body")}
            </p>
          </Card>
        </div>
        <p className="mt-8 text-center leading-relaxed text-text-muted">
          {text("come_funziona", "distanza_body")}
        </p>
      </Section>

      <Section>
        <SectionHeading title={text("come_funziona", "deliverable_title")} />
        {/* w-fit: il blocco si centra sulla larghezza reale delle voci, cosi
            l'elenco risulta allineato al titolo centrato della sezione. */}
        <ul className="mx-auto mt-6 grid w-fit max-w-2xl gap-3 sm:mt-10">
          {deliverable.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check className="mt-1 h-5 w-5 shrink-0 text-success" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title={text("come_funziona", "cta_title")}
        button={finalButton}
        phone={finalPhone}
      />
    </>
  );
}
