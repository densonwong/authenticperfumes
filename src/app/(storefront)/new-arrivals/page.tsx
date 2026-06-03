import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/product-card";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getNewArrivals } from "@/lib/repositories/catalog";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Fresh authentic perfume arrivals curated by Authentic Perfumes."
};

export default async function NewArrivalsPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const products = await getNewArrivals();
  const isId = locale === "id";

  return (
    <main className="bg-paper">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 grid gap-4 border-b border-ink/10 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              {dictionary.home.freshEdit}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">{dictionary.nav.newArrivals}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
              {isId
                ? "Tambahan terbaru dari berbagai niche house, request langka, dan botol yang layak dicoba lebih awal."
                : "Recent additions across niche houses, rare requests, and bottles worth testing early."}
            </p>
          </div>
          <Link
            href="/shop?newArrival=true"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-ink hover:text-gold"
          >
            {isId ? "Filter di toko" : "Filter in shop"}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} dictionary={dictionary} />
          ))}
        </div>
      </section>
    </main>
  );
}
