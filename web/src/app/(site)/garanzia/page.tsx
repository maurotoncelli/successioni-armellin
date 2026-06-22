import type { Metadata } from "next";
import { LegalDocView } from "@/components/site/legal-doc";
import { getLegalDoc } from "@/content/legal";

const doc = getLegalDoc("garanzia");

export const metadata: Metadata = { title: doc.title, description: doc.intro };

export default function GaranziaPage() {
  return <LegalDocView doc={doc} />;
}
