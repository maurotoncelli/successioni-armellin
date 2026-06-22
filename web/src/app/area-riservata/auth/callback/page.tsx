"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

/*
  Atterraggio del Magic Link / OTP. Gira nel BROWSER perche Supabase puo
  restituire la sessione in tre modi e solo il client li vede tutti:
   - "#access_token=...&refresh_token=..."  (flusso implicito, nel fragment)
   - "?code=..."                            (flusso PKCE)
   - "?token_hash=&type="                   (template TokenHash)
  Impostata la sessione (cookie), si redirige nell'area. Gli errori tornano
  alla pagina di login con un messaggio leggibile.
*/

function fail(message: string) {
  return `/area-riservata?error=${encodeURIComponent(message)}`;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const ran = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      const supabase = createBrowserSupabase();
      const url = new URL(window.location.href);
      const next =
        url.searchParams.get("next") ?? "/area-riservata/dashboard";

      const providerError =
        url.searchParams.get("error_description") ??
        url.searchParams.get("error");
      if (providerError) {
        router.replace(fail(providerError));
        return;
      }

      const hash = new URLSearchParams(
        window.location.hash.replace(/^#/, ""),
      );
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash");
      const type = (url.searchParams.get("type") as EmailOtpType | null) ??
        "email";

      try {
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (tokenHash) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          });
          if (error) throw error;
        } else {
          router.replace(fail("link"));
          return;
        }
        // Hard navigation: il server deve rileggere i cookie di sessione appena scritti.
        window.location.replace(next);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "link";
        setError(msg);
        router.replace(fail(msg));
      }
    })();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        {!error && <Loader2 className="h-4 w-4 animate-spin" />}
        {error ? "Accesso non riuscito, ti reindirizzo…" : "Accesso in corso…"}
      </div>
    </div>
  );
}
