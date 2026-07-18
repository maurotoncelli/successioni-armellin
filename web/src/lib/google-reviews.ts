import "server-only";
import { unstable_cache } from "next/cache";
import { reviews as fallbackReviews, type Review } from "@/content/site";

/*
  Recensioni Google (Places API New) per home / chi-sono.
  Se manca GOOGLE_PLACES_API_KEY (o la chiamata fallisce) → fallback fixture
  (testi reali copiati da Maps). Cache 12h per restare nei limiti di cache Google.
*/

export type SiteReview = Review & {
  authorUri?: string | null;
};

export type SiteReviewsPayload = {
  reviews: SiteReview[];
  rating: number | null;
  totalCount: number | null;
  mapsUri: string;
  source: "google" | "fallback";
};

/** Scheda Maps nota (CID da g.page / profilo GMB). */
export const GOOGLE_MAPS_URI =
  "https://www.google.com/maps/place/Successioni+Armellin/@43.6640408,10.6417377,17z/data=!3m1!4b1!4m6!3m5!1s0x132a759310eeb70f:0xc324a242fe596854";

const PLACE_TEXT_QUERY =
  "Successioni Armellin Via Vittorio Veneto 31 Pontedera";

type PlacesReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
  };
};

type PlaceDetails = {
  id?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
};

function mapPlaceReviews(raw: PlacesReview[]): SiteReview[] {
  const out: SiteReview[] = [];
  for (const r of raw) {
    const text = (r.text?.text || r.originalText?.text || "").trim();
    const author = (r.authorAttribution?.displayName || "").trim();
    const rating = Math.round(Number(r.rating) || 0);
    if (!text || !author || rating < 1) continue;
    out.push({
      author,
      location: "Google",
      rating: Math.min(5, rating),
      text,
      authorUri: r.authorAttribution?.uri ?? null,
    });
    if (out.length >= 5) break;
  }
  return out;
}

async function resolvePlaceResource(apiKey: string): Promise<string | null> {
  const configured = (process.env.GOOGLE_PLACE_ID || "").trim();
  if (configured) {
    return configured.startsWith("places/")
      ? configured
      : `places/${configured}`;
  }

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id,places.googleMapsUri",
    },
    body: JSON.stringify({
      textQuery: PLACE_TEXT_QUERY,
      languageCode: "it",
      maxResultCount: 1,
    }),
    next: { revalidate: 60 * 60 * 12 },
  });
  if (!res.ok) {
    console.error("[google-reviews] searchText:", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { places?: { id?: string }[] };
  const id = data.places?.[0]?.id;
  return id ? `places/${id}` : null;
}

async function fetchLiveReviews(): Promise<SiteReviewsPayload | null> {
  const apiKey = (process.env.GOOGLE_PLACES_API_KEY || "").trim();
  if (!apiKey) return null;

  const placeResource = await resolvePlaceResource(apiKey);
  if (!placeResource) return null;

  const res = await fetch(
    `https://places.googleapis.com/v1/${placeResource}?languageCode=it`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "id,rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 60 * 60 * 12 },
    },
  );
  if (!res.ok) {
    console.error("[google-reviews] details:", res.status, await res.text());
    return null;
  }

  const place = (await res.json()) as PlaceDetails;
  const reviews = mapPlaceReviews(place.reviews ?? []);
  if (reviews.length === 0) return null;

  return {
    reviews,
    rating: typeof place.rating === "number" ? place.rating : null,
    totalCount:
      typeof place.userRatingCount === "number" ? place.userRatingCount : null,
    mapsUri: place.googleMapsUri || GOOGLE_MAPS_URI,
    source: "google",
  };
}

function fallbackPayload(): SiteReviewsPayload {
  return {
    reviews: fallbackReviews.map((r) => ({ ...r })),
    rating: fallbackReviews.length
      ? fallbackReviews.reduce((s, r) => s + r.rating, 0) /
        fallbackReviews.length
      : null,
    totalCount: fallbackReviews.length,
    mapsUri: GOOGLE_MAPS_URI,
    source: "fallback",
  };
}

export const getSiteReviews = unstable_cache(
  async (): Promise<SiteReviewsPayload> => {
    try {
      const live = await fetchLiveReviews();
      if (live) return live;
    } catch (err) {
      console.error("[google-reviews]", err);
    }
    return fallbackPayload();
  },
  ["site-google-reviews-v1"],
  { revalidate: 60 * 60 * 12 },
);
