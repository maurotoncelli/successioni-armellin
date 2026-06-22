import { Calendar } from "@/components/crm/calendar";
import { calendarEvents } from "@/content/crm-data";

export default function CalendarioPage() {
  return <Calendar events={calendarEvents()} />;
}
