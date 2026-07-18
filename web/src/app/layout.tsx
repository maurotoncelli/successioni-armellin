import type { Metadata } from "next";
import { Inter, Lora, Noto_Sans_Arabic, Playfair_Display } from "next/font/google";
import { cookies, headers } from "next/headers";
import { coerceLocale } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.successioniarmellin.it",
  ),
  // Template neutro qui; il brand lo aggiunge solo (site)/layout.
  // Evita doppio "| Geom. Lorenzo Armellin" su home/lingue.
  title: {
    default: "Successioni Online | Geom. Lorenzo Armellin",
    template: "%s",
  },
  description:
    "Dichiarazione di successione online con un professionista reale: Geom. Lorenzo Armellin, iscritto all'Albo. Preventivo chiaro, documenti e pratica da casa — anche di persona a Pontedera.",
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Successioni Armellin",
    images: [
      {
        url: "/logo-a-512.png",
        width: 512,
        height: 512,
        alt: "Successioni Armellin - Geom. Lorenzo Armellin",
      },
    ],
  },
  twitter: { card: "summary" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Allineato a getRequestLocale: x-locale (proxy su prefisso /en|/ar|… o ?lang=)
  // prima del cookie — cosi lang/dir sono corretti al primo hit.
  const locale = coerceLocale(
    (await headers()).get("x-locale"),
    (await cookies()).get("lang")?.value,
  );
  const rtl = locale === "ar";

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      className={`${inter.variable} ${lora.variable} ${playfair.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
