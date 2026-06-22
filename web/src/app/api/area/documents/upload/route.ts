import { NextResponse } from "next/server";
import { getClientView } from "@/lib/area";
import {
  uploadDocument,
  ALLOWED_DOC_TYPES,
  MAX_DOC_BYTES,
} from "@/lib/documents";

// Upload di un documento da parte del CLIENTE. La proprieta e garantita da
// getClientView (sessione): si carica solo sulla propria pratica.
export async function POST(req: Request) {
  const view = await getClientView();
  if (!view?.practice) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const index = Number(form.get("index"));

  if (!(file instanceof File) || Number.isNaN(index)) {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato non ammesso. Usa PDF, JPG o PNG." },
      { status: 415 },
    );
  }
  if (file.size > MAX_DOC_BYTES) {
    return NextResponse.json(
      { error: "File troppo grande (massimo 10 MB)." },
      { status: 413 },
    );
  }

  try {
    const item = await uploadDocument(view.practice.id, index, file);
    return NextResponse.json({ ok: true, fileName: item.fileName });
  } catch (err) {
    console.error("[area] upload documento:", err);
    return NextResponse.json(
      { error: "Caricamento non riuscito, riprova." },
      { status: 500 },
    );
  }
}
