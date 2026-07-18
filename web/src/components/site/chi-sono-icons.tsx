/*
  Icone SVG per /chi-sono — stesso linguaggio stroke di come-funziona-icons.
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
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Albo professionale */
export function IconAlbo(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <circle cx="16" cy="16" r="10" {...stroke} />
        <circle cx="16" cy="16" r="6" {...stroke} className="opacity-45" />
        <path d="M16 12v5l3 1.5" {...stroke} />
      </>
    ),
  });
}

/** Entratel / invio AdE */
export function IconEntratel(props: IconProps) {
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

/** Partita IVA */
export function IconPiva(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <path d="M9 5h9l5 5v17H9V5z" {...stroke} />
        <path d="M18 5v5h5" {...stroke} />
        <path d="M13 15h6M13 20h4" {...stroke} />
      </>
    ),
  });
}
