import "server-only";
import { unstable_cache } from "next/cache";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { DOC_BUCKET, ensureDocBucket } from "@/lib/documents";
import {
  DEFAULT_OFFLINE_STATE,
  type OfflinePreset,
  type SiteOfflineState,
} from "@/lib/site-offline-shared";

export type { OfflinePreset, SiteOfflineState };
export { DEFAULT_OFFLINE_STATE, OFFLINE_PRESETS } from "@/lib/site-offline-shared";

/*
  Modalita offline del sito pubblico (vacanza / manutenzione / messaggio custom).
  NO-DDL: JSON privato in Storage `practice-docs/site/_offline.json`.
  Non tocca area personale ne CRM: solo il layout `(site)`.
*/

export const SITE_OFFLINE_TAG = "site:offline";

const STORAGE_PATH = "site/_offline.json";

function normalize(raw: unknown): SiteOfflineState {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_OFFLINE_STATE };
  const o = raw as Partial<SiteOfflineState>;
  const preset: OfflinePreset =
    o.preset === "vacation" || o.preset === "maintenance" || o.preset === "custom"
      ? o.preset
      : "vacation";
  return {
    enabled: Boolean(o.enabled),
    preset,
    title:
      typeof o.title === "string" && o.title.trim()
        ? o.title.trim()
        : DEFAULT_OFFLINE_STATE.title,
    body:
      typeof o.body === "string" && o.body.trim()
        ? o.body.trim()
        : DEFAULT_OFFLINE_STATE.body,
    reopenDate:
      typeof o.reopenDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.reopenDate)
        ? o.reopenDate
        : null,
    showContactButtons: o.showContactButtons !== false,
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : null,
  };
}

async function readOfflineFromStorage(): Promise<SiteOfflineState> {
  if (!isAdminConfigured) return { ...DEFAULT_OFFLINE_STATE };
  try {
    const admin = getAdminClient();
    const { data, error } = await admin.storage
      .from(DOC_BUCKET)
      .download(STORAGE_PATH);
    if (error || !data) return { ...DEFAULT_OFFLINE_STATE };
    return normalize(JSON.parse(await data.text()));
  } catch (err) {
    console.error("[site-offline] read:", err);
    return { ...DEFAULT_OFFLINE_STATE };
  }
}

/** Lettura cache-ata per il sito pubblico (invalidata al salvataggio CRM). */
export function getSiteOfflineState(): Promise<SiteOfflineState> {
  return unstable_cache(readOfflineFromStorage, ["site-offline-v1"], {
    tags: [SITE_OFFLINE_TAG],
    revalidate: 300,
  })();
}

/** Lettura fresca per il CRM (force-dynamic). */
export async function getSiteOfflineStateFresh(): Promise<SiteOfflineState> {
  return readOfflineFromStorage();
}

export async function saveSiteOfflineState(
  input: Omit<SiteOfflineState, "updatedAt">,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isAdminConfigured) {
    return { ok: false, error: "Database non collegato." };
  }
  const title = input.title.trim();
  const body = input.body.trim();
  if (input.enabled && (!title || !body)) {
    return {
      ok: false,
      error: "Titolo e messaggio sono obbligatori quando la modalità è attiva.",
    };
  }

  const state: SiteOfflineState = normalize({
    ...input,
    title: title || DEFAULT_OFFLINE_STATE.title,
    body: body || DEFAULT_OFFLINE_STATE.body,
    updatedAt: new Date().toISOString(),
  });

  try {
    const admin = getAdminClient();
    await ensureDocBucket(admin);
    const blob = Buffer.from(JSON.stringify(state), "utf8");
    const { error } = await admin.storage.from(DOC_BUCKET).upload(STORAGE_PATH, blob, {
      contentType: "application/json",
      upsert: true,
    });
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    console.error("[site-offline] save:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Salvataggio non riuscito.",
    };
  }
}
