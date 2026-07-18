import type { Metadata } from "next";
import { LegalDocView } from "@/components/site/legal-doc";
import { getLegalDoc } from "@/lib/legal-docs";
import { getRequestLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const doc = getLegalDoc("privacy", await getRequestLocale());
  return { title: doc.title, description: doc.intro };
}

export default async function PrivacyPage() {
  const doc = getLegalDoc("privacy", await getRequestLocale());
  return <LegalDocView doc={doc} />;
}
