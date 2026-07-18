import { getRequestLocale, t, tCta, tList, tObj } from "@/lib/locale";
import { NavbarClient } from "./navbar-client";
import { CHROME_UI_IT, type ChromeUiLabels } from "@/lib/site-ui-labels";

export async function Navbar() {
  const locale = await getRequestLocale();
  const menu = await tList<{ label: string; href: string }>("navbar", "menu");
  const mainCta = await tCta("navbar", "cta", {
    label: "Calcola il preventivo gratis",
    href: "/preventivo",
  });
  const phoneCta = await tCta("navbar", "cta_phone", {
    label: "Parla con Lorenzo",
    href: "tel:+393201570567",
  });
  const areaLabel = await t("settings", "area_label", "Area personale");
  const ctaShort = await t("navbar", "cta_short", "Preventivo");
  const brandTagline = await t("navbar", "brand_tagline", "Successioni");
  const chrome = await tObj<ChromeUiLabels>(
    "site_ui",
    "chrome_ui",
    CHROME_UI_IT,
  );

  return (
    <NavbarClient
      menu={menu}
      cta={mainCta}
      ctaPhone={phoneCta}
      areaLabel={areaLabel}
      ctaShort={ctaShort}
      brandTagline={brandTagline}
      locale={locale}
      menuOpenLabel={chrome.menu_open}
      menuCloseLabel={chrome.menu_close}
      langAriaLabel={chrome.lang_aria}
    />
  );
}
