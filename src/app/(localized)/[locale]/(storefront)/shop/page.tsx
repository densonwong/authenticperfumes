import type { Metadata } from "next";
import { FilterPanel } from "@/components/storefront/filter-panel";
import { ProductCard } from "@/components/storefront/product-card";
import { RequestFragranceCta } from "@/components/storefront/request-fragrance-cta";
import { getDictionary, normalizeLocale } from "@/lib/i18n";
import { getBrands, getProducts } from "@/lib/repositories/catalog";
import { localizedPageMetadata } from "@/lib/seo";
import type { Product } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = normalizeLocale((await params).locale);
  return localizedPageMetadata(locale, "/shop", {
    title: "Shop Fragrances",
    description: "Browse authentic niche and designer perfumes with ready stock and pre-order filters."
  });
}

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
    size: valueOf(searchParams, "size"),
    readyStock: valueOf(searchParams, "readyStock"),
    preOrder: valueOf(searchParams, "preOrder"),
    bestSeller: valueOf(searchParams, "bestSeller"),
    newArrival: valueOf(searchParams, "newArrival")
  };
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
    if (selected.size && !product.variants.some((variant) => variant.size === selected.size)) return false;
    if (selected.readyStock === "true" && !product.readyStock) return false;
    if (selected.preOrder === "true" && !product.preOrder) return false;
    if (selected.bestSeller === "true" && !product.bestSeller) return false;
    if (selected.newArrival === "true" && !product.newArrival) return false;

    return true;
  });
}

export default async function ShopPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const locale = normalizeLocale((await params).locale);
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
          locale={locale}
        />
        <div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} dictionary={dictionary} locale={locale} />
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
          <div className="mt-10">
            <RequestFragranceCta locale={locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
