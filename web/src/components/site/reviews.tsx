import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getSiteReviews } from "@/lib/google-reviews";
import { text } from "@/lib/content";
import { cn } from "@/lib/utils";

export async function Reviews() {
  const { reviews, rating, totalCount, mapsUri } = await getSiteReviews();
  const writeReviewUrl = text("settings", "review_url").trim();
  const cols =
    reviews.length >= 3
      ? "md:grid-cols-3"
      : reviews.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-1 max-w-xl mx-auto";

  return (
    <div>
      {(rating != null || totalCount != null) && (
        <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
          {rating != null && (
            <span className="inline-flex items-center gap-1 font-medium text-text">
              <Star className="h-4 w-4 fill-accent text-accent" aria-hidden />
              {rating.toFixed(1).replace(".", ",")} su 5
            </span>
          )}
          {totalCount != null && (
            <span>
              {totalCount} {totalCount === 1 ? "recensione" : "recensioni"} su
              Google
            </span>
          )}
        </p>
      )}

      <div className={cn("grid gap-6", cols)}>
        {reviews.map((review) => (
          <Card key={`${review.author}-${review.text.slice(0, 24)}`} className="flex flex-col">
            <div
              className="flex gap-0.5 text-accent"
              aria-label={`${review.rating} su 5`}
            >
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent" />
              ))}
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-text">
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

      <p className="mt-6 text-center text-xs text-text-muted">
        Recensioni da{" "}
        <a
          href={mapsUri}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Google
        </a>
        {writeReviewUrl ? (
          <>
            {" · "}
            <a
              href={writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Scrivi una recensione
            </a>
          </>
        ) : null}
      </p>
    </div>
  );
}
