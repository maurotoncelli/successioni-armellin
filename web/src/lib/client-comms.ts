import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { Communication } from "@/content/crm-data";

export function parseCommStamp(raw: string): number {
  const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
  const t = Date.parse(normalized);
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
}
