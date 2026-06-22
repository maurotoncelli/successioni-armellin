"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackLink({
  label = "Indietro",
  fallbackHref = "/",
  tone = "default",
  className,
}: {
  label?: string;
  fallbackHref?: string;
  tone?: "default" | "onDark";
  className?: string;
}) {
  const router = useRouter();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
        tone === "onDark"
          ? "text-white/80 hover:text-white"
          : "text-text-muted hover:text-accent",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
