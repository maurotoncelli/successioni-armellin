import { PracticesBoard } from "@/components/crm/practices-board";
import { getPractices } from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function PratichePage() {
  const practices = await getPractices();
  return <PracticesBoard practices={practices} />;
}
