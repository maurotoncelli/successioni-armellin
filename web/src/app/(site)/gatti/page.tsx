import type { Metadata } from "next";
import { BackLink } from "@/components/site/back-link";
import { KittenPlayer } from "@/components/site/kitten-player";
import { Section } from "@/components/ui/section";
import { KITTEN_VIDEOS, gattiCopy } from "@/content/gatti";
import { getRequestLocale, tObj } from "@/lib/locale";
import { CHROME_UI_IT } from "@/lib/site-ui-labels";

export async function generateMetadata(): Promise<Metadata> {
  const copy = gattiCopy(await getRequestLocale());
  return {
    title: copy.title,
    robots: { index: false, follow: false },
  };
}

export default async function GattiPage() {
  const copy = gattiCopy(await getRequestLocale());
  const chrome = await tObj("site_ui", "chrome_ui", CHROME_UI_IT);

  return (
    <Section tone="muted" className="py-4 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-3 sm:mb-5">
          <BackLink label={chrome.back} fallbackHref="/preventivo" />
        </div>
        <h1 className="text-xl leading-tight sm:text-3xl">{copy.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{copy.intro}</p>
        <ul className="mt-6 space-y-6">
          {KITTEN_VIDEOS.map((video) => (
            <li key={video.id}>
              <KittenPlayer
                videoId={video.id}
                title={copy[video.captionKey]}
                playLabel={copy.play}
              />
              <p className="mt-2 text-sm text-text">{copy[video.captionKey]}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-text-muted">{copy.note}</p>
      </div>
    </Section>
  );
}
