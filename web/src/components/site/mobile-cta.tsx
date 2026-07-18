import Link from "next/link";
import { Phone } from "lucide-react";
import { tCta } from "@/lib/locale";

export async function MobileCta() {
  const mobileCta = await tCta("globals", "mobile_cta", {
    label: "Calcola il preventivo gratis",
    href: "/preventivo",
  });
  const phone = await tCta("navbar", "cta_phone", {
    label: "Chiama",
    href: "tel:+393201570567",
  });

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-primary/10 bg-bg/95 p-3 backdrop-blur lg:hidden">
      <Link
        href={mobileCta.href}
        className="flex flex-1 items-center justify-center rounded-[10px] bg-accent px-4 py-3 text-sm font-semibold text-white"
      >
        {mobileCta.label}
      </Link>
      <a
        href={phone.href}
        aria-label={phone.label}
        className="grid w-12 place-items-center rounded-[10px] border border-primary/20 text-primary"
      >
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
}
