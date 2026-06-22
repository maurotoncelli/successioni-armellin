import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/site/legal-placeholder";
import { text } from "@/lib/content";

export const metadata: Metadata = { title: "La nostra garanzia" };

export default function GaranziaPage() {
  return (
    <LegalPlaceholder
      title={text("legale", "garanzia_title", "La nostra garanzia")}
      intro="La promessa Soddisfatti o Rimborsati: cosa significa e come funziona."
    />
  );
}
