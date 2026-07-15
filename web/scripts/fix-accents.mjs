/*
  Passata refusi (one-shot): ripristina gli accenti mancanti nei testi dei
  contenuti. SOLO sostituzioni non ambigue, con confini di parola; il verbo
  "e"/"è" NON viene toccato (ambiguo con la congiunzione, si corregge a mano).
  Uso: node scripts/fix-accents.mjs [--dry]
*/
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const FILES = [
  "src/content/content_entries.it.json",
  "../seed/content_entries.it.json",
  "src/content/site.ts",
  "src/content/articles.ts",
  "src/content/legal.ts",
  "src/content/mandato.ts",
];

// [sbagliato, giusto] - applicati con confini di parola e variante maiuscola.
const WORDS = [
  ["piu", "più"],
  ["gia", "già"],
  ["puo", "può"],
  ["cosi", "così"],
  ["perche", "perché"],
  ["finche", "finché"],
  ["affinche", "affinché"],
  ["poiche", "poiché"],
  ["anziche", "anziché"],
  ["nonche", "nonché"],
  ["percio", "perciò"],
  ["pero", "però"],
  ["cioe", "cioè"],
  ["meta", "metà"],
  ["sara", "sarà"],
  ["saranno", "saranno"],
  ["servira", "servirà"],
  ["serviranno", "serviranno"],
  ["verra", "verrà"],
  ["restera", "resterà"],
  ["arrivera", "arriverà"],
  ["trovera", "troverà"],
  ["dara", "darà"],
  ["fara", "farà"],
  ["avra", "avrà"],
  ["andra", "andrà"],
  ["dovra", "dovrà"],
  ["potra", "potrà"],
  ["bastera", "basterà"],
  ["chiedera", "chiederà"],
  ["ricevera", "riceverà"],
  ["seguira", "seguirà"],
  ["novita", "novità"],
  ["attivita", "attività"],
  ["qualita", "qualità"],
  ["quantita", "quantità"],
  ["liquidita", "liquidità"],
  ["complessita", "complessità"],
  ["difficolta", "difficoltà"],
  ["proprieta", "proprietà"],
  ["comproprieta", "comproprietà"],
  ["realta", "realtà"],
  ["identita", "identità"],
  ["disponibilita", "disponibilità"],
  ["velocita", "velocità"],
  ["modalita", "modalità"],
  ["finalita", "finalità"],
  ["responsabilita", "responsabilità"],
  ["titolarita", "titolarità"],
  ["eta", "età"],
  ["citta", "città"],
  ["societa", "società"],
  ["universita", "università"],
  ["possibilita", "possibilità"],
  ["opportunita", "opportunità"],
  ["necessita", "necessità"],
  ["priorita", "priorità"],
  ["eredita", "eredità"],
  ["c'e", "c'è"],
  ["cos'e", "cos'è"],
  ["com'e", "com'è"],
  ["dov'e", "dov'è"],
];

// Falsi positivi noti da ripristinare dopo la passata.
const RESTORE = [
  [/\bmetà dati\b/g, "metadati"],
  [/\beredità(ria|rie|rio|ri)\b/g, "eredita$1"], // "ereditaria/o" non esiste qui ma safety
  [/si eredità\b/g, "si eredita"], // verbo ereditare, 3a persona
  [/\bmetà\s*=\s*/g, "meta = "], // eventuali chiavi di codice
];

const dry = process.argv.includes("--dry");
let updated = 0;

for (const rel of FILES) {
  const path = resolve(import.meta.dirname, "..", rel);
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    console.warn(`- ${rel}: non trovato, salto`);
    continue;
  }
  const before = text;

  for (const [wrong, right] of WORDS) {
    if (wrong === right) continue;
    const variants = [
      [wrong, right],
      [wrong[0].toUpperCase() + wrong.slice(1), right[0].toUpperCase() + right.slice(1)],
    ];
    for (const [w, r] of variants) {
      // \b non funziona con gli apostrofi: confini espliciti (no lettere/apostrofo attorno).
      const re = new RegExp(`(^|[^\\p{L}'])${w}(?=$|[^\\p{L}])`, "gmu");
      text = text.replace(re, `$1${r}`);
    }
  }
  for (const [re, right] of RESTORE) text = text.replace(re, right);

  if (text !== before) {
    updated += 1;
    console.log(`- ${rel}: MODIFICATO`);
    if (!dry) writeFileSync(path, text, "utf8");
  } else {
    console.log(`- ${rel}: nessuna modifica`);
  }
}

console.log(dry ? "(dry run, nessun file scritto)" : `Fatto: ${updated} file aggiornati.`);
