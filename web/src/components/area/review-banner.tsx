import { Star } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

/*
  Banner recensione Google My Business — in evidenza dopo pratica conclusa.
*/

export function ReviewBanner({
  reviewUrl,
  compact = false,
  labels,
}: {
  reviewUrl: string;
  compact?: boolean;
  labels?: {
    title?: string;
    cta?: string;
    body?: string;
  };
}) {
  if (!reviewUrl) return null;

  const title =
    labels?.title ?? "La pratica è conclusa: lasciaci una recensione?";
  const compactTitle =
    labels?.cta ?? labels?.title ?? "Lascia una recensione su Google";
  const body =
    labels?.body ??
    "Se ti sei trovato bene con Lorenzo, una recensione su Google ci aiuta tantissimo — ci vuole un minuto.";
  const cta = labels?.cta ?? "Scrivi su Google";

  return (
    <div
      className={
        compact
          ? "rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/15 via-sand/80 to-bg p-5 shadow-sm"
          : "rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/15 via-sand to-bg p-6 text-center shadow-md sm:p-8"
      }
    >
      <div
        className={
          compact
            ? "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            : ""
        }
      >
        <div className={compact ? "min-w-0 text-left" : ""}>
          <div
            className={
              compact
                ? "flex items-center gap-2"
                : "flex flex-col items-center"
            }
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-accent">
              <Star className="h-5 w-5 fill-current" />
            </span>
            {!compact && (
              <p className="mt-3 text-lg font-semibold text-text sm:text-xl">
                {title}
              </p>
            )}
            {compact && (
              <p className="text-base font-semibold text-text">{compactTitle}</p>
            )}
          </div>
          <p
            className={
              compact
                ? "mt-1 text-sm text-text-muted"
                : "mx-auto mt-2 max-w-md text-sm text-text-muted sm:text-base"
            }
          >
            {body}
          </p>
        </div>
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses({
            size: "lg",
            className: compact
              ? "shrink-0"
              : "mt-5 w-full sm:mx-auto sm:mt-6 sm:w-auto",
          })}
        >
          <Star className="h-4 w-4" />
          {cta}
        </a>
      </div>
    </div>
  );
}
