/*
  Report GA4 da terminale (Data API v1beta), senza chiavi JSON.

  Auth: credenziali utente locali (gcloud ADC, account studio@successioniarmellin.it)
  che IMPERSONANO il service account ga4-reader (Visualizzatore sulla proprietà GA4).
  La policy Workspace blocca le chiavi dei service account: questa è la via consentita.

  Prerequisiti (una volta sola, già fatti il 07/09 sul Mac di Mauro):
    brew install --cask google-cloud-sdk
    gcloud auth login --update-adc
    gcloud auth application-default set-quota-project starry-descent-502809-n9

  Uso:
    node scripts/ga4-report.mjs                      # ultimi 28 giorni
    node scripts/ga4-report.mjs 2026-09-01 today     # intervallo custom (YYYY-MM-DD | NdaysAgo | today | yesterday)
    node scripts/ga4-report.mjs --json 7daysAgo      # output JSON grezzo

  Nota: il rimbalzo GA4 = sessioni NON coinvolte (<10 s, nessun evento chiave, 1 sola pagina).
*/
import { GoogleAuth, Impersonated } from "google-auth-library";

const PROPERTY_ID = "545553802"; // GA4 "successioniarmellin.it"
const SERVICE_ACCOUNT = "ga4-reader@starry-descent-502809-n9.iam.gserviceaccount.com";
const LOCALE_PREFIX = /^\/(en|de|fr|es|ar|ru|tr|zh|hi|sq)(?=\/|$)/;

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const dates = args.filter((a) => !a.startsWith("--"));
const range = { startDate: dates[0] ?? "28daysAgo", endDate: dates[1] ?? "yesterday" };

let client;
async function ga4() {
  if (client) return client;
  const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
  client = new Impersonated({
    sourceClient: await auth.getClient(),
    targetPrincipal: SERVICE_ACCOUNT,
    targetScopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    lifetime: 3600,
  });
  return client;
}

async function runReport(body) {
  const c = await ga4();
  const res = await c.request({
    url: `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
    method: "POST",
    data: { dateRanges: [range], ...body },
  });
  const dims = (res.data.dimensionHeaders ?? []).map((d) => d.name);
  const mets = (res.data.metricHeaders ?? []).map((m) => m.name);
  return (res.data.rows ?? []).map((r) => {
    const o = {};
    dims.forEach((d, i) => (o[d] = r.dimensionValues[i].value));
    mets.forEach((m, i) => (o[m] = Number(r.metricValues[i].value)));
    return o;
  });
}

const pad = (s, n) => String(s).padEnd(n);
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const dur = (s) => `${Math.floor(s / 60)}m${String(Math.round(s % 60)).padStart(2, "0")}s`;
const stripLocale = (p) => p.replace(LOCALE_PREFIX, "") || "/";

const out = {};

out.pages = await runReport({
  dimensions: [{ name: "pagePath" }],
  metrics: [
    { name: "screenPageViews" }, { name: "totalUsers" }, { name: "sessions" },
    { name: "bounceRate" }, { name: "userEngagementDuration" },
  ],
  orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
  limit: 20,
});

out.landing = await runReport({
  dimensions: [{ name: "landingPage" }, { name: "sessionSourceMedium" }],
  metrics: [{ name: "sessions" }, { name: "bounceRate" }, { name: "engagedSessions" }],
  orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  limit: 15,
});

out.device = await runReport({
  dimensions: [{ name: "deviceCategory" }],
  metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "bounceRate" }],
});

out.events = await runReport({
  dimensions: [{ name: "eventName" }],
  metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
  orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
  limit: 40,
});

// Eventi custom della pagina Come funziona (section_view / video / cta_click).
out.comeFunziona = await runReport({
  dimensions: [{ name: "eventName" }, { name: "customEvent:section" }, { name: "customEvent:cta" }],
  metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
  dimensionFilter: {
    filter: {
      fieldName: "eventName",
      inListFilter: { values: ["section_view", "video_start", "video_progress", "video_complete", "cta_click"] },
    },
  },
  orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
  limit: 60,
}).catch(() => []); // le dimensioni custom esistono solo dopo la registrazione in GA4

out.cities = await runReport({
  dimensions: [{ name: "city" }],
  metrics: [{ name: "totalUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
  orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
  limit: 12,
});

if (asJson) {
  console.log(JSON.stringify({ range, ...out }, null, 2));
  process.exit(0);
}

console.log(`\n=== GA4 successioniarmellin.it · ${range.startDate} → ${range.endDate} ===`);

// Le versioni tradotte (/en/..., /de/...) vengono sommate alla pagina base;
// il rimbalzo è la media pesata sulle sessioni.
const pagesByPath = new Map();
for (const r of out.pages) {
  const key = stripLocale(r.pagePath);
  const acc = pagesByPath.get(key) ?? { screenPageViews: 0, totalUsers: 0, sessions: 0, bounced: 0, userEngagementDuration: 0 };
  acc.screenPageViews += r.screenPageViews;
  acc.totalUsers += r.totalUsers;
  acc.sessions += r.sessions;
  acc.bounced += r.bounceRate * r.sessions;
  acc.userEngagementDuration += r.userEngagementDuration;
  pagesByPath.set(key, acc);
}
console.log("\n--- Pagine (lingue sommate) ---");
console.log(pad("pagina", 30), pad("viste", 7), pad("utenti", 7), pad("sess.", 6), pad("rimbalzo", 9), "engag./utente");
for (const [path, r] of [...pagesByPath].sort((a, b) => b[1].screenPageViews - a[1].screenPageViews)) {
  console.log(
    pad(path.slice(0, 29), 30), pad(r.screenPageViews, 7), pad(r.totalUsers, 7), pad(r.sessions, 6),
    pad(pct(r.bounced / Math.max(1, r.sessions)), 9), dur(r.userEngagementDuration / Math.max(1, r.totalUsers)),
  );
}

console.log("\n--- Landing page × sorgente ---");
console.log(pad("landing", 26), pad("sorgente", 24), pad("sess.", 6), pad("rimbalzo", 9), "coinvolte");
for (const r of out.landing) {
  console.log(pad(r.landingPage.slice(0, 25), 26), pad(r.sessionSourceMedium.slice(0, 23), 24), pad(r.sessions, 6), pad(pct(r.bounceRate), 9), r.engagedSessions);
}

console.log("\n--- Dispositivo ---");
for (const r of out.device) console.log(pad(r.deviceCategory, 10), pad(`${r.sessions} sess.`, 11), pad(`${r.totalUsers} utenti`, 11), "rimbalzo", pct(r.bounceRate));

console.log("\n--- Eventi ---");
for (const r of out.events) console.log(pad(r.eventName, 30), pad(r.eventCount, 7), `${r.totalUsers} utenti`);

if (out.comeFunziona.length) {
  console.log("\n--- Come funziona: sezioni viste / video / CTA ---");
  for (const r of out.comeFunziona) {
    const what = r["customEvent:section"] !== "(not set)" ? r["customEvent:section"] : r["customEvent:cta"];
    console.log(pad(r.eventName, 16), pad(what, 34), pad(r.eventCount, 6), `${r.totalUsers} utenti`);
  }
}

console.log("\n--- Città (viste/utente alto = probabile traffico interno) ---");
for (const r of out.cities) {
  console.log(pad(r.city, 18), pad(`${r.totalUsers} ut.`, 8), pad(`${r.sessions} sess.`, 10), pad(`${r.screenPageViews} viste`, 11), `${(r.screenPageViews / Math.max(1, r.totalUsers)).toFixed(1)} viste/ut.`);
}
console.log();
