import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import {
  setDraft,
  ALLOWED_DOC_TYPES,
  MAX_DOC_BYTES,
  DOC_ERR_ITEM_NOT_FOUND,
} from "@/lib/documents";
import { revalidatePath } from "next/cache";

// Upload (o sostituzione) della BOZZA precompilata di una voce della checklist,
// da parte dell'admin (CRM). La bozza e distinta dai file del cliente: NON
// approva la voce e NON ne cambia lo stato. L'eventuale avviso al cliente
// (email + notifica) parte a valle via notifyDraftReadyAction.
export async function POST(req: Request) {
  await requireAdmin();

  const form = await req.formData();
  const file = form.get("file");
  const practiceId = String(form.get("practiceId") ?? "");
  const index = Number(form.get("index"));
  const note = String(form.get("note") ?? "");

  if (!(file instanceof File) || !practiceId || Number.isNaN(index)) {
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
    await setDraft(practiceId, index, file, note);
    revalidatePath(`/crm/pratiche/${practiceId}`);
    revalidatePath("/area-riservata/documenti");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const code = err instanceof Error ? err.message : "";
    if (code === DOC_ERR_ITEM_NOT_FOUND) {
      return NextResponse.json({ error: "Voce non trovata." }, { status: 400 });
    }
    console.error("[crm] upload bozza:", err);
    return NextResponse.json(
      { error: "Caricamento non riuscito, riprova." },
      { status: 500 },
    );
  }
}
