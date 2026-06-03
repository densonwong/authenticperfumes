import Image from "next/image";
import type { Metadata } from "next";
import { getTestimonials, getTrustMedia } from "@/lib/repositories/catalog";

export const metadata: Metadata = {
  title: "Trust Center",
  description: "Authentic Perfumes testimonials, packing proof, shipping proof, and customer trust media."
};

const categoryLabels: Record<string, string> = {
  packing_video: "Packing videos",
  shipping_proof: "Shipping proof",
  chat_review: "Chat reviews",
  story_repost: "Story reposts",
  unboxing: "Unboxing",
  repeat_customer: "Repeat customers"
};

export default async function TestimonialsPage() {
  const [testimonials, trustMedia] = await Promise.all([getTestimonials(), getTrustMedia()]);

  return (
    <main className="bg-paper">
      <section className="border-b border-ink/10 px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Trust Center
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">Proof before purchase</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
            Customer feedback, packing proof, shipping records, unboxings, and repeat purchase
            signals are grouped so shoppers can inspect trust evidence quickly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.id} className="border border-ink/10 bg-warm/45 p-5">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden bg-clay">
                  <Image
                    src={testimonial.imageUrl}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{testimonial.customerName}</p>
                  <p className="text-xs text-ink/55">{testimonial.productName}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-ink/70">"{testimonial.quote}"</p>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-warm/55 px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 border-b border-ink/10 pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              Evidence categories
            </p>
            <h2 className="mt-2 font-serif text-3xl text-ink">Trust media library</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustMedia.map((item) => (
              <article key={item.id} className="border border-ink/10 bg-paper">
                <div className="relative aspect-[4/3] overflow-hidden bg-clay">
                  <Image
                    src={item.mediaUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper">
                    {item.mediaType}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                    {categoryLabels[item.category]}
                  </p>
                  <h3 className="mt-2 text-sm font-semibold text-ink">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
