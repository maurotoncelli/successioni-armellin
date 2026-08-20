import { attributionSummary, type Attribution } from "@/lib/attribution-shared";

export function AttributionBlock({
  source,
  attribution,
}: {
  source?: string;
  attribution?: Attribution | null;
}) {
  const a = attribution ?? {};
  const summary = attributionSummary(a);
  const details = [
    a.utm_campaign && source && !source.includes(a.utm_campaign)
      ? `Campagna: ${a.utm_campaign}`
      : "",
    a.utm_term ? `Parola: ${a.utm_term}` : "",
    a.gclid ? "Click Google Ads tracciato" : "",
    a.landing_page ? `Landing: ${a.landing_page}` : "",
  ].filter(Boolean);
  if (!summary && details.length === 0) return null;

  return (
    <div className="mt-1 space-y-0.5 text-xs text-crm-muted">
      {!source && summary ? (
        <p className="font-medium text-crm-text2">{summary}</p>
      ) : null}
      {details.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
