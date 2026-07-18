"use client";

import { usePathname } from "next/navigation";
import { stripSeoLocalePrefix } from "@/lib/seo-locale";

export function HideOnPaths({
  prefixes,
  children,
}: {
  prefixes: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname ? stripSeoLocalePrefix(pathname).pathname : "";
  if (bare && prefixes.some((p) => bare === p || bare.startsWith(`${p}/`))) {
    return null;
  }
  return <>{children}</>;
}
