/*
  Pulizia delle pratiche di PROVA in produzione.
  - Default: solo PREVIEW (nessuna cancellazione): elenca tutte le pratiche
    con codice, nome, stato, pagamento, n. documenti caricati e proposta
    TIENI/CANCELLA.
  - Con --delete: cancella le pratiche proposte, i loro file su Storage e i
    contatti rimasti orfani.
  Regole di conservazione:
  - si tiene sempre la pratica indicata in KEEP_CODES (rimborso Mauro);
  - si tengono le pratiche con documenti caricati su Storage (successioni
    con documenti reali), salvo siano esplicitamente in DROP_CODES.
  Uso: node scripts/cleanup-test-practices.mjs [--delete] [--keep CODICE,...] [--drop CODICE,...]
*/
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const envFile = readFileSync(resolve(import.meta.dirname, "..", ".env.local"), "utf8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l.includes("=") && !l.trimStart().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Config Supabase mancante in .env.local");
  process.exit(1);
}
const admin = createClient(url, key, { auth: { persistSession: false } });

const DOC_BUCKET = "practice-docs";
const KEEP_CODES = new Set(["SUC-2026-0022"]);
const DROP_CODES = new Set();

for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === "--keep" && process.argv[i + 1]) {
    process.argv[i + 1].split(",").forEach((c) => KEEP_CODES.add(c.trim()));
  }
  if (process.argv[i] === "--drop" && process.argv[i + 1]) {
    process.argv[i + 1].split(",").forEach((c) => DROP_CODES.add(c.trim()));
  }
}
const doDelete = process.argv.includes("--delete");

// File su Storage per pratica: la cartella e' l'id pratica. Si contano solo i
// documenti "veri" (non i JSON interni _extras/_extraction).
async function listStorageFiles(practiceId) {
  const { data, error } = await admin.storage
    .from(DOC_BUCKET)
    .list(practiceId, { limit: 200 });
  if (error) return [];
  return (data ?? []).map((f) => f.name);
}

function isRealDoc(name) {
  return !name.startsWith("_");
}

const { data: practices, error } = await admin
  .from("practices")
  .select("id, code, client_name, client_email, status, payment_status, contact_id, created_at")
  .order("created_at", { ascending: true });
if (error) throw error;

const rows = [];
for (const p of practices ?? []) {
  const files = await listStorageFiles(p.id);
  const realDocs = files.filter(isRealDoc);
  const keep =
    KEEP_CODES.has(p.code) || (realDocs.length > 0 && !DROP_CODES.has(p.code));
  rows.push({ ...p, files, realDocs: realDocs.length, keep });
}

console.log("");
console.log("codice           | cliente                  | stato        | pagamento  | doc | azione");
console.log("-".repeat(100));
for (const r of rows) {
  const name = (r.client_name || r.client_email || "(anonima)").slice(0, 24);
  console.log(
    `${(r.code ?? "?").padEnd(16)} | ${name.padEnd(24)} | ${(r.status ?? "").padEnd(12)} | ${(r.payment_status ?? "").padEnd(10)} | ${String(r.realDocs).padStart(3)} | ${r.keep ? "TIENI" : "CANCELLA"}`,
  );
}
const toDelete = rows.filter((r) => !r.keep);
console.log("-".repeat(100));
console.log(`Totale: ${rows.length} pratiche - da tenere ${rows.length - toDelete.length}, da cancellare ${toDelete.length}`);

if (!doDelete) {
  console.log("\nPreview: nessuna cancellazione. Rilancia con --delete per procedere.");
  process.exit(0);
}

console.log("\nCancellazione in corso…");
for (const r of toDelete) {
  // 1. File Storage (inclusi i JSON interni).
  if (r.files.length > 0) {
    const paths = r.files.map((f) => `${r.id}/${f}`);
    const { error: se } = await admin.storage.from(DOC_BUCKET).remove(paths);
    if (se) console.warn(`  ${r.code}: errore rimozione file:`, se.message);
  }
  // 2. Profili che puntano al contatto (per non violare la FK al passo 4).
  if (r.contact_id) {
    await admin
      .from("profiles")
      .update({ contact_id: null })
      .eq("contact_id", r.contact_id);
  }
  // 3. Pratica.
  const { error: pe } = await admin.from("practices").delete().eq("id", r.id);
  if (pe) {
    console.error(`  ${r.code}: cancellazione pratica fallita:`, pe.message);
    continue;
  }
  // 4. Contatto, solo se non ha altre pratiche.
  if (r.contact_id) {
    const { count } = await admin
      .from("practices")
      .select("id", { count: "exact", head: true })
      .eq("contact_id", r.contact_id);
    if ((count ?? 0) === 0) {
      const { error: ce } = await admin
        .from("contacts")
        .delete()
        .eq("id", r.contact_id);
      if (ce) console.warn(`  ${r.code}: contatto non cancellato:`, ce.message);
    }
  }
  console.log(`  ${r.code}: cancellata`);
}
console.log("Fatto.");
