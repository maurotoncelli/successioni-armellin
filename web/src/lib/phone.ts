/*
  Normalizzazione numeri di telefono in formato E.164 (es. +393201234567).
  Default Italia (+39) se manca il prefisso internazionale. Usata dal login SMS
  e dalla modifica recapiti nel profilo cliente.
*/

/** Prefissi usati nel selettore profilo (ordine: IT prima, poi comuni UE/extra). */
export const DIAL_CODES = [
  { code: "+39", label: "IT +39" },
  { code: "+355", label: "AL +355" },
  { code: "+49", label: "DE +49" },
  { code: "+33", label: "FR +33" },
  { code: "+34", label: "ES +34" },
  { code: "+41", label: "CH +41" },
  { code: "+43", label: "AT +43" },
  { code: "+44", label: "UK +44" },
  { code: "+31", label: "NL +31" },
  { code: "+32", label: "BE +32" },
  { code: "+1", label: "US/CA +1" },
] as const;

const DIAL_CODE_VALUES = [...DIAL_CODES]
  .map((d) => d.code)
  .sort((a, b) => b.length - a.length);

export function splitPhone(raw: string): { dial: string; national: string } {
  const v = raw.replace(/[\s().-]/g, "");
  if (!v) return { dial: "+39", national: "" };
  const withPlus = v.startsWith("00") ? `+${v.slice(2)}` : v;
  if (withPlus.startsWith("+")) {
    for (const code of DIAL_CODE_VALUES) {
      if (withPlus.startsWith(code)) {
        return { dial: code, national: withPlus.slice(code.length) };
      }
    }
    const m = withPlus.match(/^(\+\d{1,3})(.*)$/);
    if (m) return { dial: m[1], national: m[2] };
  }
  // Numero nazionale italiano (con o senza zero iniziale)
  const national = withPlus.startsWith("0") ? withPlus.slice(1) : withPlus;
  return { dial: "+39", national };
}

export function normalizePhone(raw: string): string | null {
  let v = raw.replace(/[\s().-]/g, "");
  if (!v) return null;
  if (v.startsWith("00")) v = "+" + v.slice(2);
  if (!v.startsWith("+")) {
    if (v.startsWith("0")) v = v.slice(1); // toglie lo zero interurbano nazionale
    v = "+39" + v;
  }
  return /^\+\d{8,15}$/.test(v) ? v : null;
}
