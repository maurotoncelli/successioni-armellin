/*
  Illustrazioni «Come funziona» in 3 passi — scene 4:3, tratto navy/oro/sabbia.
  Sostituiscono le foto stock: stesso linguaggio delle icone trust / come-funziona.
*/

type ArtProps = { title: string };

const NAVY = "#0e2a47";
const GOLD = "#b5894e";
const SAND = "#efe9dd";
const MUTED = "#5a6b7b";
const WHITE = "#ffffff";

function Frame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      role="img"
      aria-label={title}
    >
      <rect width="160" height="120" rx="12" fill={SAND} />
      {children}
    </svg>
  );
}

/** Passo 1: quiz / preventivo al computer. */
function ArtQuiz({ title }: ArtProps) {
  return (
    <Frame title={title}>
      <rect x="28" y="22" width="104" height="68" rx="6" fill={WHITE} stroke={NAVY} strokeWidth="1.6" />
      <rect x="34" y="28" width="92" height="48" rx="3" fill="#f5f7fa" stroke={NAVY} strokeWidth="1.2" />
      <path d="M52 82h56" stroke={NAVY} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="70" y="84" width="20" height="4" rx="1" fill={NAVY} opacity="0.35" />
      <rect x="42" y="36" width="48" height="4" rx="2" fill={NAVY} opacity="0.55" />
      <rect x="42" y="46" width="36" height="4" rx="2" fill={MUTED} opacity="0.45" />
      <rect x="42" y="56" width="42" height="4" rx="2" fill={MUTED} opacity="0.35" />
      <circle cx="108" cy="50" r="11" fill={GOLD} opacity="0.2" stroke={GOLD} strokeWidth="1.4" />
      <path d="M103 50.5l3.2 3.2 7-7" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/** Passo 2: documenti da telefono / area personale. */
function ArtDocs({ title }: ArtProps) {
  return (
    <Frame title={title}>
      <rect x="22" y="30" width="44" height="58" rx="4" fill={WHITE} stroke={NAVY} strokeWidth="1.5" />
      <path d="M22 38h44" stroke={NAVY} strokeWidth="1.2" />
      <rect x="28" y="44" width="32" height="3.5" rx="1.5" fill={MUTED} opacity="0.4" />
      <rect x="28" y="52" width="24" height="3.5" rx="1.5" fill={MUTED} opacity="0.3" />
      <rect x="28" y="60" width="28" height="3.5" rx="1.5" fill={MUTED} opacity="0.25" />
      <rect x="86" y="24" width="42" height="72" rx="8" fill={NAVY} />
      <rect x="91" y="32" width="32" height="48" rx="3" fill={WHITE} />
      <rect x="96" y="38" width="22" height="14" rx="2" fill={SAND} stroke={GOLD} strokeWidth="1.2" />
      <path d="M102 62h10M102 68h14" stroke={NAVY} strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M66 58c8-2 14-8 18-16"
        stroke={GOLD}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
    </Frame>
  );
}

/** Passo 3: lo studio predispone e invia. */
function ArtStudio({ title }: ArtProps) {
  return (
    <Frame title={title}>
      <path d="M18 88h124" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="30" y="44" width="70" height="44" rx="3" fill={WHITE} stroke={NAVY} strokeWidth="1.5" />
      <rect x="38" y="52" width="38" height="4" rx="2" fill={NAVY} opacity="0.45" />
      <rect x="38" y="62" width="28" height="3.5" rx="1.5" fill={MUTED} opacity="0.35" />
      <rect x="38" y="70" width="34" height="3.5" rx="1.5" fill={MUTED} opacity="0.25" />
      <circle cx="86" cy="64" r="8" fill={GOLD} opacity="0.18" stroke={GOLD} strokeWidth="1.4" />
      <path d="M86 60v8M82 64h8" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M112 36l28 12-12 26-5-11-11-27z"
        fill={WHITE}
        stroke={NAVY}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M112 36l16 22" stroke={GOLD} strokeWidth="1.4" />
    </Frame>
  );
}

const ARTS = [ArtQuiz, ArtDocs, ArtStudio] as const;

export function ComeFunzionaStepArt({
  index,
  title,
}: {
  index: number;
  title: string;
}) {
  const Art = ARTS[index % ARTS.length];
  return (
    <div className="relative mt-1 aspect-[4/3] overflow-hidden rounded-xl border border-primary/10 md:mt-5">
      <Art title={title} />
    </div>
  );
}
