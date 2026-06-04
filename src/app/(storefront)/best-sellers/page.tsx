import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/product-card";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getBestSellers } from "@/lib/repositories/catalog";

export const metadata: Metadata = {
  title: "Best Sellers",
  description: "Customer favorite authentic perfumes and repeat-request bottles.",
  alternates: {
    canonical: "/best-sellers"
  }
};

export default async function BestSellersPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const products = await getBestSellers();
  const isId = locale === "id";

  return (
    <main className="bg-paper">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 grid gap-4 border-b border-ink/10 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              {dictionary.home.customerFavorites}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">{dictionary.nav.bestSellers}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
              {isId
                ? "Botol yang paling sering ditanyakan, dibeli ulang, dan direkomendasikan customer setelah dipakai di Indonesia."
                : "The bottles customers ask for, reorder, and recommend after wearing in Indonesia."}
            </p>
          </div>
          <Link
            href="/shop?bestSeller=true"
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
