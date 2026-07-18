import { Section } from "@/components/ui/section";
import { t, tList } from "@/lib/locale";
import { ButtonLink } from "@/components/ui/button";

export default async function NotFound() {
  const ctas = await tList<{ label: string; href: string }>("sistema", "e404_cta");

  return (
    <Section className="text-center">
      <div className="mx-auto max-w-xl">
        <p className="font-display text-6xl font-bold text-accent/40">404</p>
        <h1 className="mt-4 text-3xl">{await t("sistema", "e404_title")}</h1>
        <p className="mt-3 text-text-muted">{await t("sistema", "e404_body")}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {ctas.map((c, i) => (
            <ButtonLink
              key={c.href}
              href={c.href}
              variant={i === 0 ? "primary" : "outline"}
            >
              {c.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </Section>
  );
}
