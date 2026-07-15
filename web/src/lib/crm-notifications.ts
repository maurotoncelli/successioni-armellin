import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { CrmNotificationRow } from "@/lib/supabase/types";

/*
  Centro notifiche del CRM (@05). Diverso dagli "Alert automatici":
  - gli alert sono DERIVATI dallo stato delle pratiche e ricompaiono finche
    la condizione persiste (scadenze, documenti da validare, ...);
  - le notifiche sono EVENTI puntuali scritti quando accadono (pagamento,
    nuovo lead, recesso, documenti inviati) e Lorenzo puo eliminarle una
    volta lette, singolarmente o tutte insieme.
  La scrittura e best-effort: un errore qui non deve MAI far fallire
  l'operazione principale (webhook, lead, recesso).
*/

export type CrmNotificationKind =
  | "pagamento"
  | "rimborso"
  | "lead"
  | "recesso"
  | "documenti"
  | "mandato";

export type CrmNotification = {
  id: string;
  kind: CrmNotificationKind;
  title: string;
  body: string;
  practiceId: string | null;
  practiceCode: string;
  createdAt: string;
};

function mapRow(row: CrmNotificationRow): CrmNotification {
  return {
    id: row.id,
    kind: row.kind as CrmNotificationKind,
    title: row.title,
    body: row.body,
    practiceId: row.practice_id,
    practiceCode: row.practice_code,
    createdAt: row.created_at,
  };
}

export async function pushCrmNotification(input: {
  kind: CrmNotificationKind;
  title: string;
  body?: string;
  practiceId?: string | null;
  practiceCode?: string;
}): Promise<void> {
  if (!isAdminConfigured) return;
  try {
    const { error } = await getAdminClient().from("crm_notifications").insert({
      kind: input.kind,
      title: input.title,
      body: input.body ?? "",
      practice_id: input.practiceId ?? null,
      practice_code: input.practiceCode ?? "",
    });
    if (error) throw error;
  } catch (err) {
    console.error("[crm-notifications] push:", err);
  }
}

export async function listCrmNotifications(limit = 30): Promise<CrmNotification[]> {
  if (!isAdminConfigured) return [];
  try {
    const { data, error } = await getAdminClient()
      .from("crm_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(mapRow);
  } catch (err) {
    console.error("[crm-notifications] list:", err);
    return [];
  }
}

export async function deleteCrmNotification(id: string): Promise<void> {
  if (!isAdminConfigured) return;
  const { error } = await getAdminClient()
    .from("crm_notifications")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function clearCrmNotifications(): Promise<void> {
  if (!isAdminConfigured) return;
  const { error } = await getAdminClient()
    .from("crm_notifications")
    .delete()
    .gte("created_at", "1970-01-01");
  if (error) throw error;
}
