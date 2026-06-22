import { Info, AlertTriangle } from "lucide-react";
import type { ArticleBlock } from "@/content/articles";

/*
  Renderer del corpo articolo (richtext strutturato data-driven).
  Ogni blocco e tipizzato (@/content/articles): niente HTML arbitrario, cosi il
  contenuto resta sicuro e coerente con il design system anche quando arrivera
  dal CMS in Fase 4.
*/
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} className="mt-10 text-2xl text-primary sm:text-3xl">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-6 text-xl text-primary">
                {block.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="leading-relaxed text-text">
                {block.text}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="ml-1 space-y-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed text-text">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed text-text">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {j + 1}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div
                key={i}
                className="overflow-x-auto rounded-2xl border border-primary/10"
              >
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-bg-muted text-left">
                      {block.headers.map((h, j) => (
                        <th
                          key={j}
                          className="px-4 py-3 font-semibold text-primary"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr
                        key={r}
                        className="border-t border-primary/10 align-top"
                      >
                        {row.map((cell, c) => (
                          <td key={c} className="px-4 py-3 text-text">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout": {
            const isWarning = block.tone === "warning";
            const Icon = isWarning ? AlertTriangle : Info;
            return (
              <div
                key={i}
                className={
                  "flex gap-3 rounded-2xl border p-5 " +
                  (isWarning
                    ? "border-accent/30 bg-accent/5"
                    : "border-primary/15 bg-bg-muted")
                }
              >
                <Icon
                  className={
                    "mt-0.5 h-5 w-5 shrink-0 " +
                    (isWarning ? "text-accent" : "text-primary")
                  }
                />
                <div>
                  {block.title && (
                    <p className="font-semibold text-primary">{block.title}</p>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">
                    {block.text}
                  </p>
                </div>
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
