import {
  WELCOME_VIDEO_DURATION_ISO,
  WELCOME_VIDEO_POSTER,
  WELCOME_VIDEO_SRC,
} from "@/lib/welcome-video-shared";

type Props = {
  name: string;
  description: string;
  /** Absolute site origin, e.g. https://www.successioniarmellin.it */
  siteUrl: string;
  /** BCP-47 language of the spoken audio (VO is always Italian). */
  inLanguage?: string;
  contentPath?: string;
  posterPath?: string;
  duration?: string;
  uploadDate?: string;
};

/** JSON-LD VideoObject (welcome o come-funziona; render only when the MP4 exists). */
export function WelcomeVideoJsonLd({
  name,
  description,
  siteUrl,
  inLanguage = "it",
  contentPath = WELCOME_VIDEO_SRC,
  posterPath = WELCOME_VIDEO_POSTER,
  duration = WELCOME_VIDEO_DURATION_ISO,
  uploadDate = "2026-07-27T12:00:00+02:00",
}: Props) {
  const origin = siteUrl.replace(/\/$/, "");
  const data = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: `${origin}${posterPath}`,
    contentUrl: `${origin}${contentPath}`,
    embedUrl: `${origin}${contentPath}`,
    // ISO-8601 con fuso: Google rifiuta la sola data (YYYY-MM-DD).
    uploadDate,
    duration,
    inLanguage,
    isFamilyFriendly: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
