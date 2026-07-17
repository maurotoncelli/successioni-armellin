import { Container } from "@/components/ui/container";
import { BackLink } from "@/components/site/back-link";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  back,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  back?: boolean;
}) {
  return (
    <div className="bg-primary text-white">
      <Container className="py-10 sm:py-14 lg:py-20">
        {back && (
          <div className="mb-4 sm:mb-6">
            <BackLink tone="onDark" />
          </div>
        )}
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl text-white sm:text-4xl lg:text-5xl">{title}</h1>
          {subtitle && (
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:mt-5 sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
