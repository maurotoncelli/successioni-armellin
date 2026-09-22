import { Star } from "lucide-react";
import { t } from "@/lib/locale";
import { Card } from "@/components/ui/card";
import { getSiteReviews } from "@/lib/google-reviews";
import { cn } from "@/lib/utils";

export async function Reviews({
  compact = false,
  limit,
  strip = false,
}: {
  compact?: boolean;
  limit?: number;
  /** Solo il voto, senza le card: sta accanto al prezzo. */
  strip?: boolean;
} = {}) {
  const { reviews, rating, totalCount, mapsUri } = await getSiteReviews();
  const writeReviewUrl = (await t("settings", "review_url")).trim();
  const ratingOf = await t("home", "recensioni_rating_of", "su 5");
  const countOne = await t(
    "home",
    "recensioni_count_one",
    "{n} recensione su Google",
  );
  const countMany = await t(
    "home",
    "recensioni_count_many",
    "{n} recensioni su Google",
  );
  const fromLabel = await t("home", "recensioni_from", "Recensioni da");
  const writeLabel = await t("home", "recensioni_write", "Scrivi una recensione");
  if (strip) {
    if (rating == null && totalCount == null) return null;
    const countLabel =
      totalCount == null
        ? ""
        : (totalCount === 1 ? countOne : countMany).replace(
            "{n}",
            String(totalCount),
          );
    return (
      <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-text-muted">
        {rating != null && (
          <a
            href={mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-text hover:underline"
          >
            <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden />
            {rating.toFixed(1).replace(".", ",")} {ratingOf}
          </a>
        )}
        {countLabel ? (
          <a
            href={mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {countLabel}
          </a>
        ) : null}
      </p>
    );
  }

  const shown = typeof limit === "number" ? reviews.slice(0, limit) : reviews;
  const cols =
    shown.length >= 3
      ? "md:grid-cols-3"
      : shown.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-1 max-w-xl mx-auto";

  return (
    <div>
      {(rating != null || totalCount != null) && (
        <p
          className={cn(
            "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted",
            compact ? "mb-4" : "mb-6",
          )}
        >
          {rating != null && (
            <span className="inline-flex items-center gap-1 font-medium text-text">
              <Star className="h-4 w-4 fill-accent text-accent" aria-hidden />
              {rating.toFixed(1).replace(".", ",")} {ratingOf}
            </span>
          )}
          {totalCount != null && (
            <span>
              {(totalCount === 1 ? countOne : countMany).replace(
                "{n}",
                String(totalCount),
              )}
            </span>
          )}
        </p>
      )}

      <div className={cn("grid gap-6", compact ? "gap-4" : "gap-6", cols)}>
        {shown.map((review) => (
          <Card
            key={`${review.author}-${review.text.slice(0, 24)}`}
            className={cn("flex flex-col", compact && "p-4")}
          >
            <div
              className="flex gap-0.5 text-accent"
              role="img"
              aria-label={`${review.rating} ${ratingOf}`}
            >
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent" aria-hidden />
              ))}
            </div>
            <p
              className={cn(
                "mt-4 flex-1 text-sm leading-relaxed text-text",
                compact && "mt-3 line-clamp-4",
              )}
            >
              &ldquo;{review.text}&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold text-primary">
              {review.authorUri ? (
                <a
                  href={review.authorUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {review.author}
                </a>
              ) : (
                review.author
              )}
              {review.location ? (
                <span className="font-normal text-text-muted">
                  {" "}
                  &middot; {review.location}
                </span>
              ) : null}
            </p>
          </Card>
        ))}
      </div>

      <p className={cn("text-center text-xs text-text-muted", compact ? "mt-4" : "mt-6")}>
        {fromLabel}{" "}
        <a
          href={mapsUri}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Google
        </a>
        {writeReviewUrl && !compact ? (
          <>
            {" · "}
            <a
              href={writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              {writeLabel}
            </a>
          </>
        ) : null}
      </p>
    </div>
  );
}
