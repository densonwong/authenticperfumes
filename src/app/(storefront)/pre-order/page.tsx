import type { Metadata } from "next";
import { ProductCard } from "@/components/storefront/product-card";
import { getPreOrderProducts } from "@/lib/repositories/catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Pre Order",
  description: "Understand Authentic Perfumes pre-order process, sourcing updates, and refund policy."
};

const process = [
  "Share the fragrance, size, target budget, and preferred timeline through WhatsApp.",
  "We confirm sourcing availability, estimated landed price, ETA, and payment terms before ordering.",
  "After confirmation, the bottle is purchased through trusted channels and progress updates are sent.",
  "Arrival photos, authenticity checks, and shipping details are shared before final dispatch."
];

const refundPolicy = [
  "If we cannot source or verify the promised bottle, your paid amount is refunded.",
  "If supplier pricing changes before payment confirmation, you can approve the new quote or cancel.",
  "Refunds do not apply after a confirmed special order is successfully sourced as agreed, unless the item cannot be fulfilled or verified."
];

export default async function PreOrderPage() {
  const products = await getPreOrderProducts();

  return (
    <main className="bg-paper">
      <section className="border-b border-ink/10 px-4 py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              Concierge sourcing
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">
              Pre-order with clear checkpoints
            </h1>
            <p className="mt-4 text-sm leading-7 text-ink/68">
              Pre-order is for bottles that are not currently ready stock. We confirm availability,
              price, ETA, and authenticity expectations before you commit.
            </p>
            <a
              href={buildWhatsAppUrl("Halo Authentic Perfumes, saya ingin menanyakan pre-order parfum.")}
              className="mt-6 inline-flex border border-ink bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink"
            >
              Start pre-order
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <section className="border border-ink/10 bg-warm/45 p-5">
              <h2 className="font-serif text-2xl text-ink">Process</h2>
              <ol className="mt-4 space-y-3">
                {process.map((item, index) => (
                  <li key={item} className="text-sm leading-6 text-ink/70">
                    <span className="font-semibold text-ink">{index + 1}. </span>
                    {item}
                  </li>
                ))}
              </ol>
            </section>
            <section className="border border-ink/10 bg-paper p-5">
              <h2 className="font-serif text-2xl text-ink">Refund policy</h2>
              <ul className="mt-4 space-y-3">
                {refundPolicy.map((item) => (
                  <li key={item} className="text-sm leading-6 text-ink/70">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-5 border-b border-ink/10 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Available to request
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">Current pre-order list</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </section>
    </main>
  );
}
