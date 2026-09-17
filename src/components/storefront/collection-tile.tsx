import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import type { Banner } from "@/lib/types";

export function CollectionTile({
  banner,
  priority = false,
  dictionary,
  headingLevel = 2,
  locale,
  full = false
}: {
  banner: Banner;
  priority?: boolean;
  dictionary: Dictionary["tile"];
  headingLevel?: 1 | 2;
  locale: Locale;
  /** Single full-width hero rather than one cell of a multi-tile grid. */
  full?: boolean;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <Link
      href={localizedPath(locale, banner.href)}
      className={`group relative flex overflow-hidden bg-ink text-paper focus:outline-none focus:ring-2 focus:ring-gold/70 ${
        full
          ? "h-[calc(100svh-8rem)] min-h-[420px]"
          : "min-h-[260px] border border-ink/10 sm:min-h-[320px]"
      }`}
    >
      <Image
        src={banner.imageUrl}
        alt=""
        fill
        sizes={full ? "100vw" : "(min-width: 1024px) 33vw, 100vw"}
        className="object-cover opacity-70 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-80"
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
      {full ? (
        <div className="relative mt-auto w-full">
          <div className="mx-auto max-w-7xl px-4 pb-10 sm:pb-14 lg:px-8 lg:pb-20">
            <div className="max-w-2xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/75">
                {dictionary.featured}
              </p>
              <Heading className="font-serif text-[32px] leading-tight sm:text-5xl lg:text-6xl">
                {banner.title}
              </Heading>
              <p className="mt-4 text-sm leading-6 text-paper/80 sm:text-base">{banner.subtitle}</p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-paper">
                {dictionary.shop}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative mt-auto max-w-xl p-5 sm:p-7">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/75">
            {dictionary.featured}
          </p>
          <Heading className="font-serif text-2xl leading-tight sm:text-3xl">
            {banner.title}
          </Heading>
          <p className="mt-3 text-sm leading-6 text-paper/80">{banner.subtitle}</p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-paper">
            {dictionary.shop}
          </p>
        </div>
      )}
    </Link>
  );
}
