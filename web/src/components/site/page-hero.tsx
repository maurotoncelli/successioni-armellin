import { Container } from "@/components/ui/container";
import { BackLink } from "@/components/site/back-link";
import { tObj } from "@/lib/locale";
import { CHROME_UI_IT } from "@/lib/site-ui-labels";

export async function PageHero({
  eyebrow,
  title,
  subtitle,
  back,
  backLabel,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  back?: boolean;
  backLabel?: string;
}) {
  const chrome = back
    ? await tObj("site_ui", "chrome_ui", CHROME_UI_IT)
    : null;

  return (
    <div className="bg-primary text-white">
      <Container className="py-10 sm:py-14 lg:py-20">
        {back && (
          <div className="mb-4 sm:mb-6">
            <BackLink
              tone="onDark"
              label={backLabel ?? chrome?.back ?? CHROME_UI_IT.back}
            />
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
