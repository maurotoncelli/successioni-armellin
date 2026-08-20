"use client";

import { useEffect } from "react";
import {
  ATTR_COOKIE,
  ATTR_MAX_AGE_SEC,
  deserializeAttribution,
  mergeAttribution,
  parseAttributionFromSearch,
  parseGaClientId,
  parseGclidFromGclAw,
  serializeAttribution,
} from "@/lib/attribution-shared";

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : "";
}

function writeAttrCookie(value: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ATTR_COOKIE}=${value}; Max-Age=${ATTR_MAX_AGE_SEC}; Path=/; SameSite=Lax${secure}`;
}

export function AttributionCapture() {
  useEffect(() => {
    const fromUrl = parseAttributionFromSearch(
      window.location.search,
      `${window.location.pathname}${window.location.search}`,
    );
    const stored = deserializeAttribution(readCookie(ATTR_COOKIE));
    const gclid = fromUrl.gclid || parseGclidFromGclAw(readCookie("_gcl_aw"));
    const gaClientId = parseGaClientId(readCookie("_ga"));
    const next = mergeAttribution(stored, {
      ...fromUrl,
      ...(gclid ? { gclid } : {}),
      ...(gaClientId ? { ga_client_id: gaClientId } : {}),
    });
    writeAttrCookie(serializeAttribution(next));
  }, []);
  return null;
}
