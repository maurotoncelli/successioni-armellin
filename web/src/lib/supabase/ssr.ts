import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/*
  Client Supabase legato ai COOKIE della richiesta (Auth utente, ruolo CLIENT).
  Le letture rispettano la RLS in base alla sessione: un cliente vede solo i
  propri dati (@11). Usato dall'area personale (server components + server actions).
  Il refresh della sessione avviene nel proxy (vedi lib/supabase/middleware.ts).
*/

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isAuthConfigured = Boolean(url && anonKey);

export async function createServerSupabase() {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase Auth non configurato: imposta NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
  }
  const cookieStore = await cookies();
  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Chiamato da un Server Component in fase di render: i cookie verranno
          // aggiornati dal proxy. Si puo ignorare in sicurezza.
        }
      },
    },
  });
}
