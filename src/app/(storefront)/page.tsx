import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { BrandCloud } from "@/components/storefront/brand-cloud";
import { CollectionTile } from "@/components/storefront/collection-tile";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductRow } from "@/components/storefront/product-row";
import { TrustStrip } from "@/components/storefront/trust-strip";
import {
  getBanners,
  getBestSellers,
  getFeaturedBrands,
  getNewArrivals,
  getPreOrderProducts,
  getReadyStockProducts
} from "@/lib/repositories/catalog";
import { getDictionary, getLocale, type Dictionary } from "@/lib/i18n";
import type { Banner, Product } from "@/lib/types";

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
      title: "Arrival niche, original terverifikasi",
      subtitle: "Botol pilihan dari Eropa dan US dengan sourcing personal untuk request langka."
    },
    "banner-ready-stock": {
      title: "Favorit ready stock",
      subtitle: "Pengiriman cepat untuk Jakarta dan seluruh Indonesia dengan bukti packing."
    },
    "banner-consultation": {
      title: "Temukan signature scent berikutnya",
      subtitle: "Ceritakan profil aroma dan occasion, lalu dapatkan shortlist via WhatsApp."
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
    preOrders,
    featuredBrands
  ] = await Promise.all([
    getBanners(),
    getNewArrivals(),
    getBestSellers(),
    getReadyStockProducts(),
    getPreOrderProducts(),
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
  const samplingProducts = [...newArrivals, ...bestSellers].slice(0, 4);

  return (
    <main className="bg-paper">
      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {primaryBanner ? (
            <CollectionTile banner={primaryBanner} priority dictionary={dictionary.tile} />
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
            eyebrow={dictionary.home.freshEdit}
            title={dictionary.home.newNoteworthy}
            href="/new-arrivals"
            linkLabel={dictionary.common.viewAll}
          />
          <ProductGrid products={newArrivals.slice(0, 4)} priority dictionary={dictionary} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow={dictionary.home.customerFavorites}
            title={dictionary.home.bestSellers}
            href="/best-sellers"
            linkLabel={dictionary.common.viewAll}
          />
          <ProductGrid products={bestSellers.slice(0, 4)} dictionary={dictionary} />
        </Reveal>
      </section>

      <section className="bg-warm/60 py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow={dictionary.home.fastDispatch}
              title={dictionary.home.readyStock}
              href="/shop?readyStock=true"
              linkLabel={dictionary.common.viewAll}
            />
            <ProductGrid products={readyStock.slice(0, 4)} dictionary={dictionary} />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow={dictionary.home.conciergeSourcing}
            title={dictionary.home.preOrderPicks}
            href="/pre-order"
            linkLabel={dictionary.common.viewAll}
          />
          <ProductGrid products={preOrders.slice(0, 4)} dictionary={dictionary} />
        </Reveal>
      </section>

      <section className="bg-ink py-10 text-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <Reveal>
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                {dictionary.home.sampling}
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight">{dictionary.home.samplingTitle}</h2>
              <p className="mt-4 text-sm leading-6 text-paper/70">
                {dictionary.home.samplingBody}
              </p>
              <Link
                href="/sampling"
                className="mt-6 inline-flex border border-paper/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition hover:border-paper hover:bg-paper hover:text-ink"
              >
                {dictionary.home.startSampling}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="bg-paper px-4 text-ink sm:px-6">
              {samplingProducts.map((product) => (
                <ProductRow key={product.id} product={product} dictionary={dictionary} />
              ))}
            </div>
          </Reveal>
        </div>
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
            <Link
              href="/contact"
              className="inline-flex w-full justify-center bg-ink px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-gold sm:w-auto"
            >
              {dictionary.home.requestViaWhatsApp}
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
