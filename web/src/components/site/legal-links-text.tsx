import Link from "next/link";
import type { ReactNode } from "react";

/*
  Rende cliccabili i riferimenti ai documenti legali dentro i testi dei
  consensi (checkout, soft lead): "Condizioni di vendita" -> /termini-condizioni,
  "informativa privacy" -> /privacy. I testi restano data-driven in
  content_entries; qui li linkifichiamo al volo, cosi ogni variante di frase
  che cita quei documenti ottiene il link senza markup nel JSON.
*/

const TARGETS: { pattern: RegExp; href: string }[] = [
  { pattern: /condizioni di vendita/i, href: "/termini-condizioni" },
  { pattern: /informativa (sulla )?privacy/i, href: "/privacy" },
];

export function LegalLinksText({ text }: { text: string }) {
  let parts: ReactNode[] = [text];

  for (const { pattern, href } of TARGETS) {
    parts = parts.flatMap((part, i) => {
      if (typeof part !== "string") return [part];
      const match = part.match(pattern);
      if (!match || match.index === undefined) return [part];
      return [
        part.slice(0, match.index),
        <Link
          key={`${href}-${i}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent underline underline-offset-2 hover:text-accent-dark"
        >
          {match[0]}
        </Link>,
        part.slice(match.index + match[0].length),
      ];
    });
  }

  return <>{parts}</>;
}
