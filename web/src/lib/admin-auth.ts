/*
  Gate admin PROVVISORIO (stopgap) finche non c'e Supabase Auth.
  - Se ADMIN_PASSWORD non e impostata, il gate e DISATTIVATO (demo liberamente
    accessibile, come prima).
  - Se impostata, /crm/* richiede un cookie il cui valore = hash della password.
    Cosi la password in chiaro non viaggia nel cookie e il cookie non e forgiabile
    senza conoscere la password.
  Funziona sia in Edge (middleware) sia in Node (server action): usa Web Crypto.
*/

export const ADMIN_COOKIE = "crm_auth";

export async function hashToken(secret: string): Promise<string> {
  const data = new TextEncoder().encode(`crm-admin:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
