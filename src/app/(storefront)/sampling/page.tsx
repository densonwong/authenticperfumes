import type { Metadata } from "next";
import Link from "next/link";
import { ProductRow } from "@/components/storefront/product-row";
import { RequestFragranceForm } from "@/components/storefront/request-fragrance-form";
import { getBestSellers, getNewArrivals } from "@/lib/repositories/catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Sampling",
  description: "Request fragrance samples and discovery guidance before buying a full bottle."
};

const steps = [
  "Tell us the scents you like, dislike, and where you plan to wear them.",
  "We shortlist available decants or full-bottle options from the current catalog.",
  "You test on skin, then request a full bottle, pre-order, or similar direction."
];

export default async function SamplingPage() {
  const [newArrivals, bestSellers] = await Promise.all([getNewArrivals(), getBestSellers()]);
  const products = [...newArrivals, ...bestSellers].slice(0, 6);

  return (
    <main className="bg-paper">
      <section className="border-b border-ink/10 px-4 py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              Discovery/Sampling
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">
              Try the direction before the bottle
            </h1>
            <p className="mt-4 text-sm leading-7 text-ink/68">
              Sampling keeps niche fragrance buying practical. Use it to compare projection,
              sweetness, and weather fit before committing to a sealed bottle.
            </p>
            <a
              href={buildWhatsAppUrl("Halo Authentic Perfumes, saya ingin konsultasi sampling parfum.")}
              className="mt-6 inline-flex border border-ink bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink"
            >
              Ask for samples
            </a>
          </div>
          <div className="border border-ink/10 bg-warm/45 p-5">
            <h2 className="font-serif text-2xl text-ink">How it works</h2>
            <ol className="mt-5 grid gap-3">
              {steps.map((step, index) => (
                <li key={step} className="grid grid-cols-[36px_1fr] gap-3 text-sm leading-6 text-ink/70">
                  <span className="flex h-8 w-8 items-center justify-center border border-ink/15 text-xs font-semibold text-ink">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="mb-5 border-b border-ink/10 pb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Good starting points
              </p>
              <h2 className="mt-2 font-serif text-3xl text-ink">Compare these first</h2>
            </div>
            <div className="border border-ink/10 bg-paper px-4 sm:px-6">
              {products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </div>
            <Link
              href="/shop"
              className="mt-6 inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-ink hover:text-gold"
            >
              Browse full catalog
            </Link>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <RequestFragranceForm defaultValues={{ size: "Sample" }} />
          </div>
        </div>
      </section>
    </main>
  );
}
