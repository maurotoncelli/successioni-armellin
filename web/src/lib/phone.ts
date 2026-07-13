/*
  Normalizzazione numeri di telefono in formato E.164 (es. +393201234567).
  Default Italia (+39) se manca il prefisso internazionale. Usata dal login SMS
  e dalla modifica recapiti nel profilo cliente.
*/
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
