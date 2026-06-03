import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Authentic Perfumes is a boutique catalog for verified authentic fragrances in Indonesia."
};

const values = [
  {
    title: "Verified sourcing",
    body: "We source through trusted channels and inspect bottles before dispatch."
  },
  {
    title: "Curated catalog",
    body: "The selection favors wearable niche signatures, customer favorites, and requested houses."
  },
  {
    title: "Concierge support",
    body: "WhatsApp guidance covers stock checks, blind-buy risk, pre-order timelines, and similar scents."
  }
];

export default function AboutPage() {
  return (
    <main className="bg-paper">
      <section className="border-b border-ink/10 px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            About Authentic Perfumes
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-ink">
            Boutique perfume buying with proof, context, and less noise.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-ink/68">
            Authentic Perfumes helps Indonesian fragrance buyers discover original bottles across
            niche, designer, and hard-to-source houses. The experience is catalog-first: clear
            status, realistic pricing, and direct consultation when a bottle needs more context.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3 lg:px-8">
        {values.map((value) => (
          <article key={value.title} className="border border-ink/10 bg-warm/45 p-5">
            <h2 className="font-serif text-2xl text-ink">{value.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/68">{value.body}</p>
          </article>
        ))}
      </section>

      <section className="border-t border-ink/10 px-4 py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-serif text-3xl text-ink">Looking for something specific?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
              Send the house, perfume name, size, and budget. We will confirm whether it is ready
              stock, pre-order, or better handled as a similar-fragrance request.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex border border-ink bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}
