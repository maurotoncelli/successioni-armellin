import { FileText } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

export function LegalPlaceholder({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <>
      <PageHero eyebrow="Documento legale" title={title} />
      <Section>
        <div className="mx-auto max-w-3xl">
          {intro && <p className="text-lg text-text-muted">{intro}</p>}
          <Card className="mt-6 bg-bg-muted">
            <div className="flex items-center gap-3 text-primary">
              <FileText className="h-5 w-5 text-accent" />
              <h2 className="text-lg">Testo in fase di finalizzazione</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Questo documento legale e in fase di revisione con il supporto di un
              professionista (bozze in <code>bozze_legali/</code>). Il testo
              definitivo sara pubblicato prima del go-live. La versione italiana fa
              fede.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}
