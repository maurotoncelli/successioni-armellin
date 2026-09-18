import { permanentRedirect } from "next/navigation";
import { getRequestLocale } from "@/lib/locale";
import { localePath } from "@/lib/seo-locale";

/*
  Hub /strumenti consolidato in /guide#strumenti (menu più corto, un solo
  indice SEO). I calcolatori restano su URL propri. 308 permanente, locale-aware.
*/

export default async function StrumentiHubRedirect() {
  const locale = await getRequestLocale();
  permanentRedirect(`${localePath("/guide", locale)}#strumenti`);
}
