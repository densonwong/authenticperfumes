import Image from "next/image";
import Link from "next/link";
import { Heart, Mail, Search, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { calculateSavings, formatRupiah } from "@/lib/format";
import { getProductBySlug, getProducts } from "@/lib/repositories/catalog";
import type { ProductStatus, ProductVariant } from "@/lib/types";
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const statusLabels: Record<ProductStatus, string> = {
  ready_stock: "Ready stock",
  pre_order: "Pre order",
  limited_stock: "Limited stock",
  out_of_stock: "Out of stock"
};

const schemaAvailability: Record<ProductStatus, string> = {
  ready_stock: "https://schema.org/InStock",
  limited_stock: "https://schema.org/LimitedAvailability",
  pre_order: "https://schema.org/PreOrder",
  out_of_stock: "https://schema.org/OutOfStock"
};

function valueOf(searchParams: Awaited<SearchParams>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function selectedVariant(variants: ProductVariant[], variantId?: string) {
  return variants.find((variant) => variant.id === variantId) ?? variants[0];
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product ? `${product.brandName} ${product.name}` : "Product",
    description: product?.description,
    openGraph: product
      ? {
          title: `${product.brandName} ${product.name}`,
          description: product.description,
          images: [product.imageUrl]
        }
      : undefined
  };
}

export default async function ProductDetailPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const variant = selectedVariant(product.variants, valueOf(resolvedSearchParams, "variant"));
  const savings = calculateSavings(variant.retailPrice, variant.authenticPrice);
  const savingsPercent = Math.round((savings / variant.retailPrice) * 100);
  const canonicalUrl = `https://authenticperfumes.id/products/${product.slug}`;
  const whatsappUrl = buildWhatsAppUrl(
    buildProductWhatsAppMessage(`${product.brandName} ${product.name}`, canonicalUrl, variant.size)
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brandName} ${product.name}`,
    image: product.galleryUrls,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brandName
    },
    offers: product.variants.map((item) => ({
      "@type": "Offer",
      priceCurrency: "IDR",
      price: item.authenticPrice,
      availability: schemaAvailability[item.status],
      itemCondition: "https://schema.org/NewCondition",
      url: `${canonicalUrl}?variant=${item.id}`
    }))
  };

  return (
    <main className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="grid gap-3 lg:grid-cols-[92px_1fr]">
          <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:block lg:space-y-3">
            {product.galleryUrls.map((url, index) => (
              <a
                key={url}
                href={`#gallery-${index}`}
                className="relative block h-20 w-20 shrink-0 overflow-hidden border border-ink/10 bg-warm lg:h-24 lg:w-full"
                aria-label={`View image ${index + 1}`}
              >
                <Image src={url} alt="" fill sizes="92px" className="object-cover" />
              </a>
            ))}
          </div>
          <div className="order-1 space-y-3 lg:order-2">
            {product.galleryUrls.map((url, index) => (
              <div
                key={url}
                id={`gallery-${index}`}
                className="relative aspect-[4/5] overflow-hidden border border-ink/10 bg-warm"
              >
                <Image
                  src={url}
                  alt={`${product.brandName} ${product.name} bottle ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {product.brandName}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">{product.name}</h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/55">
            {product.concentration} / {product.gender}
          </p>
          <p className="mt-5 text-sm leading-7 text-ink/70">{product.description}</p>

          <div className="mt-6 border-y border-ink/10 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
              Selected size
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {product.variants.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${product.slug}?variant=${item.id}`}
                  className={`border px-3 py-3 text-left transition ${
                    item.id === variant.id
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/10 bg-warm/45 text-ink hover:border-ink/35"
                  }`}
                >
                  <span className="block text-sm font-semibold">{item.size}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.12em] opacity-70">
                    {statusLabels[item.status]} / stock {item.stock}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-b border-ink/10 pb-5 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                Retail
              </p>
              <p className="mt-1 text-sm text-ink/55 line-through">{formatRupiah(variant.retailPrice)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                Authentic
              </p>
              <p className="mt-1 text-lg font-semibold text-ink">{formatRupiah(variant.authenticPrice)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                Savings
              </p>
              <p className="mt-1 text-sm font-semibold text-gold">
                {formatRupiah(savings)} ({savingsPercent}%)
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-none border border-ink/10 bg-warm/45 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink">Status</p>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                {statusLabels[variant.status]}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Final stock and dispatch timing are confirmed before payment through WhatsApp.
            </p>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 border border-ink bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-paper transition hover:bg-paper hover:text-ink"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Add to cart
            </button>
            <a
              href={whatsappUrl}
              className="inline-flex items-center justify-center border border-gold bg-gold px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-paper transition hover:bg-paper hover:text-ink"
            >
              Buy via WhatsApp
            </a>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 border border-ink/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-ink"
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              Wishlist
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 border border-ink/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-ink"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Notify me
            </button>
          </div>

          <button
            type="button"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 border border-ink/15 bg-warm/45 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-ink"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Request similar fragrance
          </button>

          <dl className="mt-7 grid gap-4 border-t border-ink/10 pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">Origin</dt>
              <dd className="mt-1 text-ink">{product.countryOfOrigin}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">Notes</dt>
              <dd className="mt-1 text-ink">{product.notes.join(", ")}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">SKU</dt>
              <dd className="mt-1 text-ink">{product.id}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">Fulfillment</dt>
              <dd className="mt-1 text-ink">{product.preOrder ? "Pre order available" : "Ready stock focused"}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
