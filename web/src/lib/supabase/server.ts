import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/*
  Client Supabase per LETTURE pubbliche (server-side).
  Usa la chiave anon: l'accesso ai dati e governato dalla RLS (solo record
  attivi/pubblicati sono leggibili). Usato dalle pagine statiche/ISR del sito.
*/

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export function getPublicClient() {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase non configurato: imposta NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
  }
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });
}
