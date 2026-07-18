import { NextResponse } from "next/server";
import { getClientView } from "@/lib/area";
import { actionText } from "@/lib/action-locale";
import { isPracticeCancelled } from "@/content/area-data";
import { removeDocument } from "@/lib/documents";

// Eliminazione di un documento caricato dal CLIENTE (solo sulla propria pratica).
export async function POST(req: Request) {
  const view = await getClientView();
  if (!view?.practice) {
    return NextResponse.json(
      {
        error: await actionText(
          "area_errors",
          "not_authorized",
          "Non autorizzato.",
        ),
      },
      { status: 401 },
    );
  }
  if (isPracticeCancelled(view.practice)) {
    return NextResponse.json(
      {
        error: await actionText(
          "area_errors",
          "practice_cancelled",
          "Pratica annullata: operazione non disponibile.",
        ),
      },
      { status: 403 },
    );
  }

  let index = NaN;
  let fileIdx: number | undefined;
  try {
    const body = (await req.json()) as { index?: number; fileIdx?: number };
    index = Number(body.index);
    fileIdx = body.fileIdx === undefined ? undefined : Number(body.fileIdx);
  } catch {
    return NextResponse.json(
      {
        error: await actionText(
          "area_errors",
          "request_invalid",
          "Richiesta non valida.",
        ),
      },
      { status: 400 },
    );
  }
  if (Number.isNaN(index) || (fileIdx !== undefined && Number.isNaN(fileIdx))) {
    return NextResponse.json(
      {
        error: await actionText(
          "area_errors",
          "request_invalid",
          "Richiesta non valida.",
        ),
      },
      { status: 400 },
    );
  }

  try {
    await removeDocument(view.practice.id, index, fileIdx);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[area] elimina documento:", err);
    return NextResponse.json(
      {
        error: await actionText(
          "area_errors",
          "delete_failed",
          "Eliminazione non riuscita.",
        ),
      },
      { status: 500 },
    );
  }
}
