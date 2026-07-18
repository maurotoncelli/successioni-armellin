import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ClaimPracticeForm } from "@/components/area/claim-practice-form";
import type { ClaimUiLabels } from "@/lib/area-ui-labels";

// Stato mostrato quando l'utente e loggato ma non risulta ancora collegato a una
// pratica (es. account creato prima del pagamento, oppure email non abbinata).
export function NoPracticeState({
  defaultEmail = "",
  title = "Nessuna pratica collegata a questo accesso",
  body = "Se hai già pagato un preventivo, collega la pratica con l'email usata al checkout. Altrimenti calcola un preventivo dal sito.",
  claimLabels,
}: {
  defaultEmail?: string;
  title?: string;
  body?: string;
  claimLabels?: ClaimUiLabels;
}) {
  return (
    <Card className="border-primary/15 bg-bg-muted text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
        <Inbox className="h-6 w-6" />
      </span>
      <p className="mt-3 font-medium text-text">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-text-muted">{body}</p>
      <ClaimPracticeForm defaultEmail={defaultEmail} labels={claimLabels} />
    </Card>
  );
}
