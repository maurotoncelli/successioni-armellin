"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { CONSENT_KEY, updateConsent, type ConsentChoice } from "@/lib/analytics";

/*
  Banner consensi cookie (CMP minimale). Mostra il banner finche l'utente non
  sceglie; salva la scelta in localStorage e aggiorna il Consent Mode di GA4.
  "Accetta" -> granted, "Solo necessari" -> denied (default, GA resta spento).
  Il link "Preferenze cookie" nel footer riapre il banner (evento custom) per
  permettere di modificare/revocare il consenso in ogni momento (GDPR art. 7.3).
*/

export const REOPEN_CONSENT_EVENT = "cookie-preferences:open";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let show = true;
    try {
      show = !localStorage.getItem(CONSENT_KEY);
    } catch {
      show = true;
    }
    // localStorage e disponibile solo dopo il mount (lato client): aggiornamento intenzionale.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(show);

    const reopen = () => setVisible(true);
    window.addEventListener(REOPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_CONSENT_EVENT, reopen);
  }, []);

  function choose(choice: ConsentChoice) {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {}
    updateConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-primary/15 bg-bg p-4 shadow-lg sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Cookie className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 text-sm text-text-muted">
            <p>
              Usiamo cookie tecnici (necessari) e, con il tuo consenso, cookie di
              statistica per migliorare il sito. Puoi accettare o rifiutare quelli
              non necessari.{" "}
              <Link
                href="/cookie-policy"
                className="font-medium text-primary underline underline-offset-2"
              >
                Cookie policy
              </Link>
              .
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => choose("granted")}
                className={buttonClasses({ className: "py-2 text-sm" })}
              >
                Accetta tutti
              </button>
              <button
                onClick={() => choose("denied")}
                className={buttonClasses({
                  variant: "outline",
                  className: "py-2 text-sm",
                })}
              >
                Solo necessari
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
