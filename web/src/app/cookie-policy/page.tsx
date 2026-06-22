import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/site/legal-placeholder";
import { text } from "@/lib/content";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return (
    <LegalPlaceholder
      title={text("legale", "cookie_title", "Cookie Policy")}
      intro="I cookie e le tecnologie simili che utilizziamo e come gestire i consensi."
    />
  );
}
