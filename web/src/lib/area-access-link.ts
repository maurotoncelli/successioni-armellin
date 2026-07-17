import "server-only";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

/*
  Magic link area personale generato server-side (service_role).
  Usato nell'email "pagamento ricevuto": il cliente apre il link e atterra
  autenticato sulla dashboard, con la stessa email di Stripe.
*/

function siteBase(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.successioniarmellin.it"
  ).replace(/\/$/, "");
}

export async function createAreaAccessLink(
  email: string,
): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !isAdminConfigured) return null;

  try {
    const admin = getAdminClient();
    const redirectTo = `${siteBase()}/area-riservata/auth/callback?next=/area-riservata/dashboard`;
    const { data, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: normalized,
      options: { redirectTo },
    });
    if (error) {
      console.error("[area-access-link]", error.message);
      return null;
    }
    return data.properties?.action_link ?? null;
  } catch (err) {
    console.error("[area-access-link]", err);
    return null;
  }
}
