import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-primary text-white">
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl text-white sm:text-5xl">{title}</h1>
          {subtitle && (
            <p className="mt-5 text-lg leading-relaxed text-white/80">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
