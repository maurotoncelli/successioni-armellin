import { cta, list } from "@/lib/content";
import { NavbarClient } from "./navbar-client";

export function Navbar() {
  const menu = list<{ label: string; href: string }>("navbar", "menu");
  const mainCta = cta("navbar", "cta", {
    label: "Calcola il preventivo gratis",
    href: "/preventivo",
  });
  const phoneCta = cta("navbar", "cta_phone", {
    label: "Parla con Lorenzo",
    href: "tel:+39",
  });

  return <NavbarClient menu={menu} cta={mainCta} ctaPhone={phoneCta} />;
}
