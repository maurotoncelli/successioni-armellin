import Link from "next/link";
import { list, obj, text } from "@/lib/content";
import { LanguageSwitcher } from "./language-switcher";
import { CookiePreferencesLink } from "@/components/analytics/cookie-preferences-link";

type Studio = {
  ragione_sociale: string;
  forma_giuridica?: string;
  piva: string;
  cf?: string;
  rea?: string;
  albo: string;
  indirizzo: string;
};

export function Footer() {
  const studio = obj<Studio>("footer", "studio", {
    ragione_sociale: "Geom. Lorenzo Armellin",
    piva: "",
    albo: "",
    indirizzo: "",
  });
  const trustLine = text("footer", "trust_line");
  const legalMenu = list<{ label: string; href: string }>("footer", "legal_menu");
  const odr = obj<{ label: string; href: string }>("footer", "odr", {
    label: "",
    href: "",
  });
  const credit = text("footer", "credit");
  const menu = list<{ label: string; href: string }>("navbar", "menu");
  const email = text("settings", "email");
  const phone = text("settings", "phone");
  const pec = text("settings", "pec");
  const areaLabel = text("settings", "area_label", "Area personale");

  // Dati identificativi obbligatori (professionista/e-commerce B2C): mostrati
  // sempre, anche come placeholder "DA CONFERMARE", finche non confermati da
  // Lorenzo (vedi blueprint/10_Legale_Compliance + DOMANDE_PER_LORENZO).
  const legalData: { label: string; value: string }[] = [
    { label: "Forma", value: studio.forma_giuridica ?? "" },
    { label: "P.IVA", value: studio.piva },
    { label: "C.F.", value: studio.cf ?? "" },
    { label: "REA", value: studio.rea ?? "" },
    { label: "PEC", value: pec },
  ].filter((row) => row.value);

  return (
    <footer className="mt-auto bg-primary text-white/80">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-accent font-display text-lg font-bold text-white">
              A
            </span>
            <span className="font-serif text-lg font-semibold text-white">
              {studio.ragione_sociale}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{trustLine}</p>
          <address className="mt-4 not-italic text-sm leading-relaxed">
            {studio.indirizzo}
            {studio.albo && (
              <>
                <br />
                {studio.albo}
              </>
            )}
            {phone && phone !== "DA CONFERMARE" && (
              <>
                <br />
                Tel: {phone}
              </>
            )}
            {email && (
              <>
                <br />
                {email}
              </>
            )}
          </address>

          {legalData.length > 0 && (
            <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/60">
              {legalData.map((row) => (
                <div key={row.label} className="flex gap-1.5">
                  <dt className="font-semibold text-white/70">{row.label}:</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Naviga
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {menu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/area-riservata" className="font-medium text-white hover:text-accent">
                {areaLabel}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Legale
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {legalMenu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
            {odr.href && (
              <li>
                <a
                  href={odr.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  {odr.label}
                </a>
              </li>
            )}
            <li>
              <CookiePreferencesLink className="cursor-pointer hover:text-accent" />
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-white/60 sm:flex-row sm:px-8">
          <p>
            &copy; {new Date().getFullYear()} {studio.ragione_sociale}. Tutti i
            diritti riservati.
          </p>
          <div className="flex items-center gap-4">
            <p>{credit}</p>
            <LanguageSwitcher tone="onDark" align="right" dropUp />
          </div>
        </div>
      </div>
    </footer>
  );
}
