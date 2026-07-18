import { NextResponse } from "next/server";
import { getClientView } from "@/lib/area";
import { isPracticeCancelled } from "@/content/area-data";
import {
  uploadDocument,
  ALLOWED_DOC_TYPES,
  MAX_DOC_BYTES,
  MAX_FILES_PER_ITEM,
  DOC_ERR_MAX_FILES,
  DOC_ERR_ITEM_NOT_FOUND,
} from "@/lib/documents";
import { pushCrmNotification } from "@/lib/crm-notifications";
import { getAdminClient } from "@/lib/supabase/admin";
import type { LogEvent } from "@/content/crm-data";
import { actionText } from "@/lib/action-locale";

// Upload di un documento da parte del CLIENTE. La proprieta e garantita da
// getClientView (sessione): si carica solo sulla propria pratica.
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
          "La pratica è annullata: i caricamenti sono disattivati.",
        ),
      },
      { status: 403 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  const index = Number(form.get("index"));

  if (!(file instanceof File) || Number.isNaN(index)) {
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
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error: await actionText(
          "area_errors",
          "file_bad_type",
          "Formato non ammesso. Usa PDF, JPG o PNG.",
        ),
      },
      { status: 415 },
    );
  }
  if (file.size > MAX_DOC_BYTES) {
    return NextResponse.json(
      {
        error: await actionText(
          "area_errors",
          "file_too_big",
          "File troppo grande (massimo 10 MB).",
        ),
      },
      { status: 413 },
    );
  }

  try {
    const { item, wasRejected, otherRejectedRemaining } = await uploadDocument(
      view.practice.id,
      index,
      file,
    );

    // Correzione completata: il cliente ha ricaricato l'ULTIMA voce rifiutata.
    // La palla torna a Lorenzo anche se il cliente non ripreme "Ho finito"
    // (il badge era passato a CLIENT al momento del rifiuto).
    if (wasRejected && !otherRejectedRemaining) {
      const admin = getAdminClient();
      const { data } = await admin
        .from("practices")
        .select("log")
        .eq("id", view.practice.id)
        .maybeSingle();
      const log: LogEvent[] = Array.isArray(data?.log)
        ? (data.log as LogEvent[])
        : [];
      log.push({
        action: "documento_ricaricato_dopo_rifiuto",
        at: new Date().toISOString().slice(0, 16).replace("T", " "),
      });
      await admin
        .from("practices")
        .update({ log, action_owner: "ADMIN" })
        .eq("id", view.practice.id);
    }

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
    const code = err instanceof Error ? err.message : "";
    if (code === DOC_ERR_MAX_FILES) {
      const tpl = await actionText(
        "area_errors",
        "max_files",
        "Massimo {n} file per documento: elimina un file per caricarne un altro.",
      );
      return NextResponse.json(
        { error: tpl.replace("{n}", String(MAX_FILES_PER_ITEM)) },
        { status: 400 },
      );
    }
    if (code === DOC_ERR_ITEM_NOT_FOUND) {
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
    console.error("[area] upload documento:", err);
    return NextResponse.json(
      {
        error: await actionText(
          "area_errors",
          "upload_failed",
          "Caricamento non riuscito.",
        ),
      },
      { status: 500 },
    );
  }
}
