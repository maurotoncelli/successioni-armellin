"use client";

import { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";

type Doc = { name: string; description: string; when: string };

function DocRow({
  doc,
  faqLabel,
  faqHref,
}: {
  doc: Doc;
  faqLabel: string;
  faqHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        tabIndex={0}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="flex cursor-default items-start gap-2.5 rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        aria-describedby={open ? `${slugify(doc.name)}-pop` : undefined}
      >
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <span className="border-b border-dotted border-primary/30">
          {doc.name}
        </span>
      </div>

      {open && (
        <div
          id={`${slugify(doc.name)}-pop`}
          role="tooltip"
          className="absolute left-6 top-full z-20 w-72 pt-2"
        >
          <div className="rounded-xl border border-primary/10 bg-bg p-4 shadow-lg">
            <p className="text-sm leading-relaxed text-text">
              {doc.description}
            </p>
            <span className="mt-2.5 inline-block rounded-full bg-bg-muted px-2.5 py-0.5 text-xs font-medium text-text-muted">
              {doc.when}
            </span>
            <a
              href={faqHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark"
            >
              {faqLabel}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </li>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function DocList({
  items,
  faqLabel,
  faqHref,
}: {
  items: Doc[];
  faqLabel: string;
  faqHref: string;
}) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((doc) => (
        <DocRow key={doc.name} doc={doc} faqLabel={faqLabel} faqHref={faqHref} />
      ))}
    </ul>
  );
}
