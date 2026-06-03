import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/storefront/product-card";
import { getBrandBySlug, getBrands, getProducts } from "@/lib/repositories/catalog";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  return {
    title: brand ? brand.name : "Brand",
    description: brand?.description
  };
}

export default async function BrandDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [brand, products] = await Promise.all([getBrandBySlug(slug), getProducts()]);

  if (!brand) notFound();

  const brandProducts = products.filter((product) => product.brandId === brand.id);

  return (
    <main className="bg-paper">
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
              All brands
            </Link>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">{brand.name}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/68">{brand.description}</p>
            <dl className="mt-6 grid gap-4 border-t border-ink/10 pt-5 sm:grid-cols-3">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                  Country
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{brand.country}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                  Founded
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{brand.foundedYear ?? "N/A"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                  Listed
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{brandProducts.length} bottles</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-5 border-b border-ink/10 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Current edit
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">{brand.name} at Authentic Perfumes</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {brandProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </section>
    </main>
  );
}
