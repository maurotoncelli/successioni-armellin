import { NextResponse } from "next/server";
import { getClientView } from "@/lib/area";
import { isPracticeCancelled } from "@/content/area-data";
import { attachMandateFile } from "@/lib/practice-extras";
import { ALLOWED_DOC_TYPES, MAX_DOC_BYTES } from "@/lib/documents";
import { pushCrmNotification } from "@/lib/crm-notifications";

// Upload del mandato cartaceo firmato (alternativa alla firma elettronica).
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
  if (!(file instanceof File)) {
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
    await attachMandateFile(view.practice.id, view.account.name, file);
    await pushCrmNotification({
      kind: "mandato",
      title: "Mandato firmato caricato dal cliente",
      body: `${view.account.name || "Il cliente"} ha caricato il mandato firmato (PDF/scansione).`,
      practiceId: view.practice.id,
      practiceCode: view.practice.code,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[area] upload mandato:", err);
    return NextResponse.json(
      { error: "Caricamento non riuscito, riprova." },
      { status: 500 },
    );
  }
}
