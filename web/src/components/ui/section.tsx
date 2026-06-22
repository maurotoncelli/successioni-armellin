import { cn } from "@/lib/utils";
import { Container } from "./container";

type SectionProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  /** sfondo: bianco (default), sabbia o grigio perla */
  tone?: "default" | "sand" | "muted" | "primary";
};

const toneClasses: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-bg",
  sand: "bg-sand",
  muted: "bg-bg-muted",
  primary: "bg-primary text-white",
};

export function Section({
  id,
  className,
  containerClassName,
  children,
  tone = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-16 sm:py-20", toneClasses[tone], className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  invert?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold uppercase tracking-wider",
            invert ? "text-accent" : "text-accent",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl",
          invert && "text-white",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-4 text-lg",
            invert ? "text-white/80" : "text-text-muted",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
