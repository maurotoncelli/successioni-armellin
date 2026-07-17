/*
  Icone SVG custom per /come-funziona — tratto sottile, stile navy/oro del sito.
  Usano currentColor così si colorano con text-primary / text-accent.
*/

type IconProps = { className?: string };

function base(props: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
      aria-hidden
    >
      {props.children}
    </svg>
  );
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Domande / questionario */
export function IconQuiz(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <rect x="6" y="4" width="20" height="24" rx="3" {...stroke} />
        <path d="M11 11h10M11 16h8M11 21h6" {...stroke} />
        <circle cx="22" cy="22" r="3.5" className="fill-current opacity-20" />
      </>
    ),
  });
}

/** Caricamento documenti */
export function IconUploadDocs(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <path d="M9 20v4h14v-4" {...stroke} />
        <path d="M16 6v14" {...stroke} />
        <path d="M11 11l5-5 5 5" {...stroke} />
        <path d="M7 14h3M22 14h3" {...stroke} className="opacity-40" />
      </>
    ),
  });
}

/** Invio pratica / AdE */
export function IconSendPractice(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <path d="M6 16l20-9-8 20-3.5-8.5L6 16z" {...stroke} />
        <path d="M14.5 18.5L26 7" {...stroke} />
      </>
    ),
  });
}

/** Tempi / SLA */
export function IconTimeline(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <circle cx="16" cy="16" r="11" {...stroke} />
        <path d="M16 9v7l4.5 2.5" {...stroke} />
      </>
    ),
  });
}

/** Verifica catastale / valore umano */
export function IconVerify(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <path d="M6 16l4 4 8-10" {...stroke} />
        <path d="M20 8h6v6" {...stroke} />
        <path d="M26 8L16 18" {...stroke} />
      </>
    ),
  });
}

/** Tutto a distanza / online */
export function IconRemote(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <rect x="5" y="7" width="22" height="14" rx="2" {...stroke} />
        <path d="M12 25h8M16 21v4" {...stroke} />
        <circle cx="16" cy="14" r="2" className="fill-current opacity-30" />
      </>
    ),
  });
}

/** Studio / visita */
export function IconStudio(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <path d="M5 14l11-8 11 8" {...stroke} />
        <path d="M8 13v12h16V13" {...stroke} />
        <path d="M13 25v-7h6v7" {...stroke} />
        <path d="M11 17h2M19 17h2" {...stroke} className="opacity-50" />
      </>
    ),
  });
}

/** Documento consegnato */
export function IconDeliverable(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <path d="M9 5h9l5 5v17H9V5z" {...stroke} />
        <path d="M18 5v5h5" {...stroke} />
        <path d="M13 16l2.5 2.5L20 14" {...stroke} />
      </>
    ),
  });
}

export function IconBadge({
  children,
  tone = "primary",
}: {
  children: React.ReactNode;
  tone?: "primary" | "accent" | "sand";
}) {
  const toneCls =
    tone === "accent"
      ? "bg-accent/15 text-accent"
      : tone === "sand"
        ? "bg-sand text-primary"
        : "bg-primary/10 text-primary";
  return (
    <span
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${toneCls}`}
    >
      {children}
    </span>
  );
}
