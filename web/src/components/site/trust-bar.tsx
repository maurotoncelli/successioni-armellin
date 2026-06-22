import { Check } from "lucide-react";
import { list } from "@/lib/content";

export function TrustBar() {
  const items = list<string>("home", "trustbar_items");
  if (items.length === 0) return null;

  return (
    <div className="bg-sand text-primary">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-3 px-5 py-5 sm:px-8">
        {items.map((item, i) => (
          <span key={item} className="inline-flex items-center">
            {i > 0 && (
              <span
                aria-hidden
                className="mr-4 hidden h-3.5 w-px bg-primary/15 sm:inline-block"
              />
            )}
            <span className="inline-flex items-center gap-2 text-sm">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-white shadow-sm">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="font-semibold tracking-tight text-primary">
                {item}
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
