"use client";

import { REOPEN_CONSENT_EVENT } from "@/components/analytics/consent-banner";
import { COOKIE_UI_IT } from "@/lib/site-ui-labels";

/*
  Link "Preferenze cookie" (footer): riapre il banner consensi per modificare o
  revocare la scelta in qualsiasi momento, come promesso nella Cookie Policy.
*/

export function CookiePreferencesLink({
  className,
  label = COOKIE_UI_IT.preferences,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(REOPEN_CONSENT_EVENT))}
      className={className}
    >
      {label}
    </button>
  );
}
