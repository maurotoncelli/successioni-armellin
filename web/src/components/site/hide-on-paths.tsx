"use client";

import { usePathname } from "next/navigation";

export function HideOnPaths({
  prefixes,
  children,
}: {
  prefixes: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname && prefixes.some((p) => pathname.startsWith(p))) return null;
  return <>{children}</>;
}
