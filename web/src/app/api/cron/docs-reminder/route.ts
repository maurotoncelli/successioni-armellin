import { NextResponse } from "next/server";
import { runDocsReminders } from "@/lib/docs-reminder";

/*
  Cron Vercel: sollecito documenti 24h dopo l'avvio, poi ogni 48h.
  Schedule in web/vercel.json. Auth: CRON_SECRET (Bearer) oppure header
  x-vercel-cron impostato da Vercel.
*/

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (secret) return auth === `Bearer ${secret}`;
  if (req.headers.get("x-vercel-cron") === "1") return true;
  return process.env.NODE_ENV !== "production";
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runDocsReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[cron/docs-reminder]", err);
    return NextResponse.json({ ok: false, error: "run failed" }, { status: 500 });
  }
}
