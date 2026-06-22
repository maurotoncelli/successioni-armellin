import type { Metadata } from "next";
import { LegalDocView } from "@/components/site/legal-doc";
import { getLegalDoc } from "@/content/legal";

const doc = getLegalDoc("cookie");

export const metadata: Metadata = { title: doc.title, description: doc.intro };

export default function CookiePolicyPage() {
  return <LegalDocView doc={doc} />;
}
