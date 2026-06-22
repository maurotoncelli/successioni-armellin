import { getClientView } from "@/lib/area";
import { getFinalDocsBytes } from "@/lib/practice-extras";
import { buildZip } from "@/lib/zip";

/*
  GET /api/area/final-docs/zip — "scarica tutto" i documenti finali della propria
  pratica in un unico ZIP. Proprieta garantita da getClientView (solo la pratica
  del cliente loggato); i file vengono letti server-side con service_role.
*/
export const runtime = "nodejs";

export async function GET() {
  const view = await getClientView();
  if (!view?.practice) {
    return new Response("Non autorizzato.", { status: 401 });
  }

  const files = await getFinalDocsBytes(view.practice.id);
  if (files.length === 0) {
    return new Response("Nessun documento disponibile.", { status: 404 });
  }

  const zip = buildZip(files);
  const fileName = `documenti-${view.practice.code}.zip`;

  return new Response(new Uint8Array(zip), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": String(zip.length),
      "Cache-Control": "no-store",
    },
  });
}
