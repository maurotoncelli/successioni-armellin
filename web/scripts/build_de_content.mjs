#!/usr/bin/env node
/**
 * Build content_entries.de.json from IT + string maps (agent-authored, no API).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const map = {};
for (let i = 0; i <= 8; i++) {
  const p = path.join(__dirname, `de_map_${i}.json`);
  Object.assign(map, JSON.parse(fs.readFileSync(p, "utf8")));
}

const need = JSON.parse(
  fs.readFileSync(path.join(__dirname, "it_need_translate.json"), "utf8"),
);
const missing = need.filter((s) => !(s in map));
if (missing.length) {
  console.error("Missing translations:", missing.length);
  missing.slice(0, 40).forEach((s) => console.error(" -", JSON.stringify(s)));
  process.exit(1);
}

function tr(s) {
  if (typeof s !== "string") return s;
  return Object.prototype.hasOwnProperty.call(map, s) ? map[s] : s;
}

function walk(v) {
  if (typeof v === "string") return tr(v);
  if (Array.isArray(v)) return v.map(walk);
  if (v && typeof v === "object") {
    const out = {};
    for (const [k, val] of Object.entries(v)) out[k] = walk(val);
    return out;
  }
  return v;
}

const it = JSON.parse(
  fs.readFileSync(
    path.join(root, "src/content/content_entries.it.json"),
    "utf8",
  ),
);

const out = {
  _meta: {
    purpose:
      "German courtesy translation of public site + area UI. Same keys as IT; IT remains legally authoritative (@07/@10).",
    locale: "de",
    schema:
      "ogni entry: { collection, key, locale, value, is_published }. value tipizzato secondo SPEC_Content_Blocks.",
    exclusions:
      "NON inclusi i contenuti data-driven gestiti in tabelle dedicate: packages, addons, faqs (Q&A), articles, document_catalog, media_assets (qui solo asset_key di riferimento).",
    version: 2,
    updated_at: "2026-07-18",
  },
  entries: it.entries.map((e) => ({
    collection: e.collection,
    key: e.key,
    locale: "de",
    is_published: e.is_published,
    value: walk(e.value),
  })),
};

const outPath = path.join(root, "src/content/content_entries.de.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");

const itK = new Set(it.entries.map((e) => e.collection + "." + e.key));
const deK = new Set(out.entries.map((e) => e.collection + "." + e.key));
const miss = [...itK].filter((k) => !deK.has(k));
console.log("wrote", outPath);
console.log("entries", out.entries.length, "missing keys", miss.length);
console.log("map size", Object.keys(map).length);
