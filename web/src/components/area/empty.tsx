import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ClaimPracticeForm } from "@/components/area/claim-practice-form";

// Stato mostrato quando l'utente e loggato ma non risulta ancora collegato a una
// pratica (es. account creato prima del pagamento, oppure email non abbinata).
export function NoPracticeState({ defaultEmail = "" }: { defaultEmail?: string }) {
  return (
    <Card className="border-primary/15 bg-bg-muted text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
        <Inbox className="h-6 w-6" />
      </span>
      <p className="mt-3 font-medium text-text">
        Nessuna pratica collegata a questo accesso
      </p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-text-muted">
        L&apos;area si attiva dopo il pagamento. Se hai già pagato, accedi con la{" "}
        <strong className="font-medium text-primary">
          stessa email dell&apos;acquisto
        </strong>{" "}
        (c&apos;è anche un link diretto nell&apos;email di conferma pagamento),
        oppure collega la pratica qui sotto.
      </p>
      <ClaimPracticeForm defaultEmail={defaultEmail} />
    </Card>
  );
}
