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
  try {
    const body = (await req.json()) as { index?: number };
    index = Number(body.index);
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }
  if (Number.isNaN(index)) {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  try {
    await removeDocument(view.practice.id, index);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[area] elimina documento:", err);
    return NextResponse.json({ error: "Eliminazione non riuscita." }, { status: 500 });
  }
}
