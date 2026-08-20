import Image from "next/image";

type Item = { titolo: string; testo: string };

/**
 * Empatia editoriale: due colonne (foto | tesi), pannello sabbia.
 * La foto ha un aspect ratio proprio, non si allunga sulla colonna testo.
 */
export function EmpatiaBlock({
  title,
  intro,
  items,
  image,
}: {
  title: string;
  intro: string;
  items: Item[];
  image: { src: string; alt: string };
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-sand">
      <div className="grid items-center gap-6 p-5 sm:gap-8 sm:p-7 md:grid-cols-2 md:gap-10 md:p-8 lg:gap-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[4/5]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[center_20%]"
          />
        </div>
        <div>
          <h2 className="text-2xl sm:text-4xl">{title}</h2>
          <p className="mt-3 text-base leading-relaxed text-text-muted sm:mt-4 sm:text-lg">
            {intro}
          </p>
          <ul className="mt-6 divide-y divide-primary/10 border-t border-primary/10 sm:mt-8">
            {items.map((item) => (
              <li key={item.titolo} className="py-3.5 sm:py-4">
                <p className="font-display text-lg text-primary sm:text-xl">
                  {item.titolo}
                </p>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
                  {item.testo}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
