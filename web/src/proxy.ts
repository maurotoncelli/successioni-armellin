import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isLocale } from "@/lib/content";

/*
  Proxy (Next 16, runtime Node):
  - rinnova la sessione Supabase su /area-riservata e /crm
  - sincronizza ?lang= → cookie + header x-locale cosi i Server Component
    leggono la lingua gia al primo hit (anche senza cookie precedente)
*/

const LANG_MAX_AGE = 60 * 60 * 24 * 365;

function resolveLocale(req: NextRequest): string | null {
  const fromQuery = req.nextUrl.searchParams.get("lang");
  const fromCookie = req.cookies.get("lang")?.value;
  if (isLocale(fromQuery)) return fromQuery;
  if (isLocale(fromCookie)) return fromCookie;
  return null;
}

function withLocaleHeaders(req: NextRequest, locale: string | null): Headers {
  const headers = new Headers(req.headers);
  if (locale) headers.set("x-locale", locale);
  return headers;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const fromQuery = req.nextUrl.searchParams.get("lang");
  const locale = resolveLocale(req);
  const requestHeaders = withLocaleHeaders(req, locale);

  let response: NextResponse;
  if (pathname.startsWith("/area-riservata") || pathname.startsWith("/crm")) {
    response = await updateSession(req, requestHeaders);
  } else {
    response = NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  if (isLocale(fromQuery)) {
    response.cookies.set("lang", fromQuery, {
      path: "/",
      maxAge: LANG_MAX_AGE,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
