import "server-only";
import { randomBytes } from "node:crypto";
import { PDFDocument, PDFHexString, PDFName, PDFString } from "pdf-lib";

/*
  Conversione immagine (JPG/PNG) -> PDF/A-1b a pagina singola, usata dall'export
  XML SUC13: le specifiche tecniche AdE accettano come allegati (Quadro EG) solo
  PDF/A-1a, PDF/A-1b o TIFF, max 5 MB per file. I clienti caricano soprattutto
  foto: gli originali in storage NON vengono toccati, la conversione avviene al
  volo in fase di export.

  Ricetta PDF/A-1b applicata qui:
  - OutputIntent GTS_PDFA1 con profilo ICC sRGB incorporato (profilo compatto
    CC0 da github.com/saucecontrol/Compact-ICC-Profiles, inlined in base64);
  - metadati XMP (pdfaid:part=1, pdfaid:conformance=B) coerenti con l'Info dict;
  - /ID nel trailer, niente object stream (PDF 1.4), header %PDF-1.4;
  - nessun font, nessuna cifratura; l'immagine e' incorporata cosi' com'e'.

  Nota: i JPEG non hanno trasparenza (ok). I PNG con canale alfa introducono un
  SMask, vietato in PDF/A-1: caso raro per foto di documenti, segnalato dal
  validatore AdE se capita (il cliente puo' ricaricare in JPG).

  La pagina e' A4 (ritratto o paesaggio secondo l'immagine), immagine centrata
  e scalata a riempire mantenendo le proporzioni, come una scansione.
*/

const A4 = { w: 595.28, h: 841.89 }; // punti (72 dpi)

// sRGB v2 "magic" (736 byte, CC0) - sufficiente come DestOutputProfile PDF/A.
const SRGB_ICC_BASE64 =
  "AAAC4GxjbXMCEAAAbW50clJHQiBYWVogB+IAAwAUAAkADgAdYWNzcE1TRlQAAAAAc2F3c2N0cmwAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1oYW5kk7I0qQ6wIoqY/Zqvo2eJmwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJZGVzYwAAAPAAAABfY3BydAAAAQwAAAAMd3RwdAAAARgAAAAUclhZWgAAASwAAAAUZ1hZWgAAAUAAAAAUYlhZWgAAAVQAAAAUclRSQwAAAWgAAAF4Z1RSQwAAAWgAAAF4YlRSQwAAAWgAAAF4ZGVzYwAAAAAAAAAFc1JHQgAAAAAAAAAAAAAAAHRleHQAAAAAQ0MwAFhZWiAAAAAAAADzVAABAAAAARbJWFlaIAAAAAAAAG+gAAA48gAAA49YWVogAAAAAAAAYpYAALeJAAAY2lhZWiAAAAAAAAAkoAAAD4UAALbEY3VydgAAAAAAAAC2AAAAHAA4AFQAcACMAKgAxADhAQABIgFGAW0BlQHBAfACIAJVAosCxAMBAz8DggPGBA4EWQSnBPkFTAWkBf4GXAa+ByEHigf0CGMI1QlJCcMKPwq/C0ILyQxUDOENdA4JDqIPQA/gEIURLRHaEooTPhP2FLIVcRY2Fv0XyhiZGW4aRhsiHAMc5x3QHr0friCkIZ4inCOfJKUlsSbAJ9Uo7SoKKyssUS18Lqov3jEWMlIzlDTZNiQ3czjGOiA7fDzfPkU/sEEhQpZEEEWPRxJIm0ooS7tNUU7uUI9SNVPgVZBXRVkAWr5chF5MYBth72PHZaZniWlxa19tUW9KcUZzSnVRd155cXuIfaZ/yIHwhB6GUIiJisWNCY9RkZ+T85ZLmKubDp14n+eiW6TWp1ap26xnrvexj7Qqtsy5dLwhvtXBjcRMxxDJ2syrz3/SXNU92CTbEt4E4P7j/OcB6gztHPA081D2c/mb/Mr//w==";

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function xmpPacket(title: string, isoDate: string): string {
  return `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
   <pdfaid:part>1</pdfaid:part>
   <pdfaid:conformance>B</pdfaid:conformance>
  </rdf:Description>
  <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${xmlEscape(title)}</rdf:li></rdf:Alt></dc:title>
  </rdf:Description>
  <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">
   <xmp:CreateDate>${isoDate}</xmp:CreateDate>
   <xmp:ModifyDate>${isoDate}</xmp:ModifyDate>
   <xmp:CreatorTool>Successioni Armellin</xmp:CreatorTool>
  </rdf:Description>
  <rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
   <pdf:Producer>Successioni Armellin - export SUC13</pdf:Producer>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

export async function imageToPdf(
  bytes: Uint8Array,
  mime: "image/jpeg" | "image/png",
  title: string,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const now = new Date();
  // Millisecondi azzerati: la data XMP (senza ms) deve equivalere a quella
  // dell'Info dict, come richiesto dal PDF/A.
  now.setMilliseconds(0);
  doc.setTitle(title);
  doc.setProducer("Successioni Armellin - export SUC13");
  doc.setCreator("Successioni Armellin");
  doc.setCreationDate(now);
  doc.setModificationDate(now);

  const image =
    mime === "image/jpeg" ? await doc.embedJpg(bytes) : await doc.embedPng(bytes);

  const landscape = image.width > image.height;
  const page = doc.addPage(landscape ? [A4.h, A4.w] : [A4.w, A4.h]);
  const { width: pw, height: ph } = page.getSize();

  const scale = Math.min(pw / image.width, ph / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  page.drawImage(image, {
    x: (pw - w) / 2,
    y: (ph - h) / 2,
    width: w,
    height: h,
  });

  // --- Marcatori PDF/A-1b ---
  const ctx = doc.context;

  // 1) OutputIntent GTS_PDFA1 con profilo sRGB incorporato.
  const iccStream = ctx.stream(Buffer.from(SRGB_ICC_BASE64, "base64"), { N: 3 });
  const iccRef = ctx.register(iccStream);
  const outputIntent = ctx.obj({
    Type: "OutputIntent",
    S: "GTS_PDFA1",
    OutputConditionIdentifier: PDFString.of("sRGB"),
    Info: PDFString.of("sRGB IEC61966-2.1"),
    RegistryName: PDFString.of("http://www.color.org"),
    DestOutputProfile: iccRef,
  });
  doc.catalog.set(PDFName.of("OutputIntents"), ctx.obj([ctx.register(outputIntent)]));

  // 2) Metadati XMP (stream NON compresso, come da specifica XMP/PDF-A).
  const isoDate = now.toISOString().replace(/\.000Z$/, "Z");
  const xmpStream = ctx.stream(Buffer.from(xmpPacket(title, isoDate), "utf8"), {
    Type: "Metadata",
    Subtype: "XML",
  });
  doc.catalog.set(PDFName.of("Metadata"), ctx.register(xmpStream));

  // 3) /ID nel trailer (obbligatorio in PDF/A).
  const id = PDFHexString.of(randomBytes(16).toString("hex").toUpperCase());
  ctx.trailerInfo.ID = ctx.obj([id, id]);

  // 4) Niente object/xref stream (feature PDF 1.5+, vietate in PDF/A-1)...
  const out = await doc.save({ useObjectStreams: false });
  // ...e header %PDF-1.4 (PDF/A-1 e' basato su PDF 1.4). Stessa lunghezza in
  // byte del default %PDF-1.7: gli offset della xref restano validi.
  out[7] = 0x34; // "7" -> "4"
  return out;
}
