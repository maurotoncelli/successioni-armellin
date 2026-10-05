/*
  One-shot: listino 299 / 600 / su misura (Mauro 05/10/2026).
  - packages: Semplice 299, Completo 600 con testi "fino a 3 immobili e 3 eredi"
  - faqs (IT): risposta di "Quanto costa il vostro servizio?"
  Il resto del listino (add-on, altre FAQ) non si tocca, così restano le
  modifiche fatte a mano dal CRM.
  Uso: node scripts/listino-299-600.mjs [--dry]
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
const dry = process.argv.includes("--dry");

const packageUpdates = [
  { key: "SEMPLICE", patch: { price: 299 } },
  {
    key: "COMPLETO",
    patch: {
      price: 600,
      extra_property_fee: 60,
      tagline: "Fino a 3 immobili e 3 eredi, voltura inclusa",
      description:
        "Il pacchetto per chi eredita una casa o pochi immobili: controllo dei dati catastali e atti di provenienza, dichiarazione, invio e voltura catastale. Comprende fino a 3 immobili e 3 eredi; ogni immobile o erede in più costa 60 €.",
      features: [
        "Tutto quello del pacchetto Semplice",
        "Fino a 3 immobili e 3 eredi, +60 € per ognuno in più",
        "Controllo dei dati catastali e atti di provenienza",
        "Voltura catastale inclusa",
      ],
    },
  },
];

const FAQ_QUESTION = "Quanto costa il vostro servizio?";
const FAQ_ANSWER =
  "Onorario fisso senza IVA da aggiungere: Semplice 299 € (solo conti e liquidità, niente immobili, con qualsiasi numero di eredi) o Con immobili 600 € (fino a 3 immobili, terreni compresi, e 3 eredi; oltre, +60 € per ogni immobile o erede in più, indicato prima del pagamento). Chi vive all'estero paga lo stesso prezzo. Per aziende, quote societarie, azioni o imbarcazioni ti facciamo un preventivo su misura. Le imposte di Stato sono separate, a carico dell'erede, e te le calcoliamo prima dell'invio.";

const { data: rows, error } = await admin
  .from("packages")
  .select("key, price, tagline, features");
if (error) throw error;
for (const upd of packageUpdates) {
  const row = rows?.find((r) => r.key === upd.key);
  if (!row) {
    console.log(`packages: ${upd.key} non trovato, salto`);
    continue;
  }
  console.log(`packages: ${upd.key} ${row.price} → ${upd.patch.price}`);
  if (!dry) {
    const { error: e } = await admin.from("packages").update(upd.patch).eq("key", upd.key);
    if (e) throw e;
  }
}

const { data: faqs, error: faqErr } = await admin
  .from("faqs")
  .select("id")
  .eq("locale", "it")
  .eq("question", FAQ_QUESTION);
if (faqErr) throw faqErr;
if (!faqs || faqs.length === 0) {
  console.log(`faqs: "${FAQ_QUESTION}" non trovata (forse rinominata dal CRM), salto`);
} else {
  console.log(`faqs: aggiorno "${FAQ_QUESTION}" (${faqs.length})`);
  if (!dry) {
    const { error: e } = await admin
      .from("faqs")
      .update({ answer: FAQ_ANSWER })
      .in("id", faqs.map((f) => f.id));
    if (e) throw e;
  }
}

console.log(dry ? "(dry run, nessuna scrittura)" : "Fatto.");
