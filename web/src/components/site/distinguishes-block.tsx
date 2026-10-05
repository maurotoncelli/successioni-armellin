/*
  Home: «Cosa ci distingue dagli altri servizi online».
  Quattro punti, icone tratto navy/oro, riquadri come la trust bar.
*/

type IconProps = { className?: string };

const stroke = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ children, className }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

function IconArea(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="6" width="22" height="16" rx="2" {...stroke} />
      <path d="M12 26h8M16 22v4" {...stroke} />
      <path d="M9 11h8M9 15h5" {...stroke} className="opacity-50" />
      <circle cx="22" cy="14" r="3" {...stroke} />
    </Svg>
  );
}

function IconLorenzo(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="16" cy="11" r="4" {...stroke} />
      <path d="M8 25c1.5-5 4.5-7 8-7s6.5 2 8 7" {...stroke} />
    </Svg>
  );
}

function IconVoltura(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 26V14l9-8 9 8v12" {...stroke} />
      <path d="M13 26v-7h6v7" {...stroke} />
      <path d="M12 16h8" {...stroke} className="opacity-50" />
    </Svg>
  );
}

function IconComms(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 16l20-9-8 20-3.5-8.5L6 16z" {...stroke} />
      <path d="M14.5 18.5L26 7" {...stroke} />
    </Svg>
  );
}

const ICONS = {
  area: IconArea,
  lorenzo: IconLorenzo,
  voltura: IconVoltura,
  comms: IconComms,
} as const;

export type DistinguishesItem = {
  titolo: string;
  testo: string;
  icon?: keyof typeof ICONS;
};

export function DistinguishesBlock({
  eyebrow,
  title,
  intro,
  items,
}: {
  eyebrow?: string;
  title: string;
  intro: string;
  items: DistinguishesItem[];
}) {
  if (items.length === 0) return null;

  return (
    <>
      <div className="mx-auto max-w-3xl text-center">
        {eyebrow ? (
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl text-white sm:text-4xl">{title}</h2>
        {intro ? (
          <p className="mt-2.5 text-sm leading-relaxed text-white/75 sm:mt-4 sm:text-lg">
            {intro}
          </p>
        ) : null}
      </div>
      {/* Telefono: icona piccola a lato del testo, riquadri stretti. */}
      <ul className="mt-5 grid gap-2.5 sm:mt-12 sm:grid-cols-2 sm:gap-5">
        {items.map((item, i) => {
          const Icon =
            ICONS[item.icon ?? "area"] ??
            Object.values(ICONS)[i % Object.values(ICONS).length];
          return (
            <li
              key={item.titolo}
              className="flex items-start gap-3 rounded-xl border border-accent/40 bg-bg p-3.5 shadow-sm sm:block sm:rounded-2xl sm:p-6"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-accent text-accent sm:h-12 sm:w-12 sm:rounded-xl">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base leading-snug text-primary sm:mt-4 sm:text-xl">
                  {item.titolo}
                </h3>
                <p className="mt-0.5 text-[13px] leading-snug text-text-muted sm:mt-1.5 sm:text-base sm:leading-relaxed">
                  {item.testo}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
