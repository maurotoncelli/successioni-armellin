import { NextResponse } from "next/server";
import { getClientView } from "@/lib/area";
import { actionText } from "@/lib/action-locale";
import { signedDraftUrl } from "@/lib/documents";

/*
  Download della BOZZA precompilata da Lorenzo, da parte del CLIENTE.
  La proprieta e garantita da getClientView (sessione): la pratica e sempre la
  propria, quindi l'index basta a identificare la voce. Rotta GET navigata da un
  link (target="_blank"): niente window.open dopo un await (popup blocker).
  Sola lettura: redirect a un URL firmato temporaneo del bucket privato.
*/
export async function GET(req: Request) {
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

  const index = Number(new URL(req.url).searchParams.get("index"));
  if (!Number.isInteger(index) || index < 0) {
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

  const url = await signedDraftUrl(view.practice.id, index);
  if (!url) {
    return NextResponse.json(
      {
        error: await actionText(
          "area_errors",
          "request_invalid",
          "Nessuna bozza disponibile.",
        ),
      },
      { status: 404 },
    );
  }
  return NextResponse.redirect(url);
}
