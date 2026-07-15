import { SiteNotes } from "@/components/crm/site-notes";
import { listSiteNotes } from "@/lib/site-notes";

export const dynamic = "force-dynamic";

export default async function MigliorieSitoPage() {
  const notes = await listSiteNotes();
  return <SiteNotes notes={notes} />;
}
