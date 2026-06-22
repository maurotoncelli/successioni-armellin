import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/*
  Proxy (Next 16, runtime Node): rinnova la sessione Supabase (cookie) per le aree
  autenticate. Il GATING vero e demandato ai layout:
  - /area-riservata -> requireClientView (lib/area)
  - /crm            -> requireAdmin (lib/admin): emergenza / aperto / ADMIN+2FA
*/

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/area-riservata") || pathname.startsWith("/crm")) {
    return updateSession(req);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/crm", "/crm/:path*", "/area-riservata", "/area-riservata/:path*"],
};
