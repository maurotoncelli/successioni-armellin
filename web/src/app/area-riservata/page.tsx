import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/area/login-form";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { coerceLocale, text } from "@/lib/content";

/*
  Pagina di login dell'area personale (server component).
  Risolve la lingua attiva con priorita: ?lang= -> cookie "lang" -> italiano.
  Lo switcher e in alto a destra (responsive). Quando ci sara il routing
  globale per lingua, la stessa logica vale per tutte le pagine.
*/

export default async function AreaLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const { lang } = await searchParams;
  const cookieLang = (await cookies()).get("lang")?.value;
  const locale = coerceLocale(lang, cookieLang);
  const backLabel = text("area_login", "back_to_site", "Torna al sito", locale);

  return (
    <div className="relative min-h-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="absolute left-3 top-3 z-20 sm:left-5 sm:top-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-bg/90 px-3.5 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {backLabel}
        </Link>
      </div>
      <div className="absolute right-3 top-3 z-20 sm:right-5 sm:top-5">
        <LanguageSwitcher locale={locale} align="right" />
      </div>
      <LoginForm locale={locale} />
    </div>
  );
}
