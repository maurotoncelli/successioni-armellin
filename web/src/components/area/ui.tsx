import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-semibold text-primary">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
    </div>
  );
}

export function StatusTracker({
  steps,
  current,
}: {
  steps: readonly string[];
  current: number;
}) {
  return (
    <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step} className="flex items-center gap-3 sm:flex-1">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                  done && "bg-success text-white",
                  active && "bg-accent text-white",
                  !done && !active && "bg-bg-muted text-text-muted",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm",
                  active ? "font-semibold text-text" : "text-text-muted",
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="hidden h-px flex-1 bg-primary/10 sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

const toneClasses = {
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
} as const;

export function ToneBadge({
  tone,
  children,
}: {
  tone: keyof typeof toneClasses;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
