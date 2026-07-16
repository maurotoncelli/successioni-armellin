import { Check } from "lucide-react";
import { list } from "@/lib/content";

export function TrustBar() {
  const items = list<string>("home", "trustbar_items");
  if (items.length === 0) return null;

  // Griglia a celle uguali (2/3/6 colonne): ogni voce occupa lo stesso spazio
  // e le righe restano allineate, al posto del flex-wrap che creava righe
  // sbilanciate di larghezze diverse.
  return (
    <div className="border-y border-primary/5 bg-sand text-primary">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-2 gap-y-4 px-5 py-6 sm:grid-cols-3 sm:px-8 lg:grid-cols-6">
        {items.map((item) => (
          <span
            key={item}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white shadow-sm">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span className="text-xs font-semibold leading-snug tracking-tight text-primary sm:text-sm">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
