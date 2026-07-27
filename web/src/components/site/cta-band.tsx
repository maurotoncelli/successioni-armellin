import { Phone } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export function CtaBand({
  title,
  subtitle,
  button,
  phone,
}: {
  title: string;
  subtitle?: string;
  button: { label: string; href: string };
  phone?: { label: string; href: string };
}) {
  return (
    <Section tone="primary" className="!py-10 text-center sm:!py-16 lg:!py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl text-white sm:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mt-3 text-base text-white/80 sm:mt-4 sm:text-lg">
            {subtitle}
          </p>
        )}
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
          <ButtonLink href={button.href} variant="primary" size="lg">
            {button.label}
          </ButtonLink>
          {phone && phone.label && (
            <ButtonLink
              href={phone.href}
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10"
            >
              <Phone className="h-4 w-4" />
              {phone.label}
            </ButtonLink>
          )}
        </div>
      </div>
    </Section>
  );
}
