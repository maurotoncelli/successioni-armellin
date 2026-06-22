import "server-only";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

/*
  Cifratura applicativa dell'IBAN (dato sensibile, @10/@11).
  AES-256-GCM con chiave derivata (scrypt) dalla service_role key (gia segreta e
  solo-server): cosi non serve una nuova variabile d'ambiente. Formato salvato:
  base64( iv[12] | tag[16] | ciphertext ). Solo il server (CRM/admin) puo
  decifrare; al cliente mostriamo soltanto le ultime 4 cifre.
*/

function key(): Buffer {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Chiave di cifratura non disponibile (service_role).");
  return scryptSync(secret, "iban-enc-v1", 32);
}

export function encryptIban(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString("base64");
}

export function decryptIban(payload: string): string {
  const raw = Buffer.from(payload, "base64");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ct = raw.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}

// Normalizza e valida (controllo leggero: prefisso paese + lunghezza plausibile).
export function normalizeIban(input: string): string | null {
  const v = input.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(v)) return null;
  return v;
}
