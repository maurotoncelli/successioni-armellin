import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { tCta, tObj } from "@/lib/locale";

export async function MobileCta() {
  const mobileCta = await tCta("globals", "mobile_cta", {
    label: "Calcola il preventivo gratis",
    href: "/preventivo",
  });
  const phone = await tCta("navbar", "cta_phone", {
    label: "Chiama",
    href: "tel:+393201570567",
  });
  // WhatsApp: canale preferito da chi non vuole pagare subito (vedi grazie/esito B).
  const tel = await tObj("contatti", "telefono", {
    cta_whatsapp: "https://wa.me/393201570567",
  });
  const wa = await tObj("globals", "mobile_cta_whatsapp", {
    label: "Scrivi su WhatsApp",
    prefill:
      "Ciao Lorenzo, ho visto il sito e vorrei qualche informazione sulla successione.",
  });
  const waBase = String(tel.cta_whatsapp || "https://wa.me/393201570567");
  const waHref = `${waBase}${waBase.includes("?") ? "&" : "?"}text=${encodeURIComponent(wa.prefill)}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-primary/10 bg-bg/95 p-3 backdrop-blur lg:hidden">
      <Link
        href={mobileCta.href}
        data-cta="mobile_bar_preventivo"
        className="flex flex-1 items-center justify-center rounded-[10px] bg-accent px-4 py-3 text-sm font-semibold text-white"
      >
        {mobileCta.label}
      </Link>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={wa.label}
        data-cta="mobile_bar_whatsapp"
        className="grid w-12 place-items-center rounded-[10px] bg-[#1DAA61] text-white"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <a
        href={phone.href}
        aria-label={phone.label}
        data-cta="mobile_bar_phone"
        className="grid w-12 place-items-center rounded-[10px] border border-primary/20 text-primary"
      >
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
}
