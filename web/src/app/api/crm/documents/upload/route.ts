import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import {
  uploadDocument,
  setDocStatus,
  ALLOWED_DOC_TYPES,
  MAX_DOC_BYTES,
} from "@/lib/documents";

// Upload di un documento della CHECKLIST da parte dell'admin (CRM): serve per
// i clienti seguiti di persona in studio, dove i documenti li carica Lorenzo.
// Il documento nasce direttamente APPROVATO (lo ha verificato lui caricandolo).
export async function POST(req: Request) {
  await requireAdmin();

  const form = await req.formData();
  const file = form.get("file");
  const practiceId = String(form.get("practiceId") ?? "");
  const index = Number(form.get("index"));

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
    await uploadDocument(practiceId, index, file);
    await setDocStatus(practiceId, index, "APPROVATO");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error && err.message.startsWith("Massimo")
        ? err.message
        : "Caricamento non riuscito, riprova.";
    if (message.startsWith("Caricamento"))
      console.error("[crm] upload documento checklist:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
