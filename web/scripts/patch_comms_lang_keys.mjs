#!/usr/bin/env node
/**
 * Add comms_lang_{de,es,ru,zh,hi} to profilo_ui in all content_entries + seed.
 * Native autonyms; other labels stay language-appropriate where already localized.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const LABELS = {
  de: "Deutsch",
  es: "Español",
  ru: "Русский",
  zh: "中文",
  hi: "हिन्दी",
};

const files = [
  ...["it", "ar", "en", "tr", "fr", "sq", "de", "es", "ru", "zh", "hi"].map(
    (loc) => path.join(root, `src/content/content_entries.${loc}.json`),
  ),
  path.join(root, "..", "seed", "content_entries.it.json"),
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.warn("skip missing", file);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  let n = 0;
  for (const e of data.entries) {
    if (e.collection !== "area" || e.key !== "profilo_ui") continue;
    if (!e.value || typeof e.value !== "object") continue;
    for (const [k, v] of Object.entries(LABELS)) {
      const key = `comms_lang_${k}`;
      if (e.value[key] !== v) {
        e.value[key] = v;
        n++;
      }
    }
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(path.basename(file), "updated keys", n);
}
