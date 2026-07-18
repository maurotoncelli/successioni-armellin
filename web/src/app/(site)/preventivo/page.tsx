import type { Metadata } from "next";
import { t, tCta, tList, tObj } from "@/lib/locale";
import { Container } from "@/components/ui/container";
import { PreventivoForm } from "@/components/site/preventivo-form";
import {
  PREVENTIVO_UI_IT,
  type PreventivoUiLabels,
} from "@/lib/site-ui-labels";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await t(
      "preventivo",
      "intro_title",
      "Calcola il preventivo gratis",
    ),
    description: await t("preventivo", "intro_subtitle"),
  };
}

export default async function PreventivoPage() {
  const [step1, step2, step3, progressLabel, submitCta, trustItems, ui] =
    await Promise.all([
      t("preventivo", "step1_title", "Partiamo dalle basi"),
      t("preventivo", "step2_title", "Chi sono gli eredi"),
      t("preventivo", "step3_title", "Cosa fa parte dell'eredità"),
      t("preventivo", "progress_label", "Passo {n} di 3"),
      tCta("preventivo", "cta_submit", {
        label: "Vedi subito il risultato",
        href: "#",
      }),
      tList<string>("preventivo", "trust_items"),
      tObj<PreventivoUiLabels>("site_ui", "preventivo_ui", PREVENTIVO_UI_IT),
    ]);

  return (
    <div className="bg-bg-muted py-10 sm:py-14 lg:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl">
            {await t("preventivo", "intro_title")}
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            {await t("preventivo", "intro_subtitle")}
          </p>
        </div>

        <div className="mt-6 sm:mt-10">
          <PreventivoForm
            stepTitles={[step1, step2, step3]}
            progressLabel={progressLabel}
            submitLabel={submitCta.label}
            trustItems={trustItems}
            ui={ui}
          />
        </div>
      </Container>
    </div>
  );
}
