import Image from "next/image";
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
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  back?: boolean;
  backLabel?: string;
  /** Se presente: hero fotografico con scrim navy a sinistra per il testo. */
  image?: {
    src: string;
    alt: string;
    /** object-position CSS, es. "70% center" */
    position?: string;
  };
}) {
  const chrome = back
    ? await tObj("site_ui", "chrome_ui", CHROME_UI_IT)
    : null;

  if (image) {
    return (
      <section className="relative flex min-h-[280px] items-center overflow-hidden bg-primary text-white sm:min-h-[340px] lg:min-h-[400px]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: image.position ?? "70% center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 via-45% to-primary/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
        <Container className="relative py-10 sm:py-14 lg:py-16">
          {back && (
            <div className="mb-4 sm:mb-6">
              <BackLink
                tone="onDark"
                label={backLabel ?? chrome?.back ?? CHROME_UI_IT.back}
              />
            </div>
          )}
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 text-base leading-relaxed text-white/90 sm:mt-5 sm:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <div className="bg-primary text-white">
      <Container className="py-8 sm:py-14 lg:py-20">
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
