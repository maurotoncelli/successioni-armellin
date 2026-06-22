"use client";

import { useState } from "react";
import { Check, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { PageHeading } from "@/components/area/ui";

export default function RecessoPage() {
  const [reason, setReason] = useState("");
  const [requested, setRequested] = useState(false);

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
        {!requested ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setRequested(true);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="reason" className="mb-1.5 block text-sm font-medium text-text">
                Motivo (facoltativo)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Se vuoi, raccontaci perché…"
                className="w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>
            <button type="submit" className={buttonClasses({ variant: "outline" })}>
              Richiedi recesso
            </button>
            <p className="text-xs text-text-muted">
              In alternativa puoi scrivere a{" "}
              <a href="mailto:studio@armellin.it" className="text-accent-dark hover:underline">
                studio@armellin.it
              </a>{" "}
              o via PEC.
            </p>
          </form>
        ) : (
          <div className="space-y-2">
            <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <div className="text-sm text-text">
                <p className="font-semibold">Richiesta inviata.</p>
                <p className="mt-0.5 text-text-muted">
                  Lorenzo ha ricevuto la tua richiesta e ti ricontatterà.
                  Stato: <strong>Inviata</strong> → In gestione → Esito.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
