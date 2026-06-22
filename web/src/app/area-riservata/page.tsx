"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { account } from "@/content/area-data";

export default function AreaLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary text-lg font-bold text-white">
            A
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-primary">
            Area Riservata
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Accedi per seguire la tua pratica di successione.
          </p>
        </div>

        <div className="rounded-2xl border border-primary/10 bg-bg p-6 shadow-sm">
          {!sent ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  La tua email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@email.it"
                    className="w-full rounded-[10px] border border-primary/20 bg-bg py-2.5 pl-9 pr-3 text-sm text-text focus:border-accent focus:outline-none"
                  />
                </div>
                <p className="mt-1.5 text-xs text-text-muted">
                  Usa l&apos;email con cui hai effettuato il pagamento.
                </p>
              </div>

              <button type="submit" className={buttonClasses({ className: "w-full" })}>
                Inviami il link di accesso
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
                <Mail className="h-6 w-6" />
              </span>
              <div>
                <p className="font-medium text-text">Controlla la tua email</p>
                <p className="mt-1 text-sm text-text-muted">
                  Ti abbiamo inviato un link di accesso a{" "}
                  <span className="font-medium text-text">
                    {email || account.email}
                  </span>
                  . Il link scade dopo 10 minuti.
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-sm font-medium text-accent-dark hover:underline"
              >
                Usa un&apos;altra email
              </button>
            </div>
          )}

          {/* Scorciatoia solo per il prototipo */}
          <div className="mt-5 border-t border-primary/10 pt-4">
            <Link
              href="/area-riservata/dashboard"
              className={buttonClasses({
                variant: "outline",
                className: "w-full",
              })}
            >
              Entra nella demo
            </Link>
            <p className="mt-2 text-center text-xs text-text-muted">
              Anteprima prototipo (senza login reale).
            </p>
          </div>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted">
          <ShieldCheck className="h-3.5 w-3.5" />
          Accesso sicuro · <Link href="/privacy" className="hover:underline">Privacy</Link> ·{" "}
          <Link href="/termini-condizioni" className="hover:underline">Termini</Link>
        </p>
      </div>
    </div>
  );
}
