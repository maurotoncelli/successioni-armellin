import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { MobileCta } from "@/components/site/mobile-cta";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col bg-bg text-text">
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <MobileCta />
    </div>
  );
}
