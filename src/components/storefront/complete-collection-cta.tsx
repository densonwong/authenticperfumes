import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";

export function CompleteCollectionCta({ locale }: { locale: Locale }) {
  const copy =
    locale === "id"
      ? {
          eyebrow: "KOLEKSI LENGKAP KAMI",
          title: "Jelajahi Seluruh Koleksi Parfum Kami",
          body: "Temukan seluruh koleksi parfum niche dan desainer dari berbagai merek pilihan dunia.",
          action: "LIHAT SEMUA PARFUM"
        }
      : {
          eyebrow: "OUR COMPLETE COLLECTION",
          title: "Explore Our Complete Fragrance Collection",
          body: "Discover our complete niche and designer fragrance collection from selected houses around the world.",
          action: "DISCOVER ALL FRAGRANCES"
        };

  return (
    <section data-complete-collection className="border-y border-ink/10 bg-warm/35 px-4 py-8 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 border border-ink/10 bg-paper/65 p-6 md:grid-cols-[1fr_1px_1fr_auto] md:items-center md:p-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 max-w-md font-serif text-3xl leading-tight text-ink">
            {copy.title}
          </h2>
        </div>

        <div className="hidden h-16 bg-ink/15 md:block" aria-hidden="true" />

        <p className="max-w-lg text-sm leading-7 text-ink/70">{copy.body}</p>

        <Link
          href={localizedPath(locale, "/shop")}
          className="inline-flex min-h-12 items-center justify-center gap-3 border border-ink px-5 text-xs font-semibold uppercase tracking-[0.15em] text-ink transition duration-300 hover:bg-ink hover:text-paper active:scale-[0.98]"
        >
          {copy.action}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
