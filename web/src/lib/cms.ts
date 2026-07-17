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
import { articles as fixtureArticles, type Article } from "@/content/articles";
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
  articles: "cms:articles",
} as const;

export type { Package, Addon, Faq, Article };

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
    // IMPORTANTE: la RLS pubblica vede SOLO is_active=true. Se Lorenzo spegne
    // tutti gli addon, il client anonimo riceve [] e NON dobbiamo ricadere sulle
    // fixture (altrimenti il blocco "Servizi aggiuntivi" resta visibile).
    // Con service_role leggiamo tutte le righe e distinguiamo:
    // - tabella popolata, zero attivi → [] (nascondi blocco)
    // - tabella vuota → fixture
    const client = isAdminConfigured ? getAdminClient() : getPublicClient();
    const { data, error } = await client
      .from("addons")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return fixtureAddons;
    return data.filter((row) => row.is_active).map(mapAddon);
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

/*
  Articoli della sezione Guide (/guide).
  Fonte attuale: fixture locali (`@/content/articles`). In Fase 4 diventeranno
  una tabella Supabase `articles` con identica forma: l'accesso resta qui, cosi
  le pagine non cambiano. Ordinati per data (in evidenza prima, poi recenti).
*/
function sortArticles(items: Article[]): Article[] {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

export async function getArticles(): Promise<Article[]> {
  return sortArticles(fixtureArticles);
}

export async function getArticle(slug: string): Promise<Article | null> {
  return fixtureArticles.find((a) => a.slug === slug) ?? null;
}

/* Articoli correlati: prima quelli indicati esplicitamente, poi stessa
   categoria; mai l'articolo stesso. Tagliati a `limit` (default 3). */
export async function getRelatedArticles(
  slug: string,
  limit = 3,
): Promise<Article[]> {
  const current = fixtureArticles.find((a) => a.slug === slug);
  if (!current) return [];
  const bySlug = new Map(fixtureArticles.map((a) => [a.slug, a]));
  const picked: Article[] = [];
  const seen = new Set<string>([slug]);

  for (const relSlug of current.related) {
    const rel = bySlug.get(relSlug);
    if (rel && !seen.has(rel.slug)) {
      picked.push(rel);
      seen.add(rel.slug);
    }
  }
  if (picked.length < limit) {
    for (const a of sortArticles(fixtureArticles)) {
      if (picked.length >= limit) break;
      if (!seen.has(a.slug) && a.categorySlug === current.categorySlug) {
        picked.push(a);
        seen.add(a.slug);
      }
    }
  }
  return picked.slice(0, limit);
}

/*
  Data di consegna prevista calcolata dallo SLA del pacchetto, a partire da una
  data (di norma il giorno del pagamento). Ritorna null se il pacchetto non ha
  uno SLA. Usata per popolare automaticamente `due_date` al pagamento.
*/
export async function slaDueDate(
  packageKey: string | null,
  fromDate: string,
): Promise<string | null> {
  if (!packageKey) return null;
  const pkg = (await getPackages()).find((p) => p.key === packageKey);
  if (!pkg?.slaDays) return null;
  const d = new Date(`${fromDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  d.setUTCDate(d.getUTCDate() + pkg.slaDays);
  return d.toISOString().slice(0, 10);
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

export async function getFaqsAdmin(): Promise<FaqRow[]> {
  if (!isAdminConfigured) {
    return fixtureFaqs.map((f, i) => ({
      id: `fixture-${i}`,
      locale: "it",
      question: f.question,
      answer: f.answer,
      category: f.category ?? null,
      sort_order: i,
      is_published: true,
      updated_at: new Date().toISOString(),
    }));
  }
  const { data, error } = await getAdminClient()
    .from("faqs")
    .select("*")
    .eq("locale", "it")
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
