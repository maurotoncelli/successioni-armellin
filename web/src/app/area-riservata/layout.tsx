import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Area personale",
  robots: { index: false },
};

export default function AreaRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-bg-muted text-text">{children}</div>;
}
