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
};

/** JSON-LD VideoObject for the welcome clip (render only when the MP4 exists). */
export function WelcomeVideoJsonLd({
  name,
  description,
  siteUrl,
  inLanguage = "it",
}: Props) {
  const origin = siteUrl.replace(/\/$/, "");
  const data = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: `${origin}${WELCOME_VIDEO_POSTER}`,
    contentUrl: `${origin}${WELCOME_VIDEO_SRC}`,
    embedUrl: `${origin}${WELCOME_VIDEO_SRC}`,
    uploadDate: "2026-07-27",
    duration: WELCOME_VIDEO_DURATION_ISO,
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
