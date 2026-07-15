import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/cms";

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.successioniarmellin.it"
).replace(/\/$/, "");

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${BASE}${r.path}`,
      priority: r.priority,
    })),
    ...articles.map((a) => ({
      url: `${BASE}/guide/${a.slug}`,
      lastModified: a.updatedAt || a.publishedAt,
      priority: 0.7,
    })),
  ];
}
