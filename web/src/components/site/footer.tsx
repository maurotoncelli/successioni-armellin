import Link from "next/link";
import { getRequestLocale, t, tList, tObj } from "@/lib/locale";
import { LanguageSwitcher } from "./language-switcher";
import { CookiePreferencesLink } from "@/components/analytics/cookie-preferences-link";
import {
  CHROME_UI_IT,
  COOKIE_UI_IT,
  type ChromeUiLabels,
  type CookieUiLabels,
} from "@/lib/site-ui-labels";

type Studio = {
  ragione_sociale: string;
  forma_giuridica?: string;
  piva: string;
  cf?: string;
  rea?: string;
  albo: string;
  indirizzo: string;
};

export async function Footer() {
  const locale = await getRequestLocale();
  const chrome = await tObj<ChromeUiLabels>(
    "site_ui",
    "chrome_ui",
    CHROME_UI_IT,
  );
  const cookieUi = await tObj<CookieUiLabels>(
    "site_ui",
    "cookie_ui",
    COOKIE_UI_IT,
  );
  const studio = await tObj<Studio>("footer", "studio", {
    ragione_sociale: "Geom. Lorenzo Armellin",
    piva: "",
    albo: "",
    indirizzo: "",
  });
  const trustLine = await t("footer", "trust_line");
  const legalMenu = await tList<{ label: string; href: string }>(
    "footer",
    "legal_menu",
  );
  const odr = await tObj<{ label: string; href: string }>("footer", "odr", {
    label: "",
    href: "",
  });
  const credit = await t("footer", "credit");
  const menu = await tList<{ label: string; href: string }>("navbar", "menu");
  const toolsLink = await tObj<{ label: string; href: string }>(
    "footer",
    "strumenti_link",
    { label: "", href: "" },
  );
  const email = await t("settings", "email");
  const phone = await t("settings", "phone");
  const pec = await t("settings", "pec");
  const areaLabel = await t("settings", "area_label", "Area personale");
  const areaNote = await t("footer", "area_app_note");
  const navHeading = await t("footer", "nav_heading", "Naviga");
  const legalHeading = await t("footer", "legal_heading", "Legale");
  const rights = await t(
    "footer",
    "rights_reserved",
    "Tutti i diritti riservati.",
  );

  const labelForma = await t("footer", "label_forma", "Forma");
  const labelPiva = await t("footer", "label_piva", "P.IVA");
  const labelCf = await t("footer", "label_cf", "C.F.");
  const labelRea = await t("footer", "label_rea", "REA");
  const labelPec = await t("footer", "label_pec", "PEC");
  const labelTel = await t("footer", "label_tel", "Tel");

  const legalData: { label: string; value: string }[] = [
    { label: labelForma, value: studio.forma_giuridica ?? "" },
    { label: labelPiva, value: studio.piva },
    { label: labelCf, value: studio.cf ?? "" },
    { label: labelRea, value: studio.rea ?? "" },
    { label: labelPec, value: pec },
  ].filter((row) => row.value);

  return (
    <footer className="mt-auto bg-primary text-white/80">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:gap-10 sm:px-8 sm:py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <svg
              aria-hidden
              width="36"
              height="36"
              viewBox="0 0 36 36"
              className="h-9 w-9 shrink-0 text-accent"
            >
              <circle cx="18" cy="18" r="18" fill="currentColor" />
              <text
                x="18"
                y="18"
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="15"
                fontWeight="700"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                A
              </text>
            </svg>
            <span className="font-serif text-lg font-semibold text-white">
              {studio.ragione_sociale}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{trustLine}</p>
          <address className="mt-4 not-italic text-sm leading-relaxed">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studio.indirizzo)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-white"
            >
              {studio.indirizzo}
            </a>
            {studio.albo && (
              <>
                <br />
                {studio.albo}
              </>
            )}
            {phone && phone !== "DA CONFERMARE" && (
              <>
                <br />
                {labelTel}: {phone}
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

          {areaNote && (
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/60">
              {areaNote}{" "}
              <Link href="/privacy" className="underline hover:text-accent">
                {await t("home", "app_scopo_privacy_label", "Privacy Policy")}
              </Link>
              .
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            {navHeading}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {menu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
            {toolsLink.href && (
              <li>
                <Link href={toolsLink.href} className="hover:text-accent">
                  {toolsLink.label}
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/area-riservata"
                className="font-medium text-white hover:text-accent"
              >
                {areaLabel}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            {legalHeading}
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
              <CookiePreferencesLink
                className="cursor-pointer hover:text-accent"
                label={cookieUi.preferences}
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-white/60 sm:flex-row sm:px-8">
          <p>
            &copy; {new Date().getFullYear()} {studio.ragione_sociale}. {rights}
          </p>
          <div className="flex items-center gap-4">
            <p>{credit}</p>
            <LanguageSwitcher
              locale={locale}
              tone="onDark"
              align="right"
              dropUp
              ariaLabel={chrome.lang_aria}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
