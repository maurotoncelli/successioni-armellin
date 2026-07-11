"use client";

import { REOPEN_CONSENT_EVENT } from "@/components/analytics/consent-banner";

/*
  Link "Preferenze cookie" (footer): riapre il banner consensi per modificare o
  revocare la scelta in qualsiasi momento, come promesso nella Cookie Policy.
*/

export function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(REOPEN_CONSENT_EVENT))}
      className={className}
    >
      Preferenze cookie
    </button>
  );
}
