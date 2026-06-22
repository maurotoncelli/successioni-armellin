"use client";

import { useState } from "react";
import { FileSignature, Check, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { PageHeading } from "@/components/area/ui";
import { account } from "@/content/area-data";

export default function MandatoPage() {
  const [accepted, setAccepted] = useState(false);
  const [signed, setSigned] = useState(false);

  return (
    <div>
      <PageHeading
        title="Mandato e consensi"
        subtitle="Leggi e firma l'incarico: ci autorizza a procedere con la tua pratica."
      />

      <Card>
        <div className="max-h-72 overflow-y-auto rounded-lg border border-primary/10 bg-bg-muted p-4 text-sm leading-relaxed text-text-muted">
          <p className="font-semibold text-text">
            Mandato professionale - Pratica {account.practiceCode}
          </p>
          <p className="mt-2">
            Il/La sottoscritto/a {account.name} conferisce al Geom. Lorenzo
            Armellin l&apos;incarico di predisporre e trasmettere la dichiarazione
            di successione e gli adempimenti connessi, secondo il pacchetto
            acquistato.
          </p>
          <p className="mt-2">
            Il professionista opera con la supervisione fiscale di un
            commercialista. L&apos;onorario è quello indicato in &quot;Il tuo
            acquisto&quot;; le imposte di Stato sono separate e a carico
            dell&apos;erede.
          </p>
          <p className="mt-2">
            (Testo fac-simile per il prototipo: la versione definitiva sarà
            validata con il legale.)
          </p>
        </div>

        {!signed ? (
          <div className="mt-5 space-y-4">
            <label className="flex items-start gap-3 text-sm text-text">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-primary/30 text-accent focus:ring-accent"
              />
              Ho letto e accetto il mandato, le condizioni e l&apos;informativa
              privacy.
            </label>
            <button
              disabled={!accepted}
              onClick={() => setSigned(true)}
              className={buttonClasses()}
            >
              <FileSignature className="h-4 w-4" />
              Accetto e firmo
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <div className="text-sm text-text">
                <p className="font-semibold">Mandato firmato.</p>
                <p className="mt-0.5 text-text-muted">
                  Firma elettronica registrata (data, ora e dispositivo). Ti
                  abbiamo inviato una copia via email.
                </p>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-[10px] border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5">
              <Download className="h-4 w-4" />
              Scarica copia firmata
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
