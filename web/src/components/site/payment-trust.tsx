import Link from "next/link";
import { tObj } from "@/lib/locale";
import { Section } from "@/components/ui/section";
import {
  PAYMENT_TRUST_UI_IT,
  type PaymentTrustIcon,
  type PaymentTrustUiLabels,
} from "@/lib/site-ui-labels";

/*
  «Paghi tranquillo»: fascia navy a tutta larghezza sotto i prezzi (home e
  Come funziona). Solo fatti verificabili: albo, Stripe, fattura, recesso e
  garanzia. Illustrazioni nello stile di come-funziona-step-art (sabbia/oro).
*/

const NAVY = "#0e2a47";
const PANEL = "#173a58";
const GOLD = "#b5894e";
const SAND = "#efe9dd";
const WHITE = "#ffffff";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden
    >
      <rect width="160" height="120" rx="12" fill={PANEL} />
      {children}
    </svg>
  );
}

/** Attestato con sigillo: iscrizione all'Albo. */
function ArtAlbo() {
  return (
    <Frame>
      <rect x="34" y="18" width="72" height="84" rx="4" fill={WHITE} />
      <rect x="44" y="30" width="40" height="4" rx="2" fill={NAVY} opacity="0.5" />
      <rect x="44" y="41" width="52" height="3" rx="1.5" fill={NAVY} opacity="0.25" />
      <rect x="44" y="49" width="46" height="3" rx="1.5" fill={NAVY} opacity="0.2" />
      <rect x="44" y="57" width="50" height="3" rx="1.5" fill={NAVY} opacity="0.2" />
      <path d="M44 86h24" stroke={NAVY} strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
      <path d="M103 86l-6 18 7-4 4 7 4-19z" fill={GOLD} opacity="0.7" />
      <path d="M117 86l6 18-7-4-4 7-4-19z" fill={GOLD} opacity="0.7" />
      <circle cx="110" cy="76" r="15" fill={GOLD} />
      <circle cx="110" cy="76" r="10.5" stroke={WHITE} strokeWidth="1.4" opacity="0.8" />
      <path
        d="M104.5 76.5l3.8 3.8 7.2-7.4"
        stroke={WHITE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

/** Carta e lucchetto: il pagamento passa da Stripe. */
function ArtStripe() {
  return (
    <Frame>
      <rect x="22" y="36" width="78" height="50" rx="7" fill={SAND} />
      <rect x="22" y="46" width="78" height="9" fill={NAVY} opacity="0.85" />
      <rect x="30" y="63" width="14" height="10" rx="2" fill={GOLD} />
      <rect x="50" y="65" width="32" height="3.5" rx="1.5" fill={NAVY} opacity="0.35" />
      <rect x="50" y="72" width="20" height="3" rx="1.5" fill={NAVY} opacity="0.25" />
      <path
        d="M112 58v-8a11 11 0 0 1 22 0v8"
        stroke={SAND}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <rect x="106" y="57" width="34" height="30" rx="5" fill={GOLD} />
      <circle cx="123" cy="69" r="4" fill={NAVY} />
      <rect x="121.5" y="71" width="3" height="8" rx="1.5" fill={NAVY} />
    </Frame>
  );
}

/** Fattura con simbolo dell'euro e freccia di download. */
function ArtInvoice() {
  return (
    <Frame>
      <path d="M46 16h50l14 14v72a4 4 0 0 1-4 4H46a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4z" fill={WHITE} />
      <path d="M96 16v10a4 4 0 0 0 4 4h10z" fill={SAND} />
      <path d="M84 36a10 10 0 1 0 0 16" stroke={NAVY} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M68 42h12M68 47h12" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
      <rect x="52" y="64" width="46" height="3.5" rx="1.5" fill={NAVY} opacity="0.3" />
      <rect x="52" y="72" width="34" height="3" rx="1.5" fill={NAVY} opacity="0.22" />
      <rect x="52" y="80" width="40" height="3" rx="1.5" fill={NAVY} opacity="0.18" />
      <circle cx="116" cy="88" r="14" fill={GOLD} />
      <path
        d="M116 80v12M110.5 87l5.5 5.5 5.5-5.5"
        stroke={WHITE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

/** Moneta con freccia che torna indietro: recesso e rimborso. */
function ArtRefund() {
  return (
    <Frame>
      <path d="M44 60a36 36 0 0 1 61.5-25.5" stroke={SAND} strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M97.8 32.4l7.7 2.1-2.1-7.7"
        stroke={SAND}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M116 60a36 36 0 0 1-61.5 25.5"
        stroke={SAND}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="4 5"
        opacity="0.6"
      />
      <circle cx="80" cy="60" r="22" fill={GOLD} />
      <circle cx="80" cy="60" r="16" stroke={WHITE} strokeWidth="1.4" opacity="0.6" />
      <path d="M86 52a9 9 0 1 0 0 16" stroke={WHITE} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M71 57.5h11M71 62.5h11" stroke={WHITE} strokeWidth="2" strokeLinecap="round" />
    </Frame>
  );
}

const ARTS: Record<PaymentTrustIcon, () => React.ReactElement> = {
  albo: ArtAlbo,
  stripe: ArtStripe,
  invoice: ArtInvoice,
  refund: ArtRefund,
};

export async function PaymentTrust() {
  const ui = await tObj<PaymentTrustUiLabels>(
    "site_ui",
    "payment_trust_ui",
    PAYMENT_TRUST_UI_IT,
  );
  if (!ui.items?.length) return null;

  return (
    <Section tone="primary">
      <div data-track-section="payment_trust">
        <h2 className="mx-auto max-w-3xl text-center text-2xl text-white sm:text-4xl">
          {ui.title}
        </h2>
        <ul className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {ui.items.map((item) => {
            const Art = ARTS[item.icon] ?? ArtAlbo;
            return (
              <li key={item.title} className="flex items-start gap-4 sm:block">
                <div className="aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl sm:w-full">
                  <Art />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg leading-snug text-white sm:mt-5 sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/75 sm:text-base">
                    {item.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/15 pt-6 text-center text-sm leading-relaxed text-white/70 sm:mt-12 sm:flex-row sm:justify-between sm:text-left">
          <p>{ui.methods}</p>
          <Link
            href="/garanzia"
            className="shrink-0 font-semibold text-accent underline underline-offset-4 hover:text-white"
          >
            {ui.guarantee_link}
          </Link>
        </div>
      </div>
    </Section>
  );
}
