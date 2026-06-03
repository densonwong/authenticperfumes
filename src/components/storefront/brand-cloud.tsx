import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { Brand } from "@/lib/types";

export function BrandCloud({
  brands,
  dictionary
}: {
  brands: Brand[];
  dictionary: Dictionary["common"];
}) {
  return (
    <div className="grid grid-cols-2 border border-ink/10 bg-paper sm:grid-cols-3 lg:grid-cols-4">
      {brands.map((brand) => (
        <Link
          key={brand.id}
          href={`/brands/${brand.slug}`}
          className="min-w-0 border-b border-r border-ink/10 p-4 transition hover:bg-warm focus:outline-none focus:ring-2 focus:ring-gold/60 sm:p-5"
        >
          <p className="truncate font-serif text-lg text-ink">{brand.name}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ink/55">
            {brand.productCount} {brand.productCount === 1 ? dictionary.fragrance : dictionary.fragrances}
          </p>
        </Link>
      ))}
    </div>
  );
}
