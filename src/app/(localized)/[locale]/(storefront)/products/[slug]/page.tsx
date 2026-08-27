import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGalleryCarousel } from "@/components/storefront/product-gallery-carousel";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";
import { getDictionary, normalizeLocale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import { getProductBySlug } from "@/lib/repositories/catalog";
import { breadcrumbJsonLd, localizedAlternates, siteUrl, SITE_NAME } from "@/lib/seo";
import type { ProductStatus } from "@/lib/types";

type Params = Promise<{ locale: string; slug: string }>;
export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

const schemaAvailability: Record<ProductStatus, string> = {
  ready_stock: "https://schema.org/InStock",
  limited_stock: "https://schema.org/LimitedAvailability",
  pre_order: "https://schema.org/PreOrder",
  out_of_stock: "https://schema.org/OutOfStock"
};

function priceValidUntil() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = normalizeLocale(localeParam);
  const product = await getProductBySlug(slug);
  const title = product
    ? `${product.brandName} ${product.name} ${locale === "id" ? "Asli" : "Original"}`
    : locale === "id" ? "Produk" : "Product";

  return {
    title,
    description: product?.description,
    alternates: localizedAlternates(locale, product ? `/products/${product.slug}` : "/shop"),
    openGraph: product
      ? {
          title: `${title} | ${SITE_NAME}`,
          description: product.description,
          url: siteUrl(localizedPath(locale, `/products/${product.slug}`)),
          images: [product.imageUrl]
        }
      : undefined
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { locale: localeParam, slug } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = getDictionary(locale);
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const genderLabel = locale === "id"
    ? ({ unisex: "Uniseks", women: "Wanita", men: "Pria" } as const)[product.gender]
    : ({ unisex: "Unisex", women: "Women", men: "Men" } as const)[product.gender];
  const canonicalUrl = siteUrl(localizedPath(locale, `/products/${product.slug}`));
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${product.brandName} ${product.name}`,
      sku: product.id,
      image: [product.imageUrl, ...product.galleryUrls],
      description: product.description,
      category: locale === "id" ? "Parfum" : "Fragrance",
      brand: {
        "@type": "Brand",
        name: product.brandName
      },
      offers: product.variants.map((item) => ({
        "@type": "Offer",
        priceCurrency: "IDR",
        price: item.authenticPrice > 0 ? item.authenticPrice : undefined,
        availability: schemaAvailability[item.status],
        itemCondition: "https://schema.org/NewCondition",
        priceValidUntil: priceValidUntil(),
        url: `${canonicalUrl}?variant=${item.id}`,
        seller: {
          "@type": "Organization",
          name: SITE_NAME
        }
      }))
    },
    breadcrumbJsonLd([
      { name: locale === "id" ? "Beranda" : "Home", path: "/" },
      { name: locale === "id" ? "Belanja" : "Shop", path: "/shop" },
      { name: product.name, path: `/products/${product.slug}` }
    ], locale)
  ];

  return (
    <main className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <ProductGalleryCarousel
            images={[product.imageUrl, ...product.galleryUrls]}
            productName={`${product.brandName} ${product.name}`}
            labels={dictionary.product}
          />
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {product.brandName}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">{product.name}</h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/55">
            {product.concentration} / {genderLabel}
          </p>

          <Suspense fallback={<div className="mt-6 min-h-80 border-y border-ink/10" />}>
            <ProductPurchasePanel
              canonicalUrl={canonicalUrl}
              dictionary={dictionary}
              locale={locale}
              product={product}
            />
          </Suspense>

          <dl className="mt-7 grid gap-4 border-t border-ink/10 pt-5 text-sm sm:grid-cols-2">
            {/* Origin (Asal) and Notes hidden from public storefront for now. */}
            <div>
              <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">{dictionary.product.sku}</dt>
              <dd className="mt-1 text-ink">{product.id}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">{dictionary.product.fulfillment}</dt>
              <dd className="mt-1 text-ink">{product.preOrder ? dictionary.product.preOrderAvailable : dictionary.product.readyStockFocused}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
