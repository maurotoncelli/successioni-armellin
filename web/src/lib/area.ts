import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabase, isAuthConfigured } from "@/lib/supabase/ssr";
import { ensureProfile } from "@/lib/profiles";
import { mapPractice } from "@/lib/crm";
import type { Practice } from "@/content/crm-data";
import type { Account } from "@/lib/area-types";

/*
  Layer dati dell'AREA RISERVATA (cliente loggato).
  - La sessione arriva dai cookie (Supabase Auth). Le LETTURE delle pratiche
    passano dal client SSR autenticato: la RLS garantisce che il cliente veda
    SOLO le proprie (@11/@06).
  - Al primo accesso si "provisiona" il profilo (profiles) e lo si collega
    all'anagrafica (contacts) per email, via service_role.
  Le funzioni sono memoizzate per richiesta con cache() per evitare query doppie.
*/

export type { Account };

export type ClientView = {
  user: User;
  practice: Practice | null;
  account: Account;
};

export const getSessionUser = cache(async (): Promise<User | null> => {
  if (!isAuthConfigured) return null;
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
});

export const getClientView = cache(async (): Promise<ClientView | null> => {
  const user = await getSessionUser();
  if (!user) return null;

  await ensureProfile(user);

  // Lettura governata dalla RLS: solo le pratiche del cliente loggato.
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("practices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("[area] lettura pratiche:", error.message);

  const rows = data ?? [];
  // Priorita: pratica pagata ATTIVA -> qualsiasi attiva -> la piu recente
  // (anche annullata: resta visibile come storico, non sparisce).
  const isActive = (r: { status: string }) => r.status !== "ANNULLATA";
  const chosen =
    rows.find((r) => r.payment_status === "PAID" && isActive(r)) ??
    rows.find(isActive) ??
    rows[0] ??
    null;
  const practice = chosen ? mapPractice(chosen) : null;

  const account: Account = practice
    ? {
        name: practice.clientName,
        email: practice.clientEmail || user.email || "",
        phone: practice.clientPhone,
        practiceCode: practice.code,
      }
    : {
        name: user.email?.split("@")[0] ?? "Cliente",
        email: user.email ?? "",
        phone: "",
        practiceCode: "—",
      };

  return { user, practice, account };
});

// Da usare nei layout/pagine dell'area: forza il login se non c'e sessione.
export async function requireClientView(): Promise<ClientView> {
  const view = await getClientView();
  if (!view) redirect("/area-riservata");
  return view;
}
