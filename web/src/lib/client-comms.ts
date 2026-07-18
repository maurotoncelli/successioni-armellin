import "server-only";
import { revalidatePath } from "next/cache";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { Communication } from "@/content/crm-data";

/**
 * Gli stamp CRM vengono da `toISOString().slice(0,16).replace("T"," ")`
 * quindi sono orari UTC senza suffisso. Senza "Z", Date.parse li tratta
 * come locali e il confronto con comms_seen_at (ISO UTC) sballa.
 */
export function parseCommStamp(raw: string): number {
  const s = (raw ?? "").trim();
  if (!s) return 0;
  if (/Z|[+-]\d{2}:?\d{2}$/.test(s)) {
    const t = Date.parse(s);
    return Number.isFinite(t) ? t : 0;
  }
  let normalized = s.includes("T") ? s : s.replace(" ", "T");
  // "YYYY-MM-DDTHH:mm" -> aggiungi secondi
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalized)) {
    normalized = `${normalized}:00`;
  }
  const t = Date.parse(`${normalized}Z`);
  return Number.isFinite(t) ? t : 0;
}

export function outboundClientComms(
  communications: Communication[] | undefined,
): Communication[] {
  return (communications ?? [])
    .filter((c) => c.direction === "OUTBOUND")
    .filter(
      (c) =>
        c.channel === "EMAIL" ||
        c.channel === "WHATSAPP" ||
        c.channel === "PHONE",
    )
    .slice()
    .sort((a, b) => parseCommStamp(b.occurredAt) - parseCommStamp(a.occurredAt));
}

export function countNewComms(
  communications: Communication[] | undefined,
  seenAt: string | null | undefined,
): number {
  const items = outboundClientComms(communications);
  if (!seenAt) return items.length;
  const seen = Date.parse(seenAt);
  if (!Number.isFinite(seen)) return items.length;
  return items.filter((c) => parseCommStamp(c.occurredAt) > seen).length;
}

export async function getCommsSeenAt(userId: string): Promise<string | null> {
  if (!isAdminConfigured) return null;
  const { data } = await getAdminClient()
    .from("profiles")
    .select("comms_seen_at")
    .eq("id", userId)
    .maybeSingle();
  return data?.comms_seen_at ?? null;
}

export async function setCommsSeenAt(userId: string): Promise<void> {
  if (!isAdminConfigured) return;
  await getAdminClient()
    .from("profiles")
    .update({ comms_seen_at: new Date().toISOString() })
    .eq("id", userId);
  revalidatePath("/area-riservata", "layout");
}
