"use server";

import { revalidatePath } from "next/cache";
import { getClientView } from "@/lib/area";
import { actionText } from "@/lib/action-locale";
import { ensureProfile } from "@/lib/profiles";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/ssr";
import { normalizePhone } from "@/lib/phone";
import {
  coerceCommsLocale,
  isCommsLocale,
  type CommsLocale,
} from "@/lib/comms-locale-shared";

/*
  Aggiornamento del numero di telefono da parte del CLIENTE loggato.
  Scrive sull'anagrafica (contacts) e sulle pratiche collegate
  (practices.client_phone), cosi CRM e area restano allineati.
  La proprieta e garantita dalla sessione (getClientView + contact_id del profilo).
*/

export type UpdatePhoneResult =
  | { ok: true; phone: string }
  | { ok: false; error: string };

export async function updatePhone(raw: string): Promise<UpdatePhoneResult> {
  const view = await getClientView();
  if (!view) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "session_expired",
        "Sessione scaduta. Accedi di nuovo.",
      ),
    };
  }
  if (!isAdminConfigured) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "service_unavailable",
        "Servizio non disponibile.",
      ),
    };
  }

  const phone = normalizePhone(raw);
  if (!phone) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "phone_invalid_detail",
        "Numero non valido: scegli il prefisso (+39, +49…) e il numero nazionale.",
      ),
    };
  }

  const { contactId } = await ensureProfile(view.user);
  const admin = getAdminClient();

  if (contactId) {
    const { error } = await admin
      .from("contacts")
      .update({ phone })
      .eq("id", contactId);
    if (error) {
      return {
        ok: false,
        error: await actionText(
          "area_errors",
          "prefs_failed",
          "Salvataggio non riuscito, riprova.",
        ),
      };
    }
    await admin
      .from("practices")
      .update({ client_phone: phone })
      .eq("contact_id", contactId);
  } else if (view.practice) {
    // Nessuna anagrafica collegata (caso raro): aggiorna almeno la pratica.
    const { error } = await admin
      .from("practices")
      .update({ client_phone: phone })
      .eq("id", view.practice.id);
    if (error) {
      return {
        ok: false,
        error: await actionText(
          "area_errors",
          "prefs_failed",
          "Salvataggio non riuscito, riprova.",
        ),
      };
    }
  } else {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "no_practice",
        "Nessuna pratica collegata al tuo account.",
      ),
    };
  }

  revalidatePath("/area-riservata/profilo");
  revalidatePath("/area-riservata/dati");
  return { ok: true, phone };
}

/*
  Crea o cambia la password dell'account (opzionale: chi non la imposta
  continua con magic link/OTP). Richiede la sessione attiva: e' il client
  Supabase dell'utente a fare updateUser, non il service_role.
*/
export type UpdatePasswordResult = { ok: true } | { ok: false; error: string };

export async function updatePassword(
  password: string,
): Promise<UpdatePasswordResult> {
  const view = await getClientView();
  if (!view) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "session_expired",
        "Sessione scaduta. Accedi di nuovo.",
      ),
    };
  }

  if (password.length < 8) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "password_short",
        "La password deve avere almeno 8 caratteri.",
      ),
    };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (
      error.message ===
      "New password should be different from the old password."
    ) {
      return {
        ok: false,
        error: await actionText(
          "area_errors",
          "password_same",
          "La nuova password deve essere diversa da quella attuale.",
        ),
      };
    }
    console.error("[area] updatePassword:", error.message);
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "password_failed",
        "Salvataggio non riuscito, riprova.",
      ),
    };
  }
  return { ok: true };
}

export type UpdateNotifPrefsResult = { ok: true } | { ok: false; error: string };

export async function updateNotificationPrefs(input: {
  notifyEmail: boolean;
  notifyWhatsapp: boolean;
}): Promise<UpdateNotifPrefsResult> {
  const view = await getClientView();
  if (!view) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "session_expired",
        "Sessione scaduta. Accedi di nuovo.",
      ),
    };
  }
  if (!isAdminConfigured) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "service_unavailable",
        "Servizio non disponibile.",
      ),
    };
  }

  const { error } = await getAdminClient()
    .from("profiles")
    .update({
      notify_email: input.notifyEmail,
      notify_whatsapp: input.notifyWhatsapp,
    })
    .eq("id", view.user.id);
  if (error) {
    console.error("[area] updateNotificationPrefs:", error.message);
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "prefs_failed",
        "Salvataggio non riuscito, riprova.",
      ),
    };
  }
  revalidatePath("/area-riservata/profilo");
  return { ok: true };
}

export type UpdateCommsLocaleResult =
  | { ok: true; locale: CommsLocale }
  | { ok: false; error: string };

export async function updateCommsLocale(
  raw: string,
): Promise<UpdateCommsLocaleResult> {
  const view = await getClientView();
  if (!view) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "session_expired",
        "Sessione scaduta. Accedi di nuovo.",
      ),
    };
  }
  if (!isAdminConfigured) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "service_unavailable",
        "Servizio non disponibile.",
      ),
    };
  }
  if (!isCommsLocale(raw)) {
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "prefs_failed",
        "Lingua non valida.",
      ),
    };
  }
  const locale = coerceCommsLocale(raw);
  const { error } = await getAdminClient()
    .from("profiles")
    .update({ comms_locale: locale })
    .eq("id", view.user.id);
  if (error) {
    console.error("[area] updateCommsLocale:", error.message);
    return {
      ok: false,
      error: await actionText(
        "area_errors",
        "prefs_failed",
        "Salvataggio non riuscito, riprova.",
      ),
    };
  }
  revalidatePath("/area-riservata/profilo");
  revalidatePath("/area-riservata/comunicazioni");
  revalidatePath("/area-riservata", "layout");
  return { ok: true, locale };
}
