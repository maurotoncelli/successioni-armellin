"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { login, type LoginResult } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginResult, FormData>(
    login,
    null,
  );

  return (
    <form action={action} className="mt-5 space-y-3">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Password"
          className="w-full rounded-lg border border-crm-border bg-crm-bg2 px-3 py-2.5 text-sm text-crm-text placeholder:text-crm-muted focus:border-crm-accent focus:outline-none"
        />
      </div>

      {state?.error && (
        <p className="text-xs text-crm-rose">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg crm-gradient px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
        Accedi
      </button>
    </form>
  );
}
