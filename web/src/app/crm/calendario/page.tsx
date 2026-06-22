import { Calendar } from "@/components/crm/calendar";
import { getPractices, calendarEvents } from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const practices = await getPractices();
  const today = new Date().toISOString().slice(0, 10);
  return <Calendar events={calendarEvents(practices)} today={today} />;
}
