import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { signedDocUrl, signedDraftUrl } from "@/lib/documents";

/*
  Apertura di un documento della checklist dal CRM.
  Rotta GET navigata direttamente da un link (target="_blank"): prima il client
  faceva window.open DOPO l'await della server action e i popup blocker
  (Safari in primis) bloccavano la nuova scheda in silenzio.
  Sola lettura: redirect a un URL firmato temporaneo del bucket privato.

  kind=draft apre la BOZZA precompilata da Lorenzo (cartella drafts/), distinta
  dai file caricati dal cliente (kind assente / "file").
*/
export async function GET(req: Request) {
  await requireAdmin();

  const sp = new URL(req.url).searchParams;
  const practiceId = sp.get("practiceId") ?? "";
  const index = Number(sp.get("index"));
  const fileIdx = Number(sp.get("file") ?? "0");
  const kind = sp.get("kind") ?? "file";

  if (
    !practiceId ||
    !Number.isInteger(index) ||
    index < 0 ||
    !Number.isInteger(fileIdx) ||
    fileIdx < 0
  ) {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const url =
    kind === "draft"
      ? await signedDraftUrl(practiceId, index)
      : await signedDocUrl(practiceId, index, fileIdx);
  if (!url) {
    return NextResponse.json({ error: "Nessun file disponibile." }, { status: 404 });
  }
  return NextResponse.redirect(url);
}
