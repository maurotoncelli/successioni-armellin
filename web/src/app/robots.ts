import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.successioniarmellin.it";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Aree private e pagine di flusso: gia noindex, qui blocchiamo anche il crawl.
      disallow: [
        "/crm",
        "/crm-login",
        "/area-riservata",
        "/api/",
        "/brogliaccio",
        "/checkout",
        "/preventivo/grazie",
      ],
    },
    sitemap: `${BASE.replace(/\/$/, "")}/sitemap.xml`,
  };
}
