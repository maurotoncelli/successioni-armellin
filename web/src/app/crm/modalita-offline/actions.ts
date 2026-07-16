"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import {
  SITE_OFFLINE_TAG,
  saveSiteOfflineState,
  type OfflinePreset,
  type SiteOfflineState,
} from "@/lib/site-offline";

export type OfflineActionResult = { ok: boolean; message: string };

export async function saveOfflineMode(
  _prev: OfflineActionResult | null,
  formData: FormData,
): Promise<OfflineActionResult> {
  await requireAdmin();

  const enabled = formData.get("enabled") === "1";
  const presetRaw = String(formData.get("preset") ?? "custom");
  const preset: OfflinePreset =
    presetRaw === "vacation" ||
    presetRaw === "maintenance" ||
    presetRaw === "custom"
      ? presetRaw
      : "custom";
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const reopenRaw = String(formData.get("reopenDate") ?? "").trim();
  const reopenDate = /^\d{4}-\d{2}-\d{2}$/.test(reopenRaw) ? reopenRaw : null;
  const showContactButtons = formData.get("showContactButtons") === "1";

  const payload: Omit<SiteOfflineState, "updatedAt"> = {
    enabled,
    preset,
    title,
    body,
    reopenDate,
    showContactButtons,
  };

  const res = await saveSiteOfflineState(payload);
  if (!res.ok) return { ok: false, message: res.error };

  // Invalidazione immediata (no stale) cosi il sito pubblico si aggiorna al volo.
  updateTag(SITE_OFFLINE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/crm/modalita-offline");
  revalidatePath("/crm");

  return {
    ok: true,
    message: enabled
      ? "Modalità offline attiva: il sito pubblico mostra solo il messaggio."
      : "Modalità offline disattivata: il sito è di nuovo online.",
  };
}
