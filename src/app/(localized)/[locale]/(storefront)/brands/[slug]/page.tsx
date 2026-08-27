import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/storefront/product-card";
import { RequestFragranceCta } from "@/components/storefront/request-fragrance-cta";
import { getDictionary, normalizeLocale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import { getBrandBySlug, getProductsByBrandId } from "@/lib/repositories/catalog";
import { breadcrumbJsonLd, localizedAlternates, siteUrl, SITE_NAME } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = normalizeLocale(localeParam);
  const brand = await getBrandBySlug(slug);

  return {
    title: brand ? brand.name : locale === "id" ? "Merek" : "Brand",
    description: brand?.description,
    alternates: localizedAlternates(locale, brand ? `/brands/${brand.slug}` : "/brands"),
    openGraph: brand
      ? {
          title: `${brand.name} | ${SITE_NAME}`,
          description: brand.description,
          url: siteUrl(localizedPath(locale, `/brands/${brand.slug}`)),
          images: [brand.logoUrl]
        }
      : undefined
  };
}

export default async function BrandDetailPage({ params }: { params: Params }) {
  const { locale: localeParam, slug } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = getDictionary(locale);
  const brand = await getBrandBySlug(slug);

  if (!brand) notFound();

  const brandProducts = await getProductsByBrandId(brand.id);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Brand",
      name: brand.name,
      url: siteUrl(localizedPath(locale, `/brands/${brand.slug}`)),
      logo: brand.logoUrl,
      description: brand.description
    },
    breadcrumbJsonLd([
      { name: locale === "id" ? "Beranda" : "Home", path: "/" },
      { name: locale === "id" ? "Merek" : "Brands", path: "/brands" },
      { name: brand.name, path: `/brands/${brand.slug}` }
    ], locale)
  ];

  return (
    <main className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-ink/10 px-4 py-8 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[220px_1fr] lg:items-end">
          <div className="relative aspect-square overflow-hidden border border-ink/10 bg-warm">
            <Image src={brand.logoUrl} alt="" fill sizes="220px" className="object-cover" priority />
          </div>
          <div>
            <Link
              href={localizedPath(locale, "/brands")}
              className="text-xs font-semibold uppercase tracking-[0.16em] text-gold"
            >
              {dictionary.common.allBrands}
            </Link>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">{brand.name}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/68">{brand.description}</p>
            <dl className="mt-6 grid gap-4 border-t border-ink/10 pt-5 sm:grid-cols-3">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                  {locale === "id" ? "Negara" : "Country"}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{brand.country}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                  {locale === "id" ? "Berdiri" : "Founded"}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">
                  {brand.foundedYear ?? (locale === "id" ? "Tidak tersedia" : "N/A")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                  {dictionary.common.listed}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{brandProducts.length} {dictionary.common.bottles}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-5 border-b border-ink/10 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {locale === "id" ? "Koleksi saat ini" : "Current edit"}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">
            {locale === "id" ? `${brand.name} di Authentic Perfumes 8` : `${brand.name} at Authentic Perfumes 8`}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {brandProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} dictionary={dictionary} locale={locale} />
          ))}
        </div>
        <div className="mt-10">
          <RequestFragranceCta locale={locale} brandName={brand.name} />
        </div>
      </section>
    </main>
  );
}
