/*
  Genera i PDF dei modelli (template) che il cliente scarica dall'area
  personale, compila, firma e ricarica. Output in public/templates/.

  Uso:  node scripts/generate-doc-templates.mjs

  I testi seguono gli artt. 46 e 47 del D.P.R. 28/12/2000 n. 445
  (dichiarazioni sostitutive di certificazione / atto di notorieta).
  Il modello "eredi" ufficiale dell'Agenzia delle Entrate e invece scaricato
  cosi com'e (dichiarazione-sostitutiva-eredi-ade.pdf, non generato qui).
*/
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "templates");

const A4 = { w: 595.28, h: 841.89 };
const MARGIN = 56;
const INK = rgb(0.12, 0.14, 0.2);
const MUTED = rgb(0.45, 0.47, 0.52);

async function buildPdf(title, subtitle, blocks, outFile) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  doc.setTitle(title);

  let page = doc.addPage([A4.w, A4.h]);
  let y = A4.h - MARGIN;
  const width = A4.w - MARGIN * 2;

  const ensureSpace = (need) => {
    if (y - need < MARGIN) {
      page = doc.addPage([A4.w, A4.h]);
      y = A4.h - MARGIN;
    }
  };

  const wrap = (text, f, size, maxWidth) => {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    for (const w of words) {
      const probe = line ? line + " " + w : w;
      if (f.widthOfTextAtSize(probe, size) > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = probe;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const para = (text, { size = 10.5, f = font, gap = 6, lead = 15, color = INK } = {}) => {
    const lines = wrap(text, f, size, width);
    ensureSpace(lines.length * lead + gap);
    for (const l of lines) {
      page.drawText(l, { x: MARGIN, y: y - lead + 4, size, font: f, color });
      y -= lead;
    }
    y -= gap;
  };

  const fieldLine = (label, { size = 10.5 } = {}) => {
    ensureSpace(26);
    const labelW = label ? font.widthOfTextAtSize(label + " ", size) : 0;
    if (label) {
      page.drawText(label, { x: MARGIN, y: y - 11, size, font, color: INK });
    }
    page.drawLine({
      start: { x: MARGIN + labelW + 2, y: y - 13 },
      end: { x: A4.w - MARGIN, y: y - 13 },
      thickness: 0.6,
      color: MUTED,
    });
    y -= 26;
  };

  const table = (headers, rows, colWidths) => {
    const size = 9;
    const rowH = 24;
    ensureSpace(rowH * (rows + 1) + 10);
    let x = MARGIN;
    const xs = [MARGIN];
    for (const cw of colWidths) {
      x += cw * width;
      xs.push(x);
    }
    // intestazioni
    headers.forEach((h, i) => {
      page.drawText(h, { x: xs[i] + 3, y: y - 12, size, font: bold, color: INK });
    });
    y -= 16;
    // griglia
    const top = y;
    for (let r = 0; r <= rows; r += 1) {
      page.drawLine({
        start: { x: MARGIN, y: top - r * rowH },
        end: { x: A4.w - MARGIN, y: top - r * rowH },
        thickness: 0.6,
        color: MUTED,
      });
    }
    for (const gx of xs) {
      page.drawLine({
        start: { x: gx, y: top },
        end: { x: gx, y: top - rows * rowH },
        thickness: 0.6,
        color: MUTED,
      });
    }
    y = top - rows * rowH - 12;
  };

  const gap = (n = 8) => {
    y -= n;
  };

  // Intestazione documento
  para(title.toUpperCase(), { f: bold, size: 13, lead: 18, gap: 2 });
  para(subtitle, { size: 9.5, color: MUTED, gap: 14 });

  for (const b of blocks) {
    if (b.t === "p") para(b.text, b.opts ?? {});
    else if (b.t === "b") para(b.text, { f: bold, ...(b.opts ?? {}) });
    else if (b.t === "f") fieldLine(b.label ?? "", b.opts ?? {});
    else if (b.t === "table") table(b.headers, b.rows, b.colWidths);
    else if (b.t === "gap") gap(b.n);
  }

  const bytes = await doc.save();
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, outFile), bytes);
  console.log("scritto", outFile, bytes.length, "bytes");
}

const LEGALE =
  "Il/La sottoscritto/a e' consapevole delle sanzioni penali previste dall'art. 76 del D.P.R. 445/2000 in caso di dichiarazioni non veritiere, di formazione o uso di atti falsi, e della decadenza dai benefici prevista dall'art. 75 del medesimo decreto.";

const DICHIARANTE = [
  { t: "b", text: "Il/La sottoscritto/a (dichiarante)" },
  { t: "f", label: "Cognome e nome:" },
  { t: "f", label: "Nato/a a:                                              il:" },
  { t: "f", label: "Residente in (Comune, prov., via e n. civico):" },
  { t: "f", label: "Codice fiscale:" },
  { t: "p", text: LEGALE, opts: { size: 9, color: MUTED } },
];

const FIRMA = [
  { t: "gap", n: 8 },
  { t: "f", label: "Luogo e data:" },
  { t: "gap", n: 4 },
  { t: "f", label: "Firma del/della dichiarante:" },
  { t: "gap", n: 6 },
  {
    t: "p",
    text: "Allegare copia di un documento d'identita in corso di validita del dichiarante. Dichiarazione esente da imposta di bollo ai sensi dell'art. 37 del D.P.R. 445/2000. Non serve autentica della firma.",
    opts: { size: 9, color: MUTED },
  },
];

await buildPdf(
  "Dichiarazione sostitutiva del certificato di morte",
  "Resa ai sensi dell'art. 46 del D.P.R. 28 dicembre 2000, n. 445 - Modello predisposto dallo Studio Armellin, successioniarmellin.it",
  [
    ...DICHIARANTE,
    { t: "gap", n: 6 },
    { t: "b", text: "DICHIARA" },
    { t: "p", text: "che il/la Sig./Sig.ra di seguito indicato/a e' deceduto/a:" },
    { t: "f", label: "Cognome e nome del/della defunto/a:" },
    { t: "f", label: "Nato/a a:                                              il:" },
    { t: "f", label: "Codice fiscale:" },
    { t: "f", label: "Deceduto/a in data:" },
    { t: "f", label: "Comune (e prov.) del decesso:" },
    { t: "f", label: "Ultima residenza (Comune, prov., via e n. civico):" },
    { t: "f", label: "Rapporto di parentela del dichiarante con il/la defunto/a:" },
    ...FIRMA,
  ],
  "dichiarazione-sostitutiva-certificato-morte.pdf",
);

await buildPdf(
  "Dichiarazione sostitutiva di stato di famiglia e albero genealogico",
  "Ai fini successori - Resa ai sensi degli artt. 46 e 47 del D.P.R. 28 dicembre 2000, n. 445 - Modello predisposto dallo Studio Armellin, successioniarmellin.it",
  [
    ...DICHIARANTE,
    { t: "gap", n: 6 },
    { t: "b", text: "DICHIARA" },
    {
      t: "p",
      text: "in relazione alla successione del/della Sig./Sig.ra:",
    },
    { t: "f", label: "Cognome e nome del/della defunto/a:" },
    { t: "f", label: "Codice fiscale:                                        deceduto/a il:" },
    { t: "gap", n: 4 },
    {
      t: "p",
      text: "A) che lo stato di famiglia del/della defunto/a alla data del decesso era composto dalle seguenti persone:",
    },
    {
      t: "table",
      headers: ["Cognome e nome", "Luogo e data di nascita", "Rapporto con il defunto"],
      rows: 4,
      colWidths: [0.4, 0.34, 0.26],
    },
    {
      t: "p",
      text: "B) che gli eredi / chiamati all'eredita del/della defunto/a sono i seguenti (compreso il dichiarante; indicare anche gli eventuali rinunciatari):",
    },
    {
      t: "table",
      headers: ["Cognome e nome", "Luogo e data di nascita", "Codice fiscale", "Parentela"],
      rows: 6,
      colWidths: [0.3, 0.26, 0.26, 0.18],
    },
    {
      t: "p",
      text: "C) che il/la defunto/a (barrare la casella che interessa):  [  ] NON ha lasciato testamento    [  ] HA lasciato testamento, pubblicato con verbale registrato presso l'Ufficio di __________________________ in data ____________ al n. ____________;",
    },
    {
      t: "p",
      text: "D) che non esistono altri eredi o chiamati all'eredita oltre a quelli sopra indicati, che tra gli eredi [  ] NON vi sono / [  ] vi sono soggetti minorenni o incapaci, e che non vi sono cause di indegnita a succedere (art. 463 c.c.).",
    },
    ...FIRMA,
  ],
  "dichiarazione-sostitutiva-stato-famiglia-albero.pdf",
);
