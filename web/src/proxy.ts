import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isLocale } from "@/lib/content";
import {
  isSeoExemptPath,
  isSeoPathLocale,
  localePath,
  stripSeoLocalePrefix,
} from "@/lib/seo-locale";

/*
  Proxy (Next 16, runtime Node):
  - rinnova la sessione Supabase su /area-riservata e /crm
  - SEO Fase A: prefisso /ar → rewrite interno + x-locale; IT senza prefisso
  - ?lang=ar su path nudo → redirect 308 a /ar/...
  - cookie lang=ar su path pubblico nudo → redirect a /ar/... (UX coerente)
*/

const LANG_MAX_VALUE_AGE = 60 * 60 * 24 * 365;

function withLocaleHeaders(
  req: NextRequest,
  locale: string | null,
  barePathname: string,
): Headers {
  const headers = new Headers(req.headers);
  if (locale) headers.set("x-locale", locale);
  headers.set("x-pathname", barePathname);
  return headers;
}

function setLangCookie(res: NextResponse, locale: string) {
  res.cookies.set("lang", locale, {
    path: "/",
    maxAge: LANG_MAX_VALUE_AGE,
    sameSite: "lax",
  });
}

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const rawPath = url.pathname;
  const fromQuery = url.searchParams.get("lang");
  const fromCookie = req.cookies.get("lang")?.value ?? null;

  const { locale: pathLocale, pathname: barePath } =
    stripSeoLocalePrefix(rawPath);

  // /ar/area-riservata (o crm/api) → togli prefisso SEO (non indicizzabili).
  if (pathLocale && isSeoExemptPath(barePath)) {
    const dest = req.nextUrl.clone();
    dest.pathname = barePath;
    return NextResponse.redirect(dest, 308);
  }

  // ?lang=ar su URL senza prefisso → /ar/... (SEO + bookmark puliti).
  if (
    isSeoPathLocale(fromQuery) &&
    !pathLocale &&
    !isSeoExemptPath(barePath)
  ) {
    const dest = req.nextUrl.clone();
    dest.pathname = localePath(barePath, fromQuery);
    dest.searchParams.delete("lang");
    const res = NextResponse.redirect(dest, 308);
    setLangCookie(res, fromQuery);
    return res;
  }

  // Cookie AR + visita path pubblico IT → /ar/... (link interni senza prefisso).
  if (
    !pathLocale &&
    isSeoPathLocale(fromCookie) &&
    !isSeoExemptPath(barePath) &&
    !isSeoPathLocale(fromQuery)
  ) {
    const dest = req.nextUrl.clone();
    dest.pathname = localePath(barePath, fromCookie);
    return NextResponse.redirect(dest, 308);
  }

  // Locale effettiva: path > query > cookie.
  let locale: string | null = pathLocale;
  if (!locale && isLocale(fromQuery)) locale = fromQuery;
  if (!locale && isLocale(fromCookie)) locale = fromCookie;

  // Rewrite /ar/tariffe → /tariffe con header lingua (URL browser resta /ar/...).
  if (pathLocale) {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = barePath;
    const requestHeaders = withLocaleHeaders(req, pathLocale, barePath);
    const res = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
    setLangCookie(res, pathLocale);
    return res;
  }

  const requestHeaders = withLocaleHeaders(req, locale, barePath);

  let response: NextResponse;
  if (rawPath.startsWith("/area-riservata") || rawPath.startsWith("/crm")) {
    response = await updateSession(req, requestHeaders);
  } else {
    response = NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  if (isLocale(fromQuery)) {
    setLangCookie(response, fromQuery);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
