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
      className={`group relative flex overflow-hidden border border-ink/10 bg-ink text-paper focus:outline-none focus:ring-2 focus:ring-gold/70 ${
        full ? "min-h-[340px] sm:min-h-[440px] lg:min-h-[520px]" : "min-h-[260px] sm:min-h-[320px]"
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
      <div className={`relative mt-auto p-5 sm:p-7 ${full ? "max-w-2xl sm:p-10" : "max-w-xl"}`}>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/75">
          {dictionary.featured}
        </p>
        <Heading
          className={`font-serif leading-tight ${
            full ? "text-[30px] sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {banner.title}
        </Heading>
        <p className="mt-3 text-sm leading-6 text-paper/80">{banner.subtitle}</p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-paper">
          {dictionary.shop}
        </p>
      </div>
    </Link>
  );
}
