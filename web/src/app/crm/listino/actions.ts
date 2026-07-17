"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { PackageKey } from "@/lib/supabase/types";

/*
  Server action del mini-CMS: scrivono via service_role (admin) e invalidano la
  cache delle pagine pubbliche (revalidate on-demand), cosi il sito si aggiorna
  subito dopo "Salva e pubblica".
*/

export type ActionResult = { ok: boolean; message: string };

function numOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = String(v).trim();
  if (s === "") return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

const PACKAGE_KEYS: PackageKey[] = ["SEMPLICE", "COMPLETO", "ZERO_STRESS"];

export async function savePackage(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isAdminConfigured) {
    return { ok: false, message: "Database non collegato: configura Supabase in .env.local." };
  }

  const key = String(formData.get("key") ?? "") as PackageKey;
  if (!PACKAGE_KEYS.includes(key)) {
    return { ok: false, message: "Pacchetto non valido." };
  }

  const price = numOrNull(formData.get("price"));
  if (price === null) {
    return { ok: false, message: "Il prezzo e obbligatorio." };
  }

  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const update = {
    name: String(formData.get("name") ?? "").trim(),
    tagline: strOrNull(formData.get("tagline")),
    description: String(formData.get("description") ?? "").trim(),
    features,
    price,
    extra_property_fee: numOrNull(formData.get("extra_property_fee")),
    sla_days: numOrNull(formData.get("sla_days")),
    badge: strOrNull(formData.get("badge")),
    sort_order: numOrNull(formData.get("sort_order")) ?? 0,
    is_active: formData.get("is_active") === "on",
  };

  const { error } = await getAdminClient()
    .from("packages")
    .update(update)
    .eq("key", key);

  if (error) {
    return { ok: false, message: `Errore: ${error.message}` };
  }

  revalidatePath("/tariffe");
  revalidatePath("/");
  revalidatePath("/crm/listino");
  return { ok: true, message: "Salvato e pubblicato." };
}

export async function saveAddon(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isAdminConfigured) {
    return { ok: false, message: "Database non collegato: configura Supabase in .env.local." };
  }

  const key = String(formData.get("key") ?? "").trim();
  if (!key) {
    return { ok: false, message: "Add-on non valido." };
  }

  const price = numOrNull(formData.get("price"));
  if (price === null) {
    return { ok: false, message: "Il prezzo e obbligatorio." };
  }

  const update = {
    name: String(formData.get("name") ?? "").trim(),
    description: strOrNull(formData.get("description")),
    price,
    sort_order: numOrNull(formData.get("sort_order")) ?? 0,
    is_active: formData.get("is_active") === "on",
  };

  const { error } = await getAdminClient()
    .from("addons")
    .update(update)
    .eq("key", key);

  if (error) {
    return { ok: false, message: `Errore: ${error.message}` };
  }

  revalidatePath("/tariffe");
  revalidatePath("/");
  revalidatePath("/crm/listino");
  return { ok: true, message: "Salvato e pubblicato." };
}

/* --- FAQ (domande frequenti) ------------------------------------------------ */

function faqFields(formData: FormData) {
  return {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    category: strOrNull(formData.get("category")),
    sort_order: numOrNull(formData.get("sort_order")) ?? 0,
    is_published: formData.get("is_published") === "on",
  };
}

function revalidateFaqs() {
  revalidatePath("/faq");
  revalidatePath("/");
  revalidatePath("/crm/listino");
}

export async function saveFaq(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isAdminConfigured) {
    return { ok: false, message: "Database non collegato: configura Supabase in .env.local." };
  }
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "FAQ non valida." };

  const fields = faqFields(formData);
  if (!fields.question || !fields.answer) {
    return { ok: false, message: "Domanda e risposta sono obbligatorie." };
  }

  const { error } = await getAdminClient()
    .from("faqs")
    .update(fields)
    .eq("id", id);

  if (error) return { ok: false, message: `Errore: ${error.message}` };
  revalidateFaqs();
  return { ok: true, message: "Salvato e pubblicato." };
}

export async function createFaq(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isAdminConfigured) {
    return { ok: false, message: "Database non collegato: configura Supabase in .env.local." };
  }
  const fields = faqFields(formData);
  if (!fields.question || !fields.answer) {
    return { ok: false, message: "Domanda e risposta sono obbligatorie." };
  }

  const { error } = await getAdminClient()
    .from("faqs")
    .insert({ ...fields, locale: "it" });

  if (error) return { ok: false, message: `Errore: ${error.message}` };
  revalidateFaqs();
  return { ok: true, message: "FAQ aggiunta." };
}

export async function deleteFaq(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isAdminConfigured) {
    return { ok: false, message: "Database non collegato." };
  }
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "FAQ non valida." };

  const { error } = await getAdminClient().from("faqs").delete().eq("id", id);
  if (error) return { ok: false, message: `Errore: ${error.message}` };
  revalidateFaqs();
  return { ok: true, message: "FAQ eliminata." };
}
