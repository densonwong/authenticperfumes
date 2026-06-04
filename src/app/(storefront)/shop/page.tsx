import type { Metadata } from "next";
import { FilterPanel } from "@/components/storefront/filter-panel";
import { ProductCard } from "@/components/storefront/product-card";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getBrands, getProducts } from "@/lib/repositories/catalog";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop Fragrances",
  description: "Browse authentic niche and designer perfumes with ready stock, pre-order, and price filters.",
  alternates: {
    canonical: "/shop"
  }
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function valueOf(searchParams: Awaited<SearchParams>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function selectedFrom(searchParams: Awaited<SearchParams>) {
  return {
    q: valueOf(searchParams, "q"),
    brand: valueOf(searchParams, "brand"),
    gender: valueOf(searchParams, "gender"),
    note: valueOf(searchParams, "note"),
    price: valueOf(searchParams, "price"),
    size: valueOf(searchParams, "size"),
    readyStock: valueOf(searchParams, "readyStock"),
    preOrder: valueOf(searchParams, "preOrder"),
    bestSeller: valueOf(searchParams, "bestSeller"),
    newArrival: valueOf(searchParams, "newArrival")
  };
}

function priceMatches(product: Product, band?: string) {
  if (!band) return true;
  const lowest = Math.min(...product.variants.map((variant) => variant.authenticPrice));

  if (band === "under-1m") return lowest < 1000000;
  if (band === "1m-3m") return lowest >= 1000000 && lowest < 3000000;
  if (band === "3m-5m") return lowest >= 3000000 && lowest < 5000000;
  if (band === "over-5m") return lowest >= 5000000;

  return true;
}

function filterProducts(products: Product[], selected: ReturnType<typeof selectedFrom>) {
  const q = selected.q?.trim().toLowerCase();

  return products.filter((product) => {
    const searchable = [
      product.name,
      product.brandName,
      product.concentration,
      product.description,
      product.countryOfOrigin,
      product.gender,
      ...product.notes
    ]
      .join(" ")
      .toLowerCase();

    if (q && !searchable.includes(q)) return false;
    if (selected.brand && product.brandId !== `brand-${selected.brand}` && product.brandName.toLowerCase() !== selected.brand.replaceAll("-", " ")) return false;
    if (selected.gender && product.gender !== selected.gender) return false;
    if (selected.note && !product.notes.some((note) => note.toLowerCase() === selected.note?.toLowerCase())) return false;
    if (selected.size && !product.variants.some((variant) => variant.size === selected.size)) return false;
    if (!priceMatches(product, selected.price)) return false;
    if (selected.readyStock === "true" && !product.readyStock) return false;
    if (selected.preOrder === "true" && !product.preOrder) return false;
    if (selected.bestSeller === "true" && !product.bestSeller) return false;
    if (selected.newArrival === "true" && !product.newArrival) return false;

    return true;
  });
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const resolvedSearchParams = await searchParams;
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  const selected = selectedFrom(resolvedSearchParams);
  const filteredProducts = filterProducts(products, selected);

  return (
    <main className="bg-paper">
      <section className="border-b border-ink/10 px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {dictionary.shop.catalog}
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-serif text-4xl leading-tight text-ink">{dictionary.shop.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
                {dictionary.shop.body}
              </p>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/55">
              {filteredProducts.length} {dictionary.shop.of} {products.length} {dictionary.common.bottles}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
        <FilterPanel
          brands={brands}
          products={products}
          selected={selected}
          dictionary={{ ...dictionary.shop, ...dictionary.common }}
        />
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} dictionary={dictionary} />
            ))}
          </div>
        ) : (
          <div className="border border-ink/10 bg-warm/45 p-8">
            <h2 className="font-serif text-2xl text-ink">{dictionary.shop.noTitle}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/65">
              {dictionary.shop.noBody}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
