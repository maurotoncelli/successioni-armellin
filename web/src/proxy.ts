import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, hashToken } from "@/lib/admin-auth";

export async function proxy(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  // Gate disattivato finche non viene impostata una password (demo accessibile).
  if (!password) return NextResponse.next();

  const expected = await hashToken(password);
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;

  if (cookie === expected) return NextResponse.next();

  const loginUrl = new URL("/crm-login", req.url);
  loginUrl.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/crm", "/crm/:path*"],
};
