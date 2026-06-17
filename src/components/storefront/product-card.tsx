import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { formatRupiah } from "@/lib/format";
import type { Product, ProductStatus } from "@/lib/types";

function getPriceRange(product: Product, key: "retailPrice" | "authenticPrice") {
  const prices = product.variants.map((variant) => variant[key]).filter((price) => price > 0);

  if (prices.length === 0) return "Ask";

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return min === max ? formatRupiah(min) : `${formatRupiah(min)} - ${formatRupiah(max)}`;
}

export function ProductCard({
  product,
  priority = false,
  dictionary
}: {
  product: Product;
  priority?: boolean;
  dictionary: Pick<Dictionary, "status" | "product">;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block min-w-0 border border-ink/10 bg-paper transition hover:border-ink/30 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gold/60"
    >
      <div className="relative aspect-square overflow-hidden bg-warm">
        <Image
          src={product.imageUrl}
          alt={`${product.brandName} ${product.name}`}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      </div>
      <div className="space-y-2 p-3 sm:p-4">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
            {product.brandName}
          </p>
          <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55">
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
              {dictionary.product.retail}
            </span>
            <span className="text-xs text-ink/55 line-through">{getPriceRange(product, "retailPrice")}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink/45">
              {dictionary.product.authentic}
            </span>
            <span>{getPriceRange(product, "authenticPrice")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
