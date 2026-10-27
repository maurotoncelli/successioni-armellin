import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isQuoteCtaId } from "@/lib/quote";
import { incrementQuoteCta } from "@/lib/quote-stats";

const recentClicks = new Map<string, number>();
const DEDUPE_MS = 10 * 60_000;

function prune(now: number) {
  for (const [k, t] of recentClicks) {
    if (now - t > DEDUPE_MS) recentClicks.delete(k);
  }
}

/*
  Riceve `navigator.sendBeacon` al clic sui pulsanti «Acquista il servizio» e
  «Chiedi le imposte su WhatsApp»: così il conteggio arriva al CRM anche quando
  il browser cambia subito pagina verso wa.me o /checkout.
*/
export async function POST(req: Request) {
  if (process.env.VERCEL_ENV === "preview") {
    return NextResponse.json({ ok: true });
  }
  try {
    const body = (await req.json()) as { cta?: unknown; clickId?: unknown };
    if (!isQuoteCtaId(body.cta)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const clickId =
      typeof body.clickId === "string" ? body.clickId.slice(0, 80) : "";
    if (!clickId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const now = Date.now();
    prune(now);
    const key = `${body.cta}:${clickId}`;
    if (!recentClicks.has(key)) {
      recentClicks.set(key, now);
      await incrementQuoteCta(body.cta);
      revalidatePath("/crm/statistiche");
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
