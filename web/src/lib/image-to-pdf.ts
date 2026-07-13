import "server-only";
import { PDFDocument } from "pdf-lib";

/*
  Conversione immagine (JPG/PNG) -> PDF a pagina singola, usata dall'export XML
  SUC13: il tracciato AdE accetta come allegati (Quadro EG) solo PDF e TIFF,
  mentre i clienti caricano soprattutto foto. Gli originali in storage NON
  vengono toccati: la conversione avviene al volo in fase di export.

  La pagina e in formato A4 (ritratto o paesaggio a seconda dell'immagine) e
  l'immagine viene scalata per riempirla mantenendo le proporzioni: e il layout
  che ci si aspetta da un documento scansionato.

  Nota PDF/A: il risultato e un PDF standard pulito con metadati; se il modulo
  di controllo del Desktop Telematico dovesse pretendere PDF/A rigoroso
  (OutputIntent ICC + XMP), la generazione andra estesa qui.
*/

const A4 = { w: 595.28, h: 841.89 }; // punti (72 dpi)

export async function imageToPdf(
  bytes: Uint8Array,
  mime: "image/jpeg" | "image/png",
  title: string,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(title);
  doc.setProducer("Successioni Armellin - export SUC13");
  doc.setCreationDate(new Date());
  doc.setModificationDate(new Date());

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

  return doc.save();
}
