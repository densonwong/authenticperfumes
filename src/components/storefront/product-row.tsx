import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import type { Product, ProductStatus } from "@/lib/types";

const statusLabels: Record<ProductStatus, string> = {
  ready_stock: "Ready stock",
  pre_order: "Pre order",
  limited_stock: "Limited stock",
  out_of_stock: "Out of stock"
};

function getStartingPrice(product: Product) {
  const price = Math.min(...product.variants.map((variant) => variant.authenticPrice));

  return formatRupiah(price);
}

export function ProductRow({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="grid grid-cols-[88px_1fr] gap-4 border-b border-ink/10 py-4 transition hover:bg-warm/50 focus:outline-none focus:ring-2 focus:ring-gold/60 sm:grid-cols-[104px_1fr_auto]"
    >
      <div className="relative aspect-square overflow-hidden bg-warm">
        <Image
          src={product.imageUrl}
          alt={`${product.brandName} ${product.name}`}
          fill
          sizes="104px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 self-center">
        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
          {product.brandName}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-ink sm:text-base">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-ink/60">{product.concentration}</p>
      </div>
      <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-1 self-center text-xs sm:col-start-auto sm:block sm:text-right">
        <p className="font-semibold uppercase tracking-[0.12em] text-ink/55">
          {statusLabels[product.status]}
        </p>
        <p className="mt-0 font-semibold text-ink sm:mt-2">From {getStartingPrice(product)}</p>
      </div>
    </Link>
  );
}
