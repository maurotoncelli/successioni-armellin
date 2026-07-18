import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { IbanForm } from "@/components/area/iban-form";
import { requireClientView } from "@/lib/area";
import { getSafeExtras } from "@/lib/practice-extras";
import { t, tObj } from "@/lib/locale";
import {
  CLAIM_UI_IT,
  IBAN_UI_IT,
  type ClaimUiLabels,
  type IbanUiLabels,
} from "@/lib/area-ui-labels";

export default async function DatiPage() {
  const view = await requireClientView();
  const [title, subtitle, emptyTitle, emptyBody, ibanUi, claimUi] =
    await Promise.all([
      t("area", "dati_title", "I tuoi dati"),
      t(
        "area",
        "dati_subtitle",
        "Alcuni dati aggiuntivi che ci servono per la pratica.",
      ),
      t("area", "empty_title", "Nessuna pratica collegata a questo accesso"),
      t(
        "area",
        "empty_body",
        "Se hai già pagato un preventivo, collega la pratica con l'email usata al checkout. Altrimenti calcola un preventivo dal sito.",
      ),
      tObj<IbanUiLabels>("area", "iban_ui", IBAN_UI_IT),
      tObj<ClaimUiLabels>("area", "claim_ui", CLAIM_UI_IT),
    ]);

  const practice = view.practice;
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

  return (
    <div>
      <PageHeading title={title} subtitle={subtitle} />
      <Card>
        <IbanForm
          initialLast4={extras.iban?.last4}
          clearedAt={extras.iban ? undefined : extras.ibanClearedAt}
          labels={ibanUi}
        />
      </Card>
    </div>
  );
}
