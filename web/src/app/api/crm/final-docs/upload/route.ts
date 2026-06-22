import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { addFinalDocument } from "@/lib/practice-extras";
import { ALLOWED_DOC_TYPES, MAX_DOC_BYTES } from "@/lib/documents";

// Upload di un documento FINALE da parte dell'admin (CRM) sulla pratica.
export async function POST(req: Request) {
  await requireAdmin();

  const form = await req.formData();
  const file = form.get("file");
  const practiceId = String(form.get("practiceId") ?? "");
  const label = String(form.get("label") ?? "");

  if (!(file instanceof File) || !practiceId) {
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
    await addFinalDocument(practiceId, label, file);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[crm] upload documento finale:", err);
    return NextResponse.json(
      { error: "Caricamento non riuscito, riprova." },
      { status: 500 },
    );
  }
}
