"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileSignature,
  Check,
  Download,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { signMandate } from "@/app/area-riservata/(app)/mandato/actions";
import type { SafeExtras } from "@/lib/practice-extras";

type MandateState = SafeExtras["mandate"];

export function MandateForm({
  signerName,
  practiceCode,
  initial,
}: {
  signerName: string;
  practiceCode: string;
  initial: MandateState;
}) {
  const router = useRouter();
  const [mandate, setMandate] = useState<MandateState>(initial);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mandateText = `MANDATO PROFESSIONALE - Pratica ${practiceCode}

Il/La sottoscritto/a ${signerName} conferisce al Geom. Lorenzo Armellin l'incarico
di predisporre e trasmettere la dichiarazione di successione e gli adempimenti
connessi, secondo il pacchetto acquistato.

Il professionista opera con la supervisione fiscale di un commercialista.
L'onorario e quello indicato in "Il tuo acquisto"; le imposte di Stato sono
separate e a carico dell'erede.

(Testo fac-simile per il prototipo: la versione definitiva sara validata con il legale.)
`;

  function downloadBlank() {
    const blob = new Blob([mandateText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mandato-${practiceCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function eSign() {
    setError(null);
    startTransition(async () => {
      const res = await signMandate();
      if (res.ok) {
        setMandate({
          method: "ELECTRONIC",
          signerName,
          signedAt: new Date().toISOString(),
          hasFile: false,
        });
        router.refresh();
      } else setError(res.error);
    });
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("File troppo grande (massimo 10 MB).");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/area/mandate/upload", { method: "POST", body });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Caricamento non riuscito.");
        return;
      }
      setMandate({
        method: "PAPER",
        signerName,
        signedAt: new Date().toISOString(),
        hasFile: true,
      });
      router.refresh();
    } catch {
      setError("Caricamento non riuscito, controlla la connessione.");
    } finally {
      setUploading(false);
    }
  }

  if (mandate) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <div className="text-sm text-text">
            <p className="font-semibold">Mandato firmato.</p>
            <p className="mt-0.5 text-text-muted">
              {mandate.method === "PAPER"
                ? "Mandato cartaceo firmato ricevuto."
                : "Firma elettronica registrata (data e ora)."}{" "}
              Grazie, possiamo procedere con la tua pratica.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={onFileChange}
      />

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <label className="flex items-start gap-3 text-sm text-text">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-primary/30 text-accent focus:ring-accent"
        />
        Ho letto e accetto il mandato, le condizioni e l&apos;informativa privacy.
      </label>
      <button disabled={!accepted || pending} onClick={eSign} className={buttonClasses()}>
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSignature className="h-4 w-4" />
        )}
        Accetto e firmo online
      </button>

      <div className="rounded-lg border border-primary/10 bg-bg-muted p-4">
        <p className="text-sm font-medium text-text">Preferisci la firma cartacea?</p>
        <p className="mt-0.5 text-sm text-text-muted">
          Scarica il mandato, firmalo a mano e ricaricalo: per noi va benissimo.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={downloadBlank}
            className="inline-flex items-center gap-2 rounded-[10px] border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
          >
            <Download className="h-4 w-4" />
            Scarica il mandato
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-[10px] border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Carica il mandato firmato
          </button>
        </div>
      </div>
    </div>
  );
}
