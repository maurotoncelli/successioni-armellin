import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/site/legal-placeholder";
import { text } from "@/lib/content";

export const metadata: Metadata = { title: "Informativa sulla privacy" };

export default function PrivacyPage() {
  return (
    <LegalPlaceholder
      title={text("legale", "privacy_title", "Informativa sulla privacy")}
      intro="Come trattiamo i tuoi dati personali, in conformita al GDPR (Reg. UE 2016/679)."
    />
  );
}
