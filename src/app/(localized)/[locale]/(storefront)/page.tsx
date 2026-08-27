import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { BrandCloud } from "@/components/storefront/brand-cloud";
import { BrandMarquee } from "@/components/storefront/brand-marquee";
import { CollectionTile } from "@/components/storefront/collection-tile";
import { CompleteCollectionCta } from "@/components/storefront/complete-collection-cta";
import { ProductSlider } from "@/components/storefront/product-slider";
import { TrustStrip } from "@/components/storefront/trust-strip";
import {
  getBanners,
  getBestSellers,
  getFeaturedBrands,
  getLogoWallBrands,
  getNewArrivals,
  getReadyStockProducts
} from "@/lib/repositories/catalog";
import { getDictionary, normalizeLocale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import { localizedPageMetadata } from "@/lib/seo";
import type { Banner } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = normalizeLocale((await params).locale);
  return localizedPageMetadata(locale, "/", locale === "id"
    ? {
        title: "Parfum Asli Niche dan Desainer",
        description: "Temukan koleksi parfum asli niche dan desainer pilihan Authentic Perfumes 8."
      }
    : {
        title: "Authentic Niche and Designer Fragrances",
        description: "Discover curated authentic niche and designer fragrances from Authentic Perfumes 8."
      });
}

export const dynamic = "force-static";

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
        <h2 className="mt-2 font-serif text-[28px] leading-tight text-ink sm:text-[30px]">{title}</h2>
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

function localizeBanner(banner: Banner, locale: string): Banner {
  if (locale !== "id") return banner;

  const translations: Record<string, Pick<Banner, "title" | "subtitle">> = {
    "banner-niche-arrivals": {
      title: "100% asli",
      subtitle: "Temukan parfum niche dan desainer asli pilihan atau minta bantuan pencarian melalui WhatsApp."
    },
    "banner-ready-stock": {
      title: "Stok tersedia",
      subtitle: "Pengiriman ke seluruh Indonesia dengan konfirmasi stok sebelum pembayaran."
    },
    "banner-consultation": {
      title: "Temukan aroma pilihan Anda",
      subtitle: "Konsultasi aroma, hadiah, dan pilihan personal langsung melalui WhatsApp."
    }
  };

  return translations[banner.id] ? { ...banner, ...translations[banner.id] } : banner;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = normalizeLocale((await params).locale);
  const dictionary = getDictionary(locale);
  const [
    banners,
    newArrivals,
    bestSellers,
    readyStock,
    featuredBrands,
    logoWallBrands
  ] = await Promise.all([
    getBanners(),
    getNewArrivals(),
    getBestSellers(),
    getReadyStockProducts(),
    getFeaturedBrands(),
    getLogoWallBrands()
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
  const consultationUrl = buildWhatsAppUrl(
    locale === "id"
      ? "Halo Authentic Perfumes 8, saya ingin berkonsultasi dan mencari parfum."
      : "Hello Authentic Perfumes 8, I would like fragrance consultation and brand request help."
  );
  const requestUrl = buildWhatsAppUrl(
    locale === "id"
      ? "Halo Authentic Perfumes 8, saya mencari parfum tertentu. Mohon bantu periksa stok, harga, dan opsi pemesanan."
      : "Hello Authentic Perfumes 8, I am looking for a specific fragrance. Please help check stock, price, and request options."
  );

  return (
    <main className="bg-paper">
      {primaryBanner ? (
        <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <CollectionTile
            banner={primaryBanner}
            priority
            dictionary={dictionary.tile}
            headingLevel={1}
            locale={locale}
            full
          />
        </section>
      ) : null}

      <TrustStrip dictionary={dictionary.trust} locale={locale} />

      <BrandMarquee brands={logoWallBrands} label={dictionary.home.featuredHouses} locale={locale} />

      <CompleteCollectionCta locale={locale} />

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow={dictionary.home.customerFavorites}
            title={dictionary.home.bestSellers}
            href={localizedPath(locale, "/best-sellers")}
            linkLabel={dictionary.home.discoverMore}
          />
          <ProductSlider products={bestSellers.slice(0, 12)} priority dictionary={dictionary} locale={locale} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow={dictionary.home.freshEdit}
            title={dictionary.home.newNoteworthy}
            href={localizedPath(locale, "/new-arrivals")}
            linkLabel={dictionary.home.discoverMore}
          />
          <ProductSlider products={newArrivals.slice(0, 12)} dictionary={dictionary} locale={locale} />
        </Reveal>
      </section>

      <section className="bg-warm/60 py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow={dictionary.home.fastDispatch}
              title={dictionary.home.readyStock}
              href={localizedPath(locale, "/shop?readyStock=true")}
              linkLabel={dictionary.home.discoverMore}
            />
            <ProductSlider products={readyStock.slice(0, 12)} dictionary={dictionary} locale={locale} />
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
                  ? "Konsultasi gratis untuk rekomendasi aroma, hadiah, dan pilihan personal."
                  : "Free consultation for scent recommendations, gifts, and personal choices."}
              </h2>
            </div>
            <a
              href={consultationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex justify-center border border-paper/25 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] transition duration-300 hover:border-paper hover:bg-paper hover:text-ink active:scale-[0.98]"
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
            href={localizedPath(locale, "/brands")}
            linkLabel={dictionary.common.allBrands}
          />
          <BrandCloud brands={featuredBrands} dictionary={dictionary.common} locale={locale} />
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
              className="inline-flex w-full justify-center bg-ink px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition duration-300 hover:bg-gold active:scale-[0.98] sm:w-auto"
            >
              {dictionary.home.requestViaWhatsApp}
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
