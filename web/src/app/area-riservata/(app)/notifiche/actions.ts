"use server";

import { revalidatePath } from "next/cache";
import { getClientView } from "@/lib/area";
import { ensureProfile } from "@/lib/profiles";
import {
  markAllClientNotificationsRead,
  markClientNotificationRead,
} from "@/lib/client-notifications";

export async function markNotificationReadAction(id: string): Promise<void> {
  await markClientNotificationRead(id);
  revalidatePath("/area-riservata", "layout");
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const view = await getClientView();
  if (!view) return;
  const { contactId } = await ensureProfile(view.user);
  if (!contactId) return;
  await markAllClientNotificationsRead(contactId);
  revalidatePath("/area-riservata", "layout");
}
