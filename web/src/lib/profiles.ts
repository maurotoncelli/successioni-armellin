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
  // Possono esistere piu contatti con la stessa email (lead ripetuti):
  // si aggancia il piu recente. maybeSingle() qui fallirebbe con i duplicati.
  const { data } = await getAdminClient()
    .from("contacts")
    .select("id")
    .ilike("email", email)
    .order("last_activity", { ascending: false })
    .limit(1);
  return data?.[0]?.id ?? null;
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

/*
  Chi si registra senza aver mai compilato quiz/checkout non avrebbe nessuna
  riga in contacts e resterebbe invisibile nel CRM. Qui si crea l'anagrafica
  minima con origine "Registrazione sito"; nome/telefono arriveranno poi da
  profilo o pratiche. Gli admin non sono clienti: per loro non si crea nulla.
*/
async function createContactForUser(user: User): Promise<string | null> {
  const email = (user.email ?? "").trim().toLowerCase();
  const phone = (user.phone ?? "").trim();
  if (!email && !phone) return null;
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const fullName = String(meta.full_name ?? meta.name ?? "").trim();
  const [first, ...rest] = fullName.split(/\s+/).filter(Boolean);
  const { data, error } = await getAdminClient()
    .from("contacts")
    .insert({
      first_name: first || "Cliente",
      last_name: rest.join(" "),
      email: email || null,
      phone: phone ? (phone.startsWith("+") ? phone : `+${phone}`) : null,
      source: "Registrazione sito",
      marketing_consent: false,
      last_activity: new Date().toISOString().slice(0, 10),
    })
    .select("id")
    .single();
  if (error) {
    console.error("[profiles] createContactForUser:", error.message);
    return null;
  }
  return data.id;
}

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
        (await findContactIdByPhone(user.phone)) ??
        (wantAdmin ? null : await createContactForUser(user));
      if (contactId) updates.contact_id = contactId;
    } else if (email) {
      // L'email e' verificata (magic link/OTP): se il contatto agganciato ha
      // un'email DIVERSA (es. profilo nato da login telefono, poi pagamento
      // Stripe con email), si ricollega al contatto giusto, altrimenti la
      // pratica pagata resterebbe invisibile in area personale (RLS).
      const { data: linked } = await admin
        .from("contacts")
        .select("email")
        .eq("id", existing.contact_id)
        .maybeSingle();
      const linkedEmail = (linked?.email ?? "").toLowerCase();
      if (linkedEmail && linkedEmail !== email) {
        const byEmail = await findContactIdByEmail(email);
        if (byEmail && byEmail !== existing.contact_id)
          updates.contact_id = byEmail;
      }
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
    (await findContactIdByPhone(user.phone)) ??
    (wantAdmin ? null : await createContactForUser(user));
  const role: RoleKey = wantAdmin ? "ADMIN" : "CLIENT";
  await admin.from("profiles").insert({ id: user.id, contact_id: contactId, role });
  return { role, contactId };
}
