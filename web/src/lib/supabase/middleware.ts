import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/*
  Refresh della sessione Supabase nel proxy (Next 16, runtime Node).
  Rinnova i token e propaga i cookie aggiornati sulla risposta, cosi i Server
  Components leggono sempre una sessione valida. Non fa redirect: il gating e
  gestito nei layout/route. Vedi guida ufficiale @supabase/ssr.
*/

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function updateSession(
  request: NextRequest,
  extraRequestHeaders?: Headers,
): Promise<NextResponse> {
  const requestHeaders = extraRequestHeaders ?? new Headers(request.headers);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANTE: getUser() forza la validazione/refresh del token.
  await supabase.auth.getUser();

  return response;
}
