import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getClientView } from "@/lib/area";
import { ADMIN_COOKIE, hashToken } from "@/lib/admin-auth";
import { DOC_BUCKET } from "@/lib/documents";
import { adminEmails, ensureProfile } from "@/lib/profiles";
import { createServerSupabase, isAuthConfigured } from "@/lib/supabase/ssr";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

/*
  Download modelli PDF caricati da Lorenzo (Storage privato).
  Accessibile a cliente loggato oppure admin CRM.
*/

const PREFIX = "site/doc-templates/";

async function isCrmAdmin(): Promise<boolean> {
  const pwd = process.env.ADMIN_PASSWORD;
  if (pwd) {
    const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
    if (cookie === (await hashToken(pwd))) return true;
  }
  if (!isAuthConfigured) return !pwd; // demo aperto
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { role } = await ensureProfile(user);
  if (role !== "ADMIN") return false;
  if (adminEmails().length > 0) {
    const email = (user.email ?? "").toLowerCase();
    if (!adminEmails().includes(email)) return false;
  }
  return true;
}

export async function GET(req: Request) {
  if (!isAdminConfigured) {
    return NextResponse.json({ error: "Non disponibile" }, { status: 503 });
  }

  const path = new URL(req.url).searchParams.get("path") ?? "";
  if (!path.startsWith(PREFIX) || path.includes("..")) {
    return NextResponse.json({ error: "Path non valido" }, { status: 400 });
  }

  const client = await getClientView();
  if (!client && !(await isCrmAdmin())) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { data, error } = await getAdminClient()
    .storage.from(DOC_BUCKET)
    .download(path);
  if (error || !data) {
    return NextResponse.json({ error: "File non trovato" }, { status: 404 });
  }

  const filename = path.split("/").pop() || "modello.pdf";
  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
