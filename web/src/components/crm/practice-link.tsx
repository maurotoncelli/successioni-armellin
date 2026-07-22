"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function PendingHint({ className }: { className?: string }) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <Loader2
      aria-hidden
      className={cn(
        "h-3.5 w-3.5 shrink-0 animate-spin text-crm-accent",
        className,
      )}
    />
  );
}

/** Link a scheda pratica con spinner mentre la navigazione è in corso. */
export function PracticeLink({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/crm/pratiche/${id}`}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      {children}
      <PendingHint />
    </Link>
  );
}

/** Hint da mettere DENTRO un <Link> verso una pratica (kanban, lista, …). */
export function PracticeLinkPendingHint({
  className,
}: {
  className?: string;
}) {
  return <PendingHint className={className} />;
}
