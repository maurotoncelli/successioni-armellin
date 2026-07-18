import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { MandateForm } from "@/components/area/mandate-form";
import { requireClientView } from "@/lib/area";
import { getSafeExtras } from "@/lib/practice-extras";
import { buildMandatoParagraphs, buildMandatoText } from "@/content/mandato";
import { getRequestLocale, t, tObj } from "@/lib/locale";
import {
  CLAIM_UI_IT,
  MANDATE_UI_IT,
  fillTemplate,
  type ClaimUiLabels,
  type MandateUiLabels,
} from "@/lib/area-ui-labels";

export default async function MandatoPage() {
  const view = await requireClientView();
  const locale = await getRequestLocale();
  const [title, subtitle, emptyTitle, emptyBody, mandateUi, claimUi, langNote] =
    await Promise.all([
      t("area", "mandato_title", "Mandato e consensi"),
      t(
        "area",
        "mandato_subtitle",
        "Leggi e firma il mandato professionale per la tua pratica.",
      ),
      t("area", "empty_title", "Nessuna pratica collegata a questo accesso"),
      t(
        "area",
        "empty_body",
        "Se hai già pagato un preventivo, collega la pratica con l'email usata al checkout. Altrimenti calcola un preventivo dal sito.",
      ),
      tObj<MandateUiLabels>("area", "mandate_ui", MANDATE_UI_IT),
      tObj<ClaimUiLabels>("area", "claim_ui", CLAIM_UI_IT),
      t(
        "area",
        "mandato_lang_note",
        "La versione italiana del mandato fa fede. La traduzione è solo di cortesia; il file scaricato per la firma resta in italiano.",
      ),
    ]);

  const { practice, account } = view;
  if (!practice) {
    return (
      <div>
        <PageHeading title={title} subtitle={subtitle} />
        <NoPracticeState
          defaultEmail={view.user.email ?? ""}
          title={emptyTitle}
          body={emptyBody}
          claimLabels={claimUi}
        />
      </div>
    );
  }

  const extras = await getSafeExtras(practice.id);
  const mandatoParams = {
    practiceCode: account.practiceCode,
    signerName: account.name,
  };
  const paragraphs = buildMandatoParagraphs(mandatoParams, locale);
  const isAr = locale === "ar";
  const isCourtesy = locale === "ar" || locale === "en";

  return (
    <div>
      <PageHeading title={title} subtitle={subtitle} />

      <Card>
        {isCourtesy && (
          <p className="mb-4 rounded-lg border border-accent/25 bg-sand px-3 py-2 text-sm text-primary">
            {langNote}
          </p>
        )}
        <div
          className="max-h-72 overflow-y-auto rounded-lg border border-primary/10 bg-bg-muted p-4 text-sm leading-relaxed text-text-muted"
          dir={isAr ? "rtl" : "ltr"}
          lang={isAr ? "ar" : locale === "en" ? "en" : "it"}
        >
          <p className="font-semibold text-text">
            {fillTemplate(mandateUi.heading, { code: account.practiceCode })}
          </p>
          {paragraphs.map((para, i) => (
            <p key={i} className="mt-2">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-5">
          <MandateForm
            signerName={account.name}
            practiceCode={account.practiceCode}
            mandateText={buildMandatoText(mandatoParams)}
            initial={extras.mandate}
            labels={mandateUi}
          />
        </div>
      </Card>
    </div>
  );
}
