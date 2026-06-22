import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/*
  Client Supabase ADMIN (solo server): usa la service_role key e BYPASSA la RLS.
  Da usare esclusivamente nelle server action del CRM (scritture, lettura draft).
  L'import di "server-only" garantisce che non finisca mai in un bundle client.
*/

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isAdminConfigured = Boolean(url && serviceKey);

export function getAdminClient() {
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin non configurato: imposta NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
