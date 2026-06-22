import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { recordManualInvoice } from "@/lib/invoice";

/*
  Registrazione MANUALE della fattura (CRM): Lorenzo inserisce numero + data e,
  opzionalmente, allega il PDF emesso dal suo gestionale (Aruba/altro). Usa il
  route handler invece di una server action per gestire l'upload del file
  (multipart, senza il limite 1MB delle server action).
*/
export async function POST(req: Request) {
  await requireAdmin();

  const form = await req.formData();
  const practiceId = String(form.get("practiceId") ?? "");
  const number = String(form.get("number") ?? "");
  const issuedAt = String(form.get("issuedAt") ?? "");
  const amountRaw = String(form.get("amount") ?? "");
  const file = form.get("file");

  if (!practiceId || !number.trim()) {
    return NextResponse.json(
      { error: "Numero fattura e pratica obbligatori." },
      { status: 400 },
    );
  }

  let pdf: { bytes: Uint8Array; contentType?: string; sourceName?: string } | undefined;
  if (file instanceof File && file.size > 0) {
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "La fattura deve essere un PDF." },
        { status: 415 },
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File troppo grande (massimo 10 MB)." },
        { status: 413 },
      );
    }
    pdf = {
      bytes: new Uint8Array(await file.arrayBuffer()),
      contentType: file.type,
      sourceName: file.name,
    };
  }

  const amount = Number(amountRaw.replace(",", "."));
  const res = await recordManualInvoice(
    practiceId,
    { number, issuedAt, amount: Number.isFinite(amount) ? amount : undefined },
    pdf,
  );
  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: 400 });
  }

  revalidatePath(`/crm/pratiche/${practiceId}`);
  revalidatePath("/area-riservata/ordine");
  return NextResponse.json({ ok: true, number: res.number });
}
