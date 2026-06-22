import { ShieldCheck } from "lucide-react";
import { list } from "@/lib/content";

export function TrustBar() {
  const items = list<string>("home", "trustbar_items");
  if (items.length === 0) return null;

  return (
    <div className="border-y border-primary/10 bg-bg-muted">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 sm:px-8">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 text-sm font-medium text-text-muted"
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
