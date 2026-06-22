import { PracticesBoard } from "@/components/crm/practices-board";
import { practices } from "@/content/crm-data";

export default function PratichePage() {
  return <PracticesBoard practices={practices} />;
}
