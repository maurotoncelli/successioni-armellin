"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { claimPracticeByCode } from "@/app/area-riservata/(app)/claim/actions";
import { Button } from "@/components/ui/button";

export function ClaimPracticeForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState<string | null>(null);
  const [needsEmail, setNeedsEmail] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNeedsEmail(null);
    startTransition(async () => {
      const res = await claimPracticeByCode(code, email);
      if (res.ok) {
        router.refresh();
        return;
      }
      setError(res.error);
      if (res.needsEmail) setNeedsEmail(res.needsEmail);
    });
  }

  return (
    <form
      onSubmit={submit}
      className="mt-6 rounded-2xl border border-primary/15 bg-bg p-5 text-left"
    >
      <p className="text-sm font-medium text-primary">
        Hai già una pratica? Collega questo accesso
      </p>
      <p className="mt-1 text-xs text-text-muted">
        Inserisci il codice pratica (es. SUC-2026-0022) e l&apos;email usata per
        il pagamento o per il preventivo. Deve coincidere con l&apos;email di
        questo login.
      </p>

      <label className="mt-4 block text-sm font-medium text-primary">
        Codice pratica
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="SUC-2026-0000"
          autoComplete="off"
          className="mt-1.5 w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
          required
        />
      </label>

      <label className="mt-3 block text-sm font-medium text-primary">
        Email dell&apos;acquisto / preventivo
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
          required
        />
      </label>

      {error && (
        <p className="mt-3 rounded-[10px] bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      {needsEmail && (
        <p className="mt-2 text-xs text-text-muted">
          Esci da questo account e accedi con{" "}
          <strong className="text-primary">{needsEmail}</strong> (usa il link
          nell&apos;email di pagamento, oppure richiedi un nuovo magic link dalla
          pagina di login).
        </p>
      )}

      <Button type="submit" disabled={pending} className="mt-4 w-full" size="lg">
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Collegamento…
          </>
        ) : (
          "Collega la pratica"
        )}
      </Button>
    </form>
  );
}
