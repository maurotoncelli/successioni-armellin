import { Fragment } from "react";

function InlineEmph({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-primary">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * Rende i marcatori **testo** dei contenuti CMS come enfasi navy:
 * parole chiave che emergono dal grigio del paragrafo senza urlare.
 */
export function Emph({ text }: { text: string }) {
  return <InlineEmph text={text} />;
}

/**
 * Come Emph, ma spezza i `\n\n` in paragrafi distanziati.
 */
export function EmphBlock({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className={className}>
          <InlineEmph text={para} />
        </p>
      ))}
    </>
  );
}
