import { CalendarClock } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ArticleBody } from "@/components/site/article-body";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { obj, text } from "@/lib/content";
import type { ArticleBlock } from "@/content/articles";
import type { LegalDoc } from "@/content/legal";

/*
  Renderer dei documenti legali (data-driven).

  Identita del Titolare: i testi in @/content/legal usano token {{...}} che qui
  vengono sostituiti con i valori di `footer.studio` / `settings` (unica fonte di
  verita). Cosi i dati anagrafici (P.IVA, C.F., PEC, ...) si confermano una volta
  sola e restano allineati su footer, privacy, condizioni e cookie policy.
*/

type StudioIdentity = {
  ragione_sociale?: string;
  forma_giuridica?: string;
  piva?: string;
  cf?: string;
  rea?: string;
  albo?: string;
  indirizzo?: string;
};

function legalVars(): Record<string, string> {
  const studio = obj<StudioIdentity>("footer", "studio", {});
  return {
    ragione_sociale: studio.ragione_sociale ?? "DA CONFERMARE",
    forma_giuridica: studio.forma_giuridica ?? "DA CONFERMARE",
    indirizzo: studio.indirizzo ?? "DA CONFERMARE",
    piva: studio.piva ?? "DA CONFERMARE",
    cf: studio.cf ?? "DA CONFERMARE",
    rea: studio.rea ?? "DA CONFERMARE",
    albo: studio.albo ?? "DA CONFERMARE",
    pec: text("settings", "pec", "DA CONFERMARE"),
    email: text("settings", "email", "DA CONFERMARE"),
    telefono: text("settings", "phone", "DA CONFERMARE"),
  };
}

function interp(value: string, vars: Record<string, string>): string {
  return value.replace(/\{\{(\w+)\}\}/g, (_match, key: string) =>
    key in vars ? vars[key] : `{{${key}}}`,
  );
}

function interpBlock(block: ArticleBlock, vars: Record<string, string>): ArticleBlock {
  switch (block.type) {
    case "h2":
    case "h3":
    case "p":
      return { ...block, text: interp(block.text, vars) };
    case "ul":
    case "ol":
      return { ...block, items: block.items.map((i) => interp(i, vars)) };
    case "table":
      return {
        ...block,
        headers: block.headers.map((h) => interp(h, vars)),
        rows: block.rows.map((row) => row.map((cell) => interp(cell, vars))),
      };
    case "callout":
      return {
        ...block,
        title: block.title ? interp(block.title, vars) : block.title,
        text: interp(block.text, vars),
      };
    default:
      return block;
  }
}

export function LegalDocView({ doc }: { doc: LegalDoc }) {
  const vars = legalVars();
  const blocks = doc.body.map((b) => interpBlock(b, vars));

  const noticeBlock: ArticleBlock | null = doc.notice
    ? {
        type: "callout",
        tone: doc.notice.tone ?? "info",
        title: doc.notice.title,
        text: interp(doc.notice.text, vars),
      }
    : null;

  return (
    <>
      <PageHero eyebrow={doc.eyebrow} title={doc.title} back />
      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-text-muted">{doc.intro}</p>

          <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
            <CalendarClock className="h-4 w-4 text-accent" />
            <span>Ultimo aggiornamento: {doc.updatedAt}</span>
          </div>

          <div className="mt-8 space-y-6">
            {noticeBlock && <ArticleBody blocks={[noticeBlock]} />}
            <ArticleBody blocks={blocks} />
          </div>

          {doc.cta && (
            <div className="mt-10">
              <ButtonLink href={doc.cta.href} variant="primary">
                {doc.cta.label}
              </ButtonLink>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
