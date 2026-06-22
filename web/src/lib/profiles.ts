import "server-only";
import type { User } from "@supabase/supabase-js";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { RoleKey } from "@/lib/supabase/types";

/*
  Gestione del profilo applicativo (profiles) condivisa tra area cliente e CRM.
  - Provisioning al primo accesso (insert via service_role).
  - Collegamento all'anagrafica (contacts) per email.
  - Assegnazione/upgrade del ruolo ADMIN in base all'allowlist ADMIN_EMAILS.
  La RLS impedisce all'utente di auto-promuoversi: la scrittura avviene SOLO qui,
  lato server con service_role.
*/

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

export async function findContactIdByEmail(
  email: string,
): Promise<string | null> {
  if (!email || !isAdminConfigured) return null;
  const { data } = await getAdminClient()
    .from("contacts")
    .select("id")
    .ilike("email", email)
    .maybeSingle();
  return data?.id ?? null;
}

const onlyDigits = (s: string | null | undefined) => (s ?? "").replace(/\D/g, "");

// Collega l'utente loggato via telefono all'anagrafica confrontando le ultime
// cifre significative (i numeri in contacts possono avere formati/spazi diversi).
export async function findContactIdByPhone(
  phone: string | null | undefined,
): Promise<string | null> {
  const d = onlyDigits(phone);
  if (d.length < 6 || !isAdminConfigured) return null;
  const last = d.slice(-9);
  const { data } = await getAdminClient()
    .from("contacts")
    .select("id, phone")
    .not("phone", "is", null)
    .limit(500);
  const hit = (data ?? []).find((c) => onlyDigits(c.phone).endsWith(last));
  return hit?.id ?? null;
}

export type EnsuredProfile = { role: RoleKey; contactId: string | null };

export async function ensureProfile(user: User): Promise<EnsuredProfile> {
  if (!isAdminConfigured) return { role: "CLIENT", contactId: null };

  const admin = getAdminClient();
  const email = (user.email ?? "").toLowerCase();
  const wantAdmin = isAdminEmail(email);

  const { data: existing } = await admin
    .from("profiles")
    .select("role, contact_id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) {
    const updates: { role?: RoleKey; contact_id?: string } = {};
    if (!existing.contact_id) {
      const contactId =
        (await findContactIdByEmail(email)) ??
        (await findContactIdByPhone(user.phone));
      if (contactId) updates.contact_id = contactId;
    }
    if (wantAdmin && existing.role !== "ADMIN") updates.role = "ADMIN";

    if (Object.keys(updates).length > 0) {
      await admin.from("profiles").update(updates).eq("id", user.id);
    }
    return {
      role: updates.role ?? existing.role,
      contactId: updates.contact_id ?? existing.contact_id,
    };
  }

  const contactId =
    (await findContactIdByEmail(email)) ??
    (await findContactIdByPhone(user.phone));
  const role: RoleKey = wantAdmin ? "ADMIN" : "CLIENT";
  await admin.from("profiles").insert({ id: user.id, contact_id: contactId, role });
  return { role, contactId };
}
