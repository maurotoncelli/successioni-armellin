import { NextResponse } from "next/server";
import { getClientView } from "@/lib/area";
import { isPracticeCancelled } from "@/content/area-data";
import {
  uploadDocument,
  ALLOWED_DOC_TYPES,
  MAX_DOC_BYTES,
} from "@/lib/documents";
import { pushCrmNotification } from "@/lib/crm-notifications";

// Upload di un documento da parte del CLIENTE. La proprieta e garantita da
// getClientView (sessione): si carica solo sulla propria pratica.
export async function POST(req: Request) {
  const view = await getClientView();
  if (!view?.practice) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }
  if (isPracticeCancelled(view.practice)) {
    return NextResponse.json(
      { error: "La pratica è annullata: i caricamenti sono disattivati." },
      { status: 403 },
    );
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
    // Dedupe 30': gli upload multi-file della stessa voce (es. fronte/retro)
    // generano UNA notifica, non una per file.
    await pushCrmNotification({
      kind: "documenti",
      title: `Documento caricato: ${item.label}`,
      body: `${view.practice.clientName || "Il cliente"} ha caricato un documento nell'area personale.`,
      practiceId: view.practice.id,
      practiceCode: view.practice.code,
      dedupeMinutes: 30,
    });
    return NextResponse.json({
      ok: true,
      files: (item.files ?? []).map((f) => f.name),
    });
  } catch (err) {
    const message =
      err instanceof Error && err.message.startsWith("Massimo")
        ? err.message
        : "Caricamento non riuscito, riprova.";
    if (message.startsWith("Caricamento")) console.error("[area] upload documento:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
