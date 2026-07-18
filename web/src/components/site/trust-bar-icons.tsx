/*
  Icone SVG per la trust bar home — stroke coerente col resto del sito.
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

/** Albo geometri */
export function IconTrustAlbo(props: IconProps) {
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
export function IconTrustEntratel(props: IconProps) {
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

/** Supervisione commercialisti */
export function IconTrustFiscal(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <rect x="7" y="5" width="18" height="22" rx="2" {...stroke} />
        <path d="M11 11h10M11 16h10M11 21h6" {...stroke} />
      </>
    ),
  });
}

/** Pagamenti Stripe / carta */
export function IconTrustPay(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <rect x="4" y="8" width="24" height="16" rx="2.5" {...stroke} />
        <path d="M4 14h24" {...stroke} />
        <path d="M9 20h5" {...stroke} />
      </>
    ),
  });
}

/** GDPR / privacy */
export function IconTrustGdpr(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <path
          d="M16 5l9 4v7c0 5.5-3.7 9.2-9 11-5.3-1.8-9-5.5-9-11V9l9-4z"
          {...stroke}
        />
        <path d="M12.5 16.5l2.5 2.5 5-5.5" {...stroke} />
      </>
    ),
  });
}

/** SSL / lucchetto */
export function IconTrustSsl(props: IconProps) {
  return base({
    ...props,
    children: (
      <>
        <rect x="8" y="14" width="16" height="12" rx="2" {...stroke} />
        <path d="M11 14V10a5 5 0 0 1 10 0v4" {...stroke} />
        <circle cx="16" cy="20" r="1.5" className="fill-current" />
      </>
    ),
  });
}
