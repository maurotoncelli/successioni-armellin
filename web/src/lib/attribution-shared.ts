export const ATTR_COOKIE = "sa_attr";
export const ATTR_MAX_AGE_SEC = 60 * 60 * 24 * 90;

export type Attribution = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  ga_client_id?: string;
};

const KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "landing_page",
  "ga_client_id",
] as const;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
}

export function emptyAttribution(): Attribution {
  return {};
}

export function parseAttribution(raw: unknown): Attribution {
  if (!raw || typeof raw !== "object") return {};
  const src = raw as Record<string, unknown>;
  const out: Attribution = {};
  for (const key of KEYS) {
    const v = clean(src[key]);
    if (v) out[key] = v;
  }
  return out;
}

export function parseAttributionFromSearch(search: string, landingPath: string): Attribution {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const out: Attribution = {};
  for (const key of [
    "gclid",
    "gbraid",
    "wbraid",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ] as const) {
    const v = clean(params.get(key));
    if (v) out[key] = v;
  }
  if (Object.keys(out).length > 0 && landingPath) {
    out.landing_page = landingPath.slice(0, 300);
  }
  return out;
}

export function parseGaClientId(gaCookie: string | undefined): string {
  if (!gaCookie) return "";
  const parts = gaCookie.split(".");
  if (parts.length < 4) return "";
  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

export function parseGclidFromGclAw(gclAw: string | undefined): string {
  if (!gclAw) return "";
  const parts = gclAw.split(".");
  return clean(parts[parts.length - 1]);
}

/** Last paid click wins on click ids; first-touch on UTM/landing. */
export function mergeAttribution(
  existing: Attribution | null | undefined,
  incoming: Attribution | null | undefined,
): Attribution {
  const prev = parseAttribution(existing);
  const next = parseAttribution(incoming);
  const out: Attribution = { ...prev };
  for (const key of KEYS) {
    const v = next[key];
    if (!v) continue;
    if (
      key === "gclid" ||
      key === "gbraid" ||
      key === "wbraid" ||
      key === "ga_client_id"
    ) {
      out[key] = v;
    } else if (!out[key]) {
      out[key] = v;
    }
  }
  return out;
}

export function isPaidGoogleClick(attr: Attribution): boolean {
  if (attr.gclid || attr.gbraid || attr.wbraid) return true;
  const source = (attr.utm_source ?? "").toLowerCase();
  const medium = (attr.utm_medium ?? "").toLowerCase();
  return source === "google" && /cpc|ppc|paid|ads/.test(medium);
}

export function attributionSourceLabel(
  attr: Attribution,
  fallback: string,
): string {
  if (isPaidGoogleClick(attr)) {
    const campaign = attr.utm_campaign?.trim();
    return campaign ? `Google Ads · ${campaign}` : "Google Ads";
  }
  if (attr.utm_source) {
    return [attr.utm_source, attr.utm_medium].filter(Boolean).join(" / ");
  }
  return fallback;
}

export function attributionSummary(attr: Attribution | null | undefined): string {
  const a = parseAttribution(attr);
  if (isPaidGoogleClick(a)) {
    return attributionSourceLabel(a, "Google Ads");
  }
  if (a.utm_source) return attributionSourceLabel(a, a.utm_source);
  return "";
}

export function serializeAttribution(attr: Attribution): string {
  return encodeURIComponent(JSON.stringify(parseAttribution(attr)));
}

export function deserializeAttribution(raw: string | undefined | null): Attribution {
  if (!raw) return {};
  try {
    return parseAttribution(JSON.parse(decodeURIComponent(raw)));
  } catch {
    try {
      return parseAttribution(JSON.parse(raw));
    } catch {
      return {};
    }
  }
}
