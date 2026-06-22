import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PreventivoForm } from "@/components/site/preventivo-form";
import { cta, list, text } from "@/lib/content";

export const metadata: Metadata = {
  title: "Calcola il preventivo gratis",
  description: text("preventivo", "intro_subtitle"),
};

export default function PreventivoPage() {
  const stepTitles = [
    text("preventivo", "step1_title", "Partiamo dalle basi"),
    text("preventivo", "step2_title", "Chi sono gli eredi"),
    text("preventivo", "step3_title", "Cosa fa parte dell'eredita"),
    text("preventivo", "step4_title", "Dove ti mandiamo il preventivo"),
  ];

  return (
    <div className="bg-bg-muted py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl">
            {text("preventivo", "intro_title")}
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            {text("preventivo", "intro_subtitle")}
          </p>
        </div>

        <div className="mt-10">
          <PreventivoForm
            stepTitles={stepTitles}
            progressLabel={text("preventivo", "progress_label", "Passo {n} di 4")}
            consensoPrivacy={text("preventivo", "consenso_privacy")}
            consensoMarketing={text("preventivo", "consenso_marketing")}
            submitLabel={
              cta("preventivo", "cta_submit", {
                label: "Invia e ricevi il preventivo gratuito",
                href: "#",
              }).label
            }
            trustItems={list<string>("preventivo", "trust_items")}
          />
        </div>
      </Container>
    </div>
  );
}
