"use server";

import { revalidatePath } from "next/cache";
import { getClientView } from "@/lib/area";
import {
  markAllClientNotificationsRead,
  markClientNotificationRead,
} from "@/lib/client-notifications";

export async function markNotificationReadAction(id: string): Promise<void> {
  const view = await getClientView();
  if (!view?.contactId) return;
  await markClientNotificationRead(id, view.contactId);
  revalidatePath("/area-riservata", "layout");
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const view = await getClientView();
  if (!view?.contactId) return;
  await markAllClientNotificationsRead(view.contactId);
  revalidatePath("/area-riservata", "layout");
}
