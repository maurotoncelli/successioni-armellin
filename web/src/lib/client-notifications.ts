import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { ClientNotificationRow } from "@/lib/supabase/types";
import type { PracticeStatus } from "@/content/crm-data";
import type {
  ClientNotification,
  ClientNotificationKind,
} from "@/lib/client-notifications-shared";
import { getCommsLocaleForPractice } from "@/lib/comms-locale";
import { statusClientCopy } from "@/lib/comms-copy";

export type { ClientNotification, ClientNotificationKind };

/*
  Notifiche in-app area personale (@06): eventi azionabili, segnabili come letti.
  Scrittura/lettura/mark-read via service_role (scoped su contact_id del profilo).
  Diverso dallo storico Comunicazioni (practices.communications).
  Titoli/body nella lingua preferita comunicazioni (profiles.comms_locale).
*/

function mapRow(row: ClientNotificationRow): ClientNotification {
  return {
    id: row.id,
    kind: row.kind as ClientNotificationKind,
    title: row.title,
    body: row.body,
    href: row.href,
    practiceId: row.practice_id,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function pushClientNotification(input: {
  kind: ClientNotificationKind;
  title: string;
  body?: string;
  href?: string;
  practiceId?: string | null;
  contactId: string;
  dedupeMinutes?: number;
}): Promise<void> {
  if (!isAdminConfigured || !input.contactId) return;
  try {
    const admin = getAdminClient();
    if (input.dedupeMinutes && input.practiceId) {
      const since = new Date(
        Date.now() - input.dedupeMinutes * 60_000,
      ).toISOString();
      const { data: dup } = await admin
        .from("client_notifications")
        .select("id")
        .eq("kind", input.kind)
        .eq("title", input.title)
        .eq("practice_id", input.practiceId)
        .eq("contact_id", input.contactId)
        .gte("created_at", since)
        .limit(1);
      if (dup && dup.length > 0) return;
    }
    const { error } = await admin.from("client_notifications").insert({
      kind: input.kind,
      title: input.title,
      body: input.body ?? "",
      href: input.href ?? "/area-riservata/dashboard",
      practice_id: input.practiceId ?? null,
      contact_id: input.contactId,
    });
    if (error) throw error;
  } catch (err) {
    console.error("[client-notifications] push:", err);
  }
}

/** Risolve contact_id dalla pratica e invia notifica (no-op se manca contatto). */
export async function pushClientNotificationForPractice(
  practiceId: string,
  input: Omit<
    Parameters<typeof pushClientNotification>[0],
    "contactId" | "practiceId"
  >,
): Promise<void> {
  if (!isAdminConfigured) return;
  try {
    const { data } = await getAdminClient()
      .from("practices")
      .select("contact_id")
      .eq("id", practiceId)
      .maybeSingle();
    if (!data?.contact_id) return;
    await pushClientNotification({
      ...input,
      practiceId,
      contactId: data.contact_id,
    });
  } catch (err) {
    console.error("[client-notifications] pushForPractice:", err);
  }
}

export async function pushClientStatusNotification(
  practiceId: string,
  status: PracticeStatus,
): Promise<void> {
  const locale = await getCommsLocaleForPractice(practiceId);
  const tpl = statusClientCopy(status, locale);
  if (!tpl) return;
  await pushClientNotificationForPractice(practiceId, {
    kind: status === "CHIUSA" ? "finali" : "stato",
    title: tpl.title,
    body: tpl.body,
    href: tpl.href,
    dedupeMinutes: 30,
  });
}

export async function listClientNotifications(
  contactId: string,
  limit = 40,
): Promise<ClientNotification[]> {
  if (!isAdminConfigured || !contactId) return [];
  try {
    const { data, error } = await getAdminClient()
      .from("client_notifications")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(mapRow);
  } catch (err) {
    console.error("[client-notifications] list:", err);
    return [];
  }
}

export async function countUnreadClientNotifications(
  contactId: string,
): Promise<number> {
  if (!isAdminConfigured || !contactId) return 0;
  try {
    const { count, error } = await getAdminClient()
      .from("client_notifications")
      .select("id", { count: "exact", head: true })
      .eq("contact_id", contactId)
      .is("read_at", null);
    if (error) throw error;
    return count ?? 0;
  } catch (err) {
    console.error("[client-notifications] count:", err);
    return 0;
  }
}

export async function markClientNotificationRead(
  id: string,
  contactId: string,
): Promise<boolean> {
  if (!id || !contactId || !isAdminConfigured) return false;
  try {
    const { error } = await getAdminClient()
      .from("client_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id)
      .eq("contact_id", contactId)
      .is("read_at", null);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("[client-notifications] markRead:", err);
    return false;
  }
}

export async function markAllClientNotificationsRead(
  contactId: string,
): Promise<boolean> {
  if (!contactId || !isAdminConfigured) return false;
  try {
    const { error } = await getAdminClient()
      .from("client_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("contact_id", contactId)
      .is("read_at", null);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("[client-notifications] markAllRead:", err);
    return false;
  }
}

/** Preferenza soft-email (recensione GMB). Default true se profilo assente. */
export async function getNotifyEmailPreference(
  contactId: string | null,
): Promise<boolean> {
  if (!contactId || !isAdminConfigured) return true;
  try {
    const { data } = await getAdminClient()
      .from("profiles")
      .select("notify_email")
      .eq("contact_id", contactId)
      .limit(1);
    const row = data?.[0];
    if (row && typeof row.notify_email === "boolean") return row.notify_email;
    return true;
  } catch {
    return true;
  }
}
