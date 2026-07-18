import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/ssr";
import type { ClientNotificationRow } from "@/lib/supabase/types";
import type { PracticeStatus } from "@/content/crm-data";
import type {
  ClientNotification,
  ClientNotificationKind,
} from "@/lib/client-notifications-shared";

export type { ClientNotification, ClientNotificationKind };

/*
  Notifiche in-app area personale (@06): eventi azionabili, segnabili come letti.
  Scrittura best-effort via service_role; lettura/mark-read via RLS del cliente.
  Diverso dallo storico Comunicazioni (practices.communications).
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

const STATUS_CLIENT: Partial<
  Record<PracticeStatus, { title: string; body: string; href: string }>
> = {
  PAGATO: {
    title: "Pagamento ricevuto",
    body: "La pratica è avviata. Carica i documenti richiesti.",
    href: "/area-riservata/documenti",
  },
  ATTESA_DOC: {
    title: "Servono ancora dei documenti",
    body: "Completa la lista in area personale per andare avanti.",
    href: "/area-riservata/documenti",
  },
  LAVORAZIONE: {
    title: "Stiamo lavorando alla tua pratica",
    body: "Abbiamo tutto il necessario. Ti aggiorniamo appena ci sono novità.",
    href: "/area-riservata/dashboard",
  },
  INVIATA: {
    title: "Dichiarazione inviata all'Agenzia",
    body: "Appena arriva la ricevuta la trovi tra i documenti finali.",
    href: "/area-riservata/dashboard",
  },
  CHIUSA: {
    title: "Pratica conclusa",
    body: "Puoi scaricare i documenti finali dalla tua area personale.",
    href: "/area-riservata/conclusa",
  },
};

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
  input: Omit<Parameters<typeof pushClientNotification>[0], "contactId" | "practiceId">,
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
  const tpl = STATUS_CLIENT[status];
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

/** Mark read via sessione cliente (RLS). */
export async function markClientNotificationRead(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("client_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id)
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
  if (!contactId) return false;
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
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
      .limit(1)
      .maybeSingle();
    if (data && typeof data.notify_email === "boolean") return data.notify_email;
    return true;
  } catch {
    return true;
  }
}
