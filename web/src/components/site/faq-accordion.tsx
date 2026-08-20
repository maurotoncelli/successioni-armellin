import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Faq } from "@/lib/cms";

export function FaqAccordion({
  items,
  featured = false,
  openFirst = false,
}: {
  items: Faq[];
  featured?: boolean;
  openFirst?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "divide-y divide-primary/10 overflow-hidden rounded-2xl border bg-bg",
        featured ? "border-primary/25" : "border-primary/10",
      )}
    >
      {items.map((item, i) => (
        <details key={item.question} className="group" open={openFirst && i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-primary">
            <span>{item.question}</span>
            <ChevronDown className="h-5 w-5 shrink-0 text-secondary transition-transform group-open:rotate-180" />
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-text-muted">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
