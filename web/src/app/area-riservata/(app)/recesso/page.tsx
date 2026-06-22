import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/area/ui";
import { NoPracticeState } from "@/components/area/empty";
import { WithdrawalForm } from "@/components/area/withdrawal-form";
import { requireClientView } from "@/lib/area";
import { getSafeExtras } from "@/lib/practice-extras";

export default async function RecessoPage() {
  const { practice } = await requireClientView();
  if (!practice) {
    return (
      <div>
        <PageHeading
          title="Richiesta di recesso"
          subtitle="Puoi richiedere il recesso finché la pratica non è completata."
        />
        <NoPracticeState />
      </div>
    );
  }

  const { withdrawal } = await getSafeExtras(practice.id);

  return (
    <div>
      <PageHeading
        title="Richiesta di recesso"
        subtitle="Puoi richiedere il recesso finché la pratica non è completata."
      />

      {/* Stato finestra 14 giorni */}
      <Card className="border-primary/15 bg-bg-muted">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-text-muted">
            <p className="font-medium text-text">
              Sei entro i 14 giorni dalla conclusione del contratto.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Se non abbiamo ancora iniziato: rimborso integrale dell&apos;onorario.</li>
              <li>Se abbiamo iniziato ma non concluso: rimborso proporzionale al lavoro già svolto.</li>
              <li>Se il servizio è già completato: il recesso non spetta (art. 59).</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <WithdrawalForm current={withdrawal} />
      </Card>
    </div>
  );
}
