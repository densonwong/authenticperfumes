import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/product-card";
import { getDictionary, normalizeLocale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import { getNewArrivals } from "@/lib/repositories/catalog";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = normalizeLocale((await params).locale);
  return localizedPageMetadata(locale, "/new-arrivals", locale === "id"
    ? {
        title: "Produk Parfum Terbaru",
        description: "Jelajahi produk parfum asli terbaru pilihan Authentic Perfumes 8."
      }
    : {
        title: "New Arrivals",
        description: "Fresh authentic perfume arrivals curated by Authentic Perfumes 8."
      });
}

export default async function NewArrivalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = normalizeLocale((await params).locale);
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
                ? "Koleksi terbaru dari berbagai rumah parfum niche, parfum langka yang banyak dicari, dan pilihan yang layak dicoba lebih awal."
                : "Recent additions across niche houses, rare requests, and bottles worth testing early."}
            </p>
          </div>
          <Link
            href={localizedPath(locale, "/shop?newArrival=true")}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-ink hover:text-gold"
          >
            {isId ? "Lihat di katalog" : "Filter in shop"}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} dictionary={dictionary} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}
