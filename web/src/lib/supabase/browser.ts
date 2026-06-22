"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/*
  Client Supabase per il BROWSER (area cliente). Serve a finalizzare il login
  dal Magic Link quando Supabase restituisce la sessione nel fragment dell'URL
  (#access_token=...): il server non puo leggere il fragment, quindi la sessione
  va impostata lato client. Scrive i cookie di sessione che poi il server legge.
*/

export function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // detectSessionInUrl: false -> la pagina di callback gestisce il token a mano,
  // evitando che il client consumi il "code" prima del nostro handler.
  return createBrowserClient<Database>(url, anonKey, {
    auth: { detectSessionInUrl: false, flowType: "pkce" },
  });
}
