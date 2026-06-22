import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/site/legal-placeholder";
import { text } from "@/lib/content";

export const metadata: Metadata = { title: "Condizioni di vendita" };

export default function TerminiPage() {
  return (
    <LegalPlaceholder
      title={text("legale", "tc_title", "Condizioni di vendita")}
      intro="I termini e le condizioni che regolano il nostro servizio."
    />
  );
}
