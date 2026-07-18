#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const map = {};
for (let i = 0; i <= 8; i++) {
  Object.assign(
    map,
    JSON.parse(fs.readFileSync(path.join(__dirname, `zh_map_${i}.json`), "utf8")),
  );
}

const itOrdered = [];
const trOrdered = [];
for (let i = 0; i <= 3; i++) {
  itOrdered.push(
    ...JSON.parse(
      fs.readFileSync(path.join(__dirname, `overlay_need_${i}.json`), "utf8"),
    ),
  );
  trOrdered.push(
    ...JSON.parse(
      fs.readFileSync(path.join(__dirname, `overlay_zh_${i}.json`), "utf8"),
    ),
  );
}
if (itOrdered.length !== trOrdered.length) {
  console.error("length mismatch", itOrdered.length, trOrdered.length);
  process.exit(1);
}
for (let i = 0; i < itOrdered.length; i++) map[itOrdered[i]] = trOrdered[i];

for (const s of JSON.parse(
  fs.readFileSync(path.join(__dirname, "overlay_keep.json"), "utf8"),
)) {
  if (!(s in map)) map[s] = s;
}
map["Geom. Lorenzo Armellin"] = "Geom. Lorenzo Armellin";

function tr(s) {
  if (typeof s !== "string") return s;
  if (Object.prototype.hasOwnProperty.call(map, s)) return map[s];
  return s;
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

function emitTsString(s) {
  return JSON.stringify(s);
}

function emitBlock(block, indent) {
  const pad = "  ".repeat(indent);
  if (block.type === "p" || block.type === "h2" || block.type === "h3") {
    return `${pad}{ type: ${emitTsString(block.type)}, text: ${emitTsString(block.text)} }`;
  }
  if (block.type === "ul" || block.type === "ol") {
    const items = block.items
      .map((it) => `${pad}    ${emitTsString(it)}`)
      .join(",\n");
    return `${pad}{\n${pad}  type: ${emitTsString(block.type)},\n${pad}  items: [\n${items},\n${pad}  ],\n${pad}}`;
  }
  if (block.type === "table") {
    const headers = block.headers.map((h) => emitTsString(h)).join(", ");
    const rows = block.rows
      .map(
        (row) =>
          `${pad}    [${row.map((c) => emitTsString(c)).join(", ")}]`,
      )
      .join(",\n");
    return `${pad}{\n${pad}  type: "table",\n${pad}  headers: [${headers}],\n${pad}  rows: [\n${rows},\n${pad}  ],\n${pad}}`;
  }
  if (block.type === "callout") {
    const parts = [`type: "callout"`];
    if (block.tone) parts.push(`tone: ${emitTsString(block.tone)}`);
    if (block.title) parts.push(`title: ${emitTsString(block.title)}`);
    parts.push(`text: ${emitTsString(block.text)}`);
    return `${pad}{ ${parts.join(", ")} }`;
  }
  return `${pad}${JSON.stringify(block)}`;
}

const articlesIt = JSON.parse(
  fs.readFileSync(path.join(__dirname, "articles_it.json"), "utf8"),
);
const articlesZh = walk(articlesIt);

const leftovers = [];
function findIt(v, pathHint) {
  if (typeof v === "string") {
    if (/[àèéìòù]/.test(v) || /\b(che|per|della|sono|non)\b/i.test(v)) {
      if (!(v in map) && !/^https?:/.test(v) && !/^\d/.test(v))
        leftovers.push(pathHint + ": " + v.slice(0, 80));
    }
    return;
  }
  if (Array.isArray(v))
    return v.forEach((x, i) => findIt(x, pathHint + `[${i}]`));
  if (v && typeof v === "object")
    Object.entries(v).forEach(([k, val]) => findIt(val, pathHint + "." + k));
}
findIt(articlesZh, "articles");

let articlesTs = `import type { ArticleBlock, ArticleSource } from "./articles";

/*
  Chinese courtesy translation of guides.
  IT in articles.ts remains the source; overlay for title/excerpt/body/sources.
*/

export type ArticleZhOverlay = {
  title: string;
  excerpt: string;
  reviewedBy: string;
  body: ArticleBlock[];
  sources: ArticleSource[];
};

const REVIEWED = ${emitTsString(articlesZh[0]?.reviewedBy ?? "税务方面已由注册税务顾问审核")};

const FONTE_ADE_SCHEDA: ArticleSource = {
  label: ${emitTsString(
    articlesZh.find((a) => a.sources?.[0])?.sources?.[0]?.label ??
      "Agenzia delle Entrate - Veraset beyannamesi",
  )},
  href: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/dichiarazione-di-successione",
};
const FONTE_ADE_IMPOSTE: ArticleSource = {
  label: ${emitTsString("Agenzia delle Entrate - 如何缴纳税款")},
  href: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-di-successione/imposte-dichsucc-cittadini",
};
const FONTE_NORMATTIVA: ArticleSource = {
  label: ${emitTsString("Normattiva - TUS 第346/1990号立法法令")},
  href: "https://www.normattiva.it",
};

export const articlesZh: Record<string, ArticleZhOverlay> = {
`;

for (const a of articlesZh) {
  const body = a.body.map((b) => emitBlock(b, 3)).join(",\n");
  const sources = a.sources
    .map((s) => {
      if (s.href.includes("dichiarazione-di-successione/imposte"))
        return "FONTE_ADE_IMPOSTE";
      if (s.href.includes("normattiva")) return "FONTE_NORMATTIVA";
      return "FONTE_ADE_SCHEDA";
    })
    .join(", ");
  articlesTs += `  ${emitTsString(a.slug)}: {
    title: ${emitTsString(a.title)},
    excerpt: ${emitTsString(a.excerpt)},
    reviewedBy: REVIEWED,
    body: [
${body},
    ],
    sources: [${sources}],
  },
`;
}

articlesTs += `};

export function getArticleZh(slug: string): ArticleZhOverlay | undefined {
  return articlesZh[slug];
}
`;

fs.writeFileSync(path.join(root, "src/content/articles.zh.ts"), articlesTs);

const legalIt = JSON.parse(
  fs.readFileSync(path.join(__dirname, "legal_it.json"), "utf8"),
);
const legalTr = walk(legalIt);
findIt(legalTr, "legal");

let legalTs = `import type { LegalDoc, LegalSlug } from "./legal";

/*
  Chinese courtesy translation of legal documents.
  Italian version is binding — see notice on each document.
  {{tokens}} unchanged (replaced at render-time).
*/

const LANG_NOTE =
  "本文件的意大利文版本具有法律约束力：任何翻译仅供参考，如有冲突以意大利文文本为准。";

const LANG_NOTICE = {
  tone: "info" as const,
  text: LANG_NOTE,
};

export const legalDocsZh: Record<LegalSlug, LegalDoc> = {
`;

for (const slug of Object.keys(legalTr)) {
  const doc = legalTr[slug];
  const body = doc.body.map((b) => emitBlock(b, 3)).join(",\n");
  legalTs += `  ${slug}: {
    slug: ${emitTsString(doc.slug)},
    title: ${emitTsString(doc.title)},
    eyebrow: ${emitTsString(doc.eyebrow)},
    intro: ${emitTsString(doc.intro)},
    updatedAt: ${emitTsString(doc.updatedAt)},
    notice: LANG_NOTICE,
    body: [
${body},
    ],${
      doc.cta
        ? `\n    cta: { label: ${emitTsString(doc.cta.label)}, href: ${emitTsString(doc.cta.href)} },`
        : ""
    }
  },
`;
}

legalTs += `};
`;

fs.writeFileSync(path.join(root, "src/content/legal.zh.ts"), legalTs);

console.log("wrote articles.zh.ts and legal.zh.ts");
console.log("heuristic leftovers", leftovers.length);
leftovers.slice(0, 30).forEach((l) => console.log(" ", l));
