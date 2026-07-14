import { cta, list, text } from "@/lib/content";
import { NavbarClient } from "./navbar-client";

export function Navbar() {
  const menu = list<{ label: string; href: string }>("navbar", "menu");
  const mainCta = cta("navbar", "cta", {
    label: "Calcola il preventivo gratis",
    href: "/preventivo",
  });
  const phoneCta = cta("navbar", "cta_phone", {
    label: "Parla con Lorenzo",
    href: "tel:+393201570567",
  });
  const areaLabel = text("settings", "area_label", "Area personale");

  // La navbar resta statica: lo switcher rileva la lingua dal cookie lato client.
  return (
    <NavbarClient
      menu={menu}
      cta={mainCta}
      ctaPhone={phoneCta}
      areaLabel={areaLabel}
    />
  );
}
