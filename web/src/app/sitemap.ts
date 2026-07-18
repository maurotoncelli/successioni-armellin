import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/cms";
import { absoluteUrl, localePath } from "@/lib/seo-locale";

// Route pubbliche indicizzabili (checkout e /preventivo/grazie sono noindex).
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/come-funziona", priority: 0.9 },
  { path: "/tariffe", priority: 0.9 },
  { path: "/preventivo", priority: 0.9 },
  { path: "/guide", priority: 0.8 },
  { path: "/strumenti/valore-catastale", priority: 0.8 },
  { path: "/documenti-successione", priority: 0.7 },
  { path: "/faq", priority: 0.7 },
  { path: "/chi-sono", priority: 0.6 },
  { path: "/contatti", priority: 0.6 },
  { path: "/garanzia", priority: 0.4 },
  { path: "/recesso", priority: 0.3 },
  { path: "/privacy", priority: 0.2 },
  { path: "/cookie-policy", priority: 0.2 },
  { path: "/termini-condizioni", priority: 0.2 },
];

function entry(
  barePath: string,
  priority: number,
  lastModified?: string | Date,
): MetadataRoute.Sitemap {
  const itPath = barePath === "/" ? "/" : barePath;
  const arPath = localePath(barePath, "ar");
  const base = {
    lastModified,
    priority,
    alternates: {
      languages: {
        it: absoluteUrl(itPath),
        ar: absoluteUrl(arPath),
        "x-default": absoluteUrl(itPath),
      },
    },
  };
  return [
    { url: absoluteUrl(itPath), ...base },
    { url: absoluteUrl(arPath), ...base },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();

  const staticEntries = STATIC_ROUTES.flatMap((r) =>
    entry(r.path, r.priority),
  );

  const articleEntries = articles.flatMap((a) =>
    entry(
      `/guide/${a.slug}`,
      0.7,
      a.updatedAt || a.publishedAt || undefined,
    ),
  );

  return [...staticEntries, ...articleEntries];
}
