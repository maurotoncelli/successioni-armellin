import { NextResponse } from "next/server";
import { getClientView } from "@/lib/area";
import { removeDocument } from "@/lib/documents";

// Eliminazione di un documento caricato dal CLIENTE (solo sulla propria pratica).
export async function POST(req: Request) {
  const view = await getClientView();
  if (!view?.practice) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  let index = NaN;
  let fileIdx: number | undefined;
  try {
    const body = (await req.json()) as { index?: number; fileIdx?: number };
    index = Number(body.index);
    fileIdx = body.fileIdx === undefined ? undefined : Number(body.fileIdx);
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }
  if (Number.isNaN(index) || (fileIdx !== undefined && Number.isNaN(fileIdx))) {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  try {
    await removeDocument(view.practice.id, index, fileIdx);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[area] elimina documento:", err);
    return NextResponse.json({ error: "Eliminazione non riuscita." }, { status: 500 });
  }
}
