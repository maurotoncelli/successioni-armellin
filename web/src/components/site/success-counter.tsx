import { tObj } from "@/lib/locale";
import { SuccessCounterBand } from "@/components/site/success-counter-band";

/*
  Contatore "successioni gestite" della home (social proof, @02/@03).
  Dati da content_entries `home.success_counter` (per lingua, fallback IT):
  il numero e' un dato di business dichiarato da Lorenzo — aggiornarlo li',
  non nel codice.
*/
type SuccessCounterContent = {
  target: number;
  suffix: string;
  eyebrow: string;
  label: string;
  note: string;
};

const FALLBACK: SuccessCounterContent = {
  target: 250,
  suffix: "+",
  eyebrow: "Numeri reali",
  label: "successioni gestite",
  note: "",
};

export async function SuccessCounter() {
  const c = await tObj<SuccessCounterContent>(
    "home",
    "success_counter",
    FALLBACK,
  );
  const target = Number(c.target);
  if (!Number.isFinite(target) || target <= 0 || !c.label) return null;

  return (
    <SuccessCounterBand
      target={target}
      suffix={c.suffix ?? ""}
      eyebrow={c.eyebrow ?? ""}
      label={c.label}
      note={c.note ?? ""}
    />
  );
}
