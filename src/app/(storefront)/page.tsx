import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { BrandCloud } from "@/components/storefront/brand-cloud";
import { CollectionTile } from "@/components/storefront/collection-tile";
import { DiscoverPreview } from "@/components/storefront/discover-preview";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductRow } from "@/components/storefront/product-row";
import { TrustStrip } from "@/components/storefront/trust-strip";
import {
  getBanners,
  getBestSellers,
  getDiscoverPosts,
  getFeaturedBrands,
  getNewArrivals,
  getPreOrderProducts,
  getReadyStockProducts,
  getTestimonials,
  getTrustMedia
} from "@/lib/repositories/catalog";
import type { Product } from "@/lib/types";

function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "View all"
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
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

function ProductGrid({ products, priority = false }: { products: Product[]; priority?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={priority && index < 2} />
      ))}
    </div>
  );
}

export default async function HomePage() {
  const [
    banners,
    newArrivals,
    bestSellers,
    readyStock,
    preOrders,
    featuredBrands,
    testimonials,
    trustMedia,
    discoverPosts
  ] = await Promise.all([
    getBanners(),
    getNewArrivals(),
    getBestSellers(),
    getReadyStockProducts(),
    getPreOrderProducts(),
    getFeaturedBrands(),
    getTestimonials(),
    getTrustMedia(),
    getDiscoverPosts()
  ]);

  const normalizedBanners = banners.map((banner) => {
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
  const trustPreview = trustMedia.slice(0, 3);
  const testimonialPreview = testimonials.slice(0, 2);

  return (
    <main className="bg-paper">
      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {primaryBanner ? <CollectionTile banner={primaryBanner} priority /> : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {secondaryBanners.map((banner) => (
              <CollectionTile key={banner.id} banner={banner} />
            ))}
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader eyebrow="Fresh edit" title="New and Noteworthy" href="/new-arrivals" />
          <ProductGrid products={newArrivals.slice(0, 4)} priority />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader eyebrow="Customer favorites" title="Best Sellers" href="/best-sellers" />
          <ProductGrid products={bestSellers.slice(0, 4)} />
        </Reveal>
      </section>

      <section className="bg-warm/60 py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Fast dispatch"
              title="Ready Stock"
              href="/shop?readyStock=true"
            />
            <ProductGrid products={readyStock.slice(0, 4)} />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader eyebrow="Concierge sourcing" title="Pre Order Picks" href="/pre-order" />
          <ProductGrid products={preOrders.slice(0, 4)} />
        </Reveal>
      </section>

      <section className="bg-ink py-10 text-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <Reveal>
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Discovery/Sampling
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight">Test the story before the bottle</h2>
              <p className="mt-4 text-sm leading-6 text-paper/70">
                Build a short list from new arrivals and customer favorites, then ask for decants,
                wearing advice, and climate notes before committing to a full presentation.
              </p>
              <Link
                href="/sampling"
                className="mt-6 inline-flex border border-paper/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition hover:border-paper hover:bg-paper hover:text-ink"
              >
                Start sampling
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="bg-paper px-4 text-ink sm:px-6">
              {samplingProducts.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Discover"
            title="Fragrance education"
            href="/discover"
            linkLabel="Read more"
          />
          <DiscoverPreview posts={discoverPosts.slice(0, 3)} />
        </Reveal>
      </section>

      <section className="bg-warm/60 py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Trust Center"
              title="Proof before purchase"
              href="/testimonials"
              linkLabel="See proof"
            />
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="grid gap-4 sm:grid-cols-3">
                {trustPreview.map((item) => (
                  <article key={item.id} className="border border-ink/10 bg-paper">
                    <div className="relative aspect-square overflow-hidden bg-clay">
                      <Image
                        src={item.mediaUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 20vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                        {item.category.replaceAll("_", " ")}
                      </p>
                      <h3 className="mt-2 text-sm font-semibold text-ink">{item.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
              <div className="grid gap-4">
                {testimonialPreview.map((testimonial) => (
                  <blockquote key={testimonial.id} className="border border-ink/10 bg-paper p-5">
                    <p className="text-sm leading-6 text-ink/75">"{testimonial.quote}"</p>
                    <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink">
                      {testimonial.customerName} / {testimonial.productName}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Brand universe"
            title="Explore featured houses"
            href="/brands"
            linkLabel="All brands"
          />
          <BrandCloud brands={featuredBrands} />
        </Reveal>
      </section>

      <section className="border-t border-ink/10 bg-paper px-4 py-12 lg:px-8">
        <Reveal>
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Request fragrance
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">
                Looking for a bottle not listed yet?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
                Share the house, size, and preferred timeline. We will confirm availability,
                estimated landed price, and ordering options through WhatsApp.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex w-full justify-center bg-ink px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-gold sm:w-auto"
            >
              Request via WhatsApp
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
