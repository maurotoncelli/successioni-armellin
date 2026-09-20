import { tObj } from "@/lib/locale";
import { SuccessCounterBand } from "@/components/site/success-counter-band";

/*
  Social proof home: `home.success_counter`.
  Se c'è `headline`, niente contatore 250+: mostriamo la frase (Mauro 20/09).
*/

type SuccessCounterContent = {
  target: number;
  suffix: string;
  eyebrow: string;
  label: string;
  note: string;
  headline?: string;
};

const FALLBACK: SuccessCounterContent = {
  target: 250,
  suffix: "+",
  eyebrow: "Esperienza sul campo",
  label: "successioni seguite",
  note: "",
  headline: "Centinaia di successioni seguite da Lorenzo",
};

export async function SuccessCounter() {
  const c = await tObj<SuccessCounterContent>(
    "home",
    "success_counter",
    FALLBACK,
  );
  const headline = (c.headline ?? "").trim();
  const target = Number(c.target);
  if (headline) {
    return (
      <SuccessCounterBand
        eyebrow={c.eyebrow ?? ""}
        headline={headline}
        note={c.note ?? ""}
      />
    );
  }
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
