"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { account } from "@/content/area-data";
import { cn } from "@/lib/utils";

export default function AreaLoginPage() {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const isEmail = method === "email";

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
              {/* Scelta metodo: email o telefono */}
              <div className="grid grid-cols-2 gap-1 rounded-[10px] bg-bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setMethod("email")}
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 rounded-[8px] py-2 text-sm font-medium transition-colors",
                    isEmail ? "bg-bg text-primary shadow-sm" : "text-text-muted",
                  )}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("phone")}
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 rounded-[8px] py-2 text-sm font-medium transition-colors",
                    !isEmail ? "bg-bg text-primary shadow-sm" : "text-text-muted",
                  )}
                >
                  <Phone className="h-4 w-4" />
                  Telefono
                </button>
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  {isEmail ? "La tua email" : "Il tuo numero di telefono"}
                </label>
                <div className="relative">
                  {isEmail ? (
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  ) : (
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  )}
                  <input
                    id="contact"
                    type={isEmail ? "email" : "tel"}
                    required
                    value={isEmail ? email : phone}
                    onChange={(e) =>
                      isEmail ? setEmail(e.target.value) : setPhone(e.target.value)
                    }
                    placeholder={isEmail ? "nome@email.it" : "+39 333 1234567"}
                    className="w-full rounded-[10px] border border-primary/20 bg-bg py-2.5 pl-9 pr-3 text-sm text-text focus:border-accent focus:outline-none"
                  />
                </div>
                <p className="mt-1.5 text-xs text-text-muted">
                  {isEmail
                    ? "Usa l'email con cui hai effettuato il pagamento."
                    : "Ti invieremo un codice via SMS."}
                </p>
              </div>

              <button type="submit" className={buttonClasses({ className: "w-full" })}>
                {isEmail ? "Inviami il link di accesso" : "Inviami il codice SMS"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
                {isEmail ? <Mail className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
              </span>
              <div>
                <p className="font-medium text-text">
                  {isEmail ? "Controlla la tua email" : "Controlla i tuoi SMS"}
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  {isEmail ? (
                    <>
                      Ti abbiamo inviato un link di accesso a{" "}
                      <span className="font-medium text-text">
                        {email || account.email}
                      </span>
                      . Il link scade dopo 10 minuti.
                    </>
                  ) : (
                    <>
                      Ti abbiamo inviato un codice a{" "}
                      <span className="font-medium text-text">
                        {phone || account.phone}
                      </span>
                      . Il codice scade dopo 10 minuti.
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-sm font-medium text-accent-dark hover:underline"
              >
                {isEmail ? "Usa un'altra email" : "Usa un altro numero"}
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
