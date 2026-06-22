import { Star } from "lucide-react";
import { reviews } from "@/content/site";
import { Card } from "@/components/ui/card";

export function Reviews() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {reviews.map((review) => (
        <Card key={review.author} className="flex flex-col">
          <div className="flex gap-0.5 text-accent" aria-label={`${review.rating} su 5`}>
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-accent" />
            ))}
          </div>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-text">
            &ldquo;{review.text}&rdquo;
          </p>
          <p className="mt-4 text-sm font-semibold text-primary">
            {review.author}
            <span className="font-normal text-text-muted"> &middot; {review.location}</span>
          </p>
        </Card>
      ))}
    </div>
  );
}
