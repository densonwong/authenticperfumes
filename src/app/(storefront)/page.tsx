import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { BrandCloud } from "@/components/storefront/brand-cloud";
import { CollectionTile } from "@/components/storefront/collection-tile";
import { ProductCard } from "@/components/storefront/product-card";
import { TrustStrip } from "@/components/storefront/trust-strip";
import {
  getBanners,
  getBestSellers,
  getFeaturedBrands,
  getNewArrivals,
  getReadyStockProducts
} from "@/lib/repositories/catalog";
import { getDictionary, getLocale, type Dictionary } from "@/lib/i18n";
import type { Banner, Product } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  alternates: {
    canonical: "/"
  }
};

function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-ink/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 font-serif text-2xl leading-tight text-ink sm:text-3xl">{title}</h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:text-gold"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

function ProductGrid({
  products,
  priority = false,
  dictionary
}: {
  products: Product[];
  priority?: boolean;
  dictionary: Dictionary;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={priority && index < 2}
          dictionary={dictionary}
        />
      ))}
    </div>
  );
}

function localizeBanner(banner: Banner, locale: string): Banner {
  if (locale !== "id") return banner;

  const translations: Record<string, Pick<Banner, "title" | "subtitle">> = {
    "banner-niche-arrivals": {
      title: "100% original",
      subtitle: "Bebas request brand parfum niche dan designer original via WhatsApp."
    },
    "banner-ready-stock": {
      title: "Ready stock",
      subtitle: "Pengiriman ke seluruh Indonesia dengan konfirmasi stok sebelum pembayaran."
    },
    "banner-consultation": {
      title: "Discover your scent",
      subtitle: "Konsultasi aroma, hadiah, dan pilihan personal langsung via WhatsApp."
    }
  };

  return translations[banner.id] ? { ...banner, ...translations[banner.id] } : banner;
}

export default async function HomePage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const [
    banners,
    newArrivals,
    bestSellers,
    readyStock,
    featuredBrands
  ] = await Promise.all([
    getBanners(),
    getNewArrivals(),
    getBestSellers(),
    getReadyStockProducts(),
    getFeaturedBrands()
  ]);

  const normalizedBanners = banners.map((inputBanner) => {
    const banner = localizeBanner(inputBanner, locale);

    if (banner.id === "banner-ready-stock") {
      return { ...banner, href: "/shop?readyStock=true" };
    }

    if (banner.id === "banner-niche-arrivals") {
      return { ...banner, href: "/shop?newArrival=true" };
    }

    return banner;
  });
  const primaryBanner =
    normalizedBanners.find((banner) => banner.position === "primary") ?? normalizedBanners[0];
  const secondaryBanners = normalizedBanners.filter((banner) => banner.id !== primaryBanner?.id).slice(0, 2);
  const consultationUrl = buildWhatsAppUrl(
    locale === "id"
      ? "Halo Authentic Perfumes 8, saya ingin konsultasi parfum dan request brand."
      : "Hello Authentic Perfumes 8, I would like fragrance consultation and brand request help."
  );
  const requestUrl = buildWhatsAppUrl(
    locale === "id"
      ? "Halo Authentic Perfumes 8, saya mencari parfum tertentu. Mohon bantu cek stok, harga, dan opsi request."
      : "Hello Authentic Perfumes 8, I am looking for a specific fragrance. Please help check stock, price, and request options."
  );

  return (
    <main className="bg-paper">
      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {primaryBanner ? (
            <CollectionTile banner={primaryBanner} priority dictionary={dictionary.tile} headingLevel={1} />
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {secondaryBanners.map((banner) => (
              <CollectionTile key={banner.id} banner={banner} dictionary={dictionary.tile} />
            ))}
          </div>
        </div>
      </section>

      <TrustStrip dictionary={dictionary.trust} />

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow={dictionary.home.customerFavorites}
            title={dictionary.home.bestSellers}
            href="/best-sellers"
            linkLabel={dictionary.home.discoverMore}
          />
          <ProductGrid products={bestSellers.slice(0, 4)} priority dictionary={dictionary} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow={dictionary.home.freshEdit}
            title={dictionary.home.newNoteworthy}
            href="/new-arrivals"
            linkLabel={dictionary.home.discoverMore}
          />
          <ProductGrid products={newArrivals.slice(0, 4)} dictionary={dictionary} />
        </Reveal>
      </section>

      <section className="bg-warm/60 py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow={dictionary.home.fastDispatch}
              title={dictionary.home.readyStock}
              href="/shop?readyStock=true"
              linkLabel={dictionary.home.discoverMore}
            />
            <ProductGrid products={readyStock.slice(0, 4)} dictionary={dictionary} />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <div className="grid gap-6 border border-ink/10 bg-ink p-6 text-paper md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                {dictionary.home.discoverScent}
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight">
                {locale === "id"
                  ? "Gratis konsultasi untuk rekomendasi scent, hadiah, dan pilihan personal."
                  : "Free consultation for scent recommendations, gifts, and personal choices."}
              </h2>
            </div>
            <a
              href={consultationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex justify-center border border-paper/25 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] transition hover:border-paper hover:bg-paper hover:text-ink"
            >
              {dictionary.home.consultNow}
            </a>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow={dictionary.home.brandUniverse}
            title={dictionary.home.featuredHouses}
            href="/brands"
            linkLabel={dictionary.common.allBrands}
          />
          <BrandCloud brands={featuredBrands} dictionary={dictionary.common} />
        </Reveal>
      </section>

      <section className="border-t border-ink/10 bg-paper px-4 py-12 lg:px-8">
        <Reveal>
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                {dictionary.home.requestFragrance}
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">
                {dictionary.home.requestTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
                {dictionary.home.requestBody}
              </p>
            </div>
            <a
              href={requestUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full justify-center bg-ink px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-gold sm:w-auto"
            >
              {dictionary.home.requestViaWhatsApp}
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
