import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/storefront/product-card";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getBrandBySlug, getBrands, getProducts } from "@/lib/repositories/catalog";
import { breadcrumbJsonLd, siteUrl, SITE_NAME } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Params = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  return {
    title: brand ? brand.name : "Brand",
    description: brand?.description,
    alternates: {
      canonical: brand ? `/brands/${brand.slug}` : "/brands"
    },
    openGraph: brand
      ? {
          title: `${brand.name} | ${SITE_NAME}`,
          description: brand.description,
          url: siteUrl(`/brands/${brand.slug}`),
          images: [brand.logoUrl]
        }
      : undefined
  };
}

export default async function BrandDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const [brand, products] = await Promise.all([getBrandBySlug(slug), getProducts()]);

  if (!brand) notFound();

  const brandProducts = products.filter((product) => product.brandId === brand.id);
  const requestUrl = buildWhatsAppUrl(
    locale === "id"
      ? `Halo Authentic Perfumes 8, saya ingin request parfum ${brand.name}. Mohon bantu cek stok, harga, dan opsi sourcing.`
      : `Hello Authentic Perfumes 8, I would like to request a ${brand.name} fragrance. Please help check stock, price, and sourcing options.`
  );
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Brand",
      name: brand.name,
      url: siteUrl(`/brands/${brand.slug}`),
      logo: brand.logoUrl,
      description: brand.description
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Brands", path: "/brands" },
      { name: brand.name, path: `/brands/${brand.slug}` }
    ])
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
              href="/brands"
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
                <dd className="mt-1 text-sm font-semibold text-ink">{brand.foundedYear ?? "N/A"}</dd>
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
            {locale === "id" ? "Pilihan saat ini" : "Current edit"}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">
            {locale === "id" ? `${brand.name} di Authentic Perfumes 8` : `${brand.name} at Authentic Perfumes 8`}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {brandProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} dictionary={dictionary} />
          ))}
        </div>
        <div className="mt-10 border border-gold/35 bg-warm p-5 text-ink shadow-[0_18px_45px_rgba(153,119,55,0.10)] sm:p-7 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              {locale === "id" ? "Tidak menemukan parfum yang dicari?" : "Looking for another fragrance?"}
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight">
              {locale === "id" ? `Cari ${brand.name} Lainnya?` : `Looking for Another ${brand.name}?`}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/70">
              {locale === "id"
                ? `Kami bisa bantu request banyak parfum ${brand.name} lain di luar yang tampil online. Kirim nama parfum yang dicari, tim kami akan bantu cek stok, harga, dan opsi sourcing.`
                : `We carry many more ${brand.name} fragrances than those displayed online. Request any fragrance and our team will check availability, price, and sourcing options for you.`}
            </p>
          </div>
          <a
            href={requestUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex w-full justify-center border border-gold bg-gold px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-gold lg:mt-0 lg:w-auto"
          >
            {locale === "id" ? "Request Fragrance" : "Request Fragrance"}
          </a>
        </div>
      </section>
    </main>
  );
}
