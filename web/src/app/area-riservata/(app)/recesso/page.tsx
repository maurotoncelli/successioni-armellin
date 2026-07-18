import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { WithdrawalForm } from "@/components/area/withdrawal-form";
import { requireClientView } from "@/lib/area";
import { getSafeExtras } from "@/lib/practice-extras";
import { t, tObj } from "@/lib/locale";
import {
  CLAIM_UI_IT,
  WITHDRAWAL_UI_IT,
  type ClaimUiLabels,
  type WithdrawalUiLabels,
} from "@/lib/area-ui-labels";

export default async function RecessoPage() {
  const view = await requireClientView();
  const [
    title,
    subtitle,
    windowTitle,
    rule1,
    rule2,
    rule3,
    emptyTitle,
    emptyBody,
    withdrawalUi,
    claimUi,
  ] = await Promise.all([
    t("area", "recesso_title", "Richiesta di recesso"),
    t(
      "area",
      "recesso_subtitle",
      "Puoi richiedere il recesso finché la pratica non è completata.",
    ),
    t(
      "area",
      "recesso_window_title",
      "Sei entro i 14 giorni dalla conclusione del contratto.",
    ),
    t(
      "area",
      "recesso_rule_1",
      "Se non abbiamo ancora iniziato: rimborso integrale dell'onorario.",
    ),
    t(
      "area",
      "recesso_rule_2",
      "Se abbiamo iniziato ma non concluso: rimborso proporzionale al lavoro già svolto.",
    ),
    t(
      "area",
      "recesso_rule_3",
      "Se il servizio è già completato: il recesso non spetta (art. 59).",
    ),
    t("area", "empty_title", "Nessuna pratica collegata a questo accesso"),
    t(
      "area",
      "empty_body",
      "Se hai già pagato un preventivo, collega la pratica con l'email usata al checkout. Altrimenti calcola un preventivo dal sito.",
    ),
    tObj<WithdrawalUiLabels>("area", "withdrawal_ui", WITHDRAWAL_UI_IT),
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

  const { withdrawal } = await getSafeExtras(practice.id);

  return (
    <div>
      <PageHeading title={title} subtitle={subtitle} />

      {/* Stato finestra 14 giorni */}
      <Card className="border-primary/15 bg-bg-muted">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-text-muted">
            <p className="font-medium text-text">{windowTitle}</p>
            <ul className="mt-2 list-disc space-y-1 ps-4">
              <li>{rule1}</li>
              <li>{rule2}</li>
              <li>{rule3}</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <WithdrawalForm
          current={withdrawal}
          refunded={
            practice.paymentStatus === "REFUNDED" ||
            practice.paymentStatus === "PARTIALLY_REFUNDED"
          }
          labels={withdrawalUi}
        />
      </Card>
    </div>
  );
}
