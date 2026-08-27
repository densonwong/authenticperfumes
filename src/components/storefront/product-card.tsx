import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import { formatRupiah } from "@/lib/format";
import type { Product, ProductStatus } from "@/lib/types";

function getPriceRange(product: Product, key: "authenticPrice", locale: Locale) {
  const prices = product.variants.map((variant) => variant[key]).filter((price) => price > 0);

  if (prices.length === 0) return locale === "id" ? "Tanya" : "Ask";

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return min === max ? formatRupiah(min) : `${formatRupiah(min)} - ${formatRupiah(max)}`;
}

export function ProductCard({
  product,
  priority = false,
  dictionary,
  locale
}: {
  product: Product;
  priority?: boolean;
  dictionary: Pick<Dictionary, "status" | "product">;
  locale: Locale;
}) {
  const hoverImageUrl = product.galleryUrls.find((url) => url && url !== product.imageUrl);

  return (
    <Link
      href={localizedPath(locale, `/products/${product.slug}`)}
      className="group block min-w-0 border border-ink/10 bg-paper transition duration-300 hover:border-ink/30 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gold/60"
    >
      <div className="relative aspect-square overflow-hidden bg-warm">
        <Image
          src={product.imageUrl}
          alt={`${product.brandName} ${product.name}`}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 50vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          priority={priority}
        />
        {hoverImageUrl ? (
          <Image
            src={hoverImageUrl}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 50vw"
            className="object-cover opacity-0 transition duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
          />
        ) : null}
      </div>
      <div className="space-y-2 p-3 sm:p-4">
        <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          {/* Jost sets wider than the old face, so the tracking tightens on
              narrow screens to keep the brand name from truncating. */}
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-gold sm:tracking-[0.16em]">
            {product.brandName}
          </p>
          <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink/55 sm:tracking-[0.12em]">
            {dictionary.status[product.status as ProductStatus]}
          </p>
        </div>
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink sm:text-[15px]">
            {product.name}
          </h3>
          <p className="mt-1 truncate text-xs text-ink/60">{product.concentration}</p>
        </div>
        <div className="border-t border-ink/10 pt-2 text-sm text-ink">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink/45">
              {dictionary.product.authentic}
            </span>
            <span>{getPriceRange(product, "authenticPrice", locale)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
