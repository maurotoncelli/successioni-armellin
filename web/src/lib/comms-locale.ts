import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import {
  coerceCommsLocale,
  type CommsLocale,
} from "@/lib/comms-locale-shared";

export {
  COMMS_LOCALES,
  COMMS_LOCALE_LABELS,
  coerceCommsLocale,
  isCommsLocale,
  type CommsLocale,
} from "@/lib/comms-locale-shared";

/*
  Lingua delle comunicazioni scritte (email + notifiche), distinta dalla UI.
  Persistita su profiles.comms_locale. Default: it.
*/

export async function getCommsLocaleForContact(
  contactId: string | null | undefined,
): Promise<CommsLocale> {
  if (!contactId || !isAdminConfigured) return "it";
  try {
    const { data } = await getAdminClient()
      .from("profiles")
      .select("comms_locale")
      .eq("contact_id", contactId)
      .limit(1);
    return coerceCommsLocale(data?.[0]?.comms_locale);
  } catch {
    return "it";
  }
}

export async function getCommsLocaleForPractice(
  practiceId: string,
): Promise<CommsLocale> {
  if (!practiceId || !isAdminConfigured) return "it";
  try {
    const { data } = await getAdminClient()
      .from("practices")
      .select("contact_id")
      .eq("id", practiceId)
      .maybeSingle();
    return getCommsLocaleForContact(data?.contact_id);
  } catch {
    return "it";
  }
}

export async function getCommsLocaleForUser(
  userId: string,
): Promise<CommsLocale> {
  if (!userId || !isAdminConfigured) return "it";
  try {
    const { data } = await getAdminClient()
      .from("profiles")
      .select("comms_locale")
      .eq("id", userId)
      .maybeSingle();
    return coerceCommsLocale(data?.comms_locale);
  } catch {
    return "it";
  }
}
