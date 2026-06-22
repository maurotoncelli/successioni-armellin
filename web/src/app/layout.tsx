import type { Metadata } from "next";
import { Inter, Lora, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { MobileCta } from "@/components/site/mobile-cta";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://successioni.example.it"),
  title: {
    default: "Successioni Online | Geom. Lorenzo Armellin",
    template: "%s | Geom. Lorenzo Armellin",
  },
  description:
    "La tua pratica di successione, senza muoverti da casa. Prezzo chiaro, tutto online, seguito dal Geom. Lorenzo Armellin, specializzato in successioni.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${inter.variable} ${lora.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text">
        <Navbar />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <Footer />
        <MobileCta />
      </body>
    </html>
  );
}
