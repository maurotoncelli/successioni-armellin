import { getPublicClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import {
  packages as fixturePackages,
  addons as fixtureAddons,
  faqs as fixtureFaqs,
  type Package,
  type Addon,
  type Faq,
} from "@/content/site";
import type { PackageRow, AddonRow, FaqRow } from "@/lib/supabase/types";

/*
  Layer di accesso ai contenuti CMS (pacchetti, add-on, FAQ).
  - Se Supabase e configurato legge dal database (con cache + tag per ISR on-demand).
  - Altrimenti (o in caso di errore/tabelle vuote) ripiega sulle fixture locali,
    cosi il sito continua a funzionare anche prima dell'attivazione del database.
*/

export const CMS_TAGS = {
  packages: "cms:packages",
  addons: "cms:addons",
  faqs: "cms:faqs",
} as const;

export type { Package, Addon, Faq };

function mapPackage(row: PackageRow): Package {
  return {
    key: row.key,
    name: row.name,
    tagline: row.tagline ?? "",
    description: row.description,
    features: Array.isArray(row.features) ? row.features : [],
    price: Number(row.price),
    extraPropertyFee:
      row.extra_property_fee === null ? null : Number(row.extra_property_fee),
    slaDays: row.sla_days === null ? null : Number(row.sla_days),
    badge: row.badge,
    sortOrder: row.sort_order,
  };
}

function mapAddon(row: AddonRow): Addon {
  return {
    key: row.key,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price),
  };
}

function mapFaq(row: FaqRow): Faq {
  return {
    question: row.question,
    answer: row.answer,
    category: row.category ?? "",
  };
}

export async function getPackages(): Promise<Package[]> {
  if (!isSupabaseConfigured) return fixturePackages;
  try {
    const { data, error } = await getPublicClient()
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return fixturePackages;
    return data.map(mapPackage);
  } catch (err) {
    console.error("[cms] getPackages fallback su fixture:", err);
    return fixturePackages;
  }
}

export async function getAddons(): Promise<Addon[]> {
  if (!isSupabaseConfigured) return fixtureAddons;
  try {
    const { data, error } = await getPublicClient()
      .from("addons")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return fixtureAddons;
    return data.map(mapAddon);
  } catch (err) {
    console.error("[cms] getAddons fallback su fixture:", err);
    return fixtureAddons;
  }
}

export async function getFaqs(): Promise<Faq[]> {
  if (!isSupabaseConfigured) return fixtureFaqs;
  try {
    const { data, error } = await getPublicClient()
      .from("faqs")
      .select("*")
      .eq("is_published", true)
      .eq("locale", "it")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return fixtureFaqs;
    return data.map(mapFaq);
  } catch (err) {
    console.error("[cms] getFaqs fallback su fixture:", err);
    return fixtureFaqs;
  }
}

/* --- Letture ADMIN (non cache): includono i record non attivi, per l'editor CRM --- */

export async function getPackagesAdmin(): Promise<PackageRow[]> {
  if (!isAdminConfigured) {
    return fixturePackages.map((p) => ({
      key: p.key,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      features: p.features,
      price: p.price,
      extra_property_fee: p.extraPropertyFee,
      sla_days: p.slaDays,
      badge: p.badge,
      sort_order: p.sortOrder,
      is_active: true,
      updated_at: new Date().toISOString(),
    }));
  }
  const { data, error } = await getAdminClient()
    .from("packages")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getAddonsAdmin(): Promise<AddonRow[]> {
  if (!isAdminConfigured) {
    return fixtureAddons.map((a, i) => ({
      key: a.key,
      name: a.name,
      description: a.description,
      price: a.price,
      is_active: true,
      sort_order: i + 1,
      updated_at: new Date().toISOString(),
    }));
  }
  const { data, error } = await getAdminClient()
    .from("addons")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
