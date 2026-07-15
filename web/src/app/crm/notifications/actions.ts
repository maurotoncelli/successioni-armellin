"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import {
  deleteCrmNotification,
  clearCrmNotifications,
} from "@/lib/crm-notifications";

export type NotificationActionResult = { ok: boolean; error?: string };

export async function dismissNotification(
  id: string,
): Promise<NotificationActionResult> {
  await requireAdmin();
  try {
    await deleteCrmNotification(id);
  } catch (err) {
    console.error("[crm] dismissNotification:", err);
    return { ok: false, error: "Eliminazione non riuscita, riprova." };
  }
  revalidatePath("/crm");
  return { ok: true };
}

export async function dismissAllNotifications(): Promise<NotificationActionResult> {
  await requireAdmin();
  try {
    await clearCrmNotifications();
  } catch (err) {
    console.error("[crm] dismissAllNotifications:", err);
    return { ok: false, error: "Eliminazione non riuscita, riprova." };
  }
  revalidatePath("/crm");
  return { ok: true };
}
