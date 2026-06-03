import Image from "next/image";
import type { Metadata } from "next";
import { getTestimonials } from "@/lib/repositories/catalog";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Customer reviews and purchase experiences from Authentic Perfumes buyers."
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <main className="bg-paper">
      <section className="border-b border-ink/10 px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Testimonials
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">
            Real customer experiences
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
            Notes from customers who trusted Authentic Perfumes for original niche and designer
            fragrances, from consultation to delivery.
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
    </main>
  );
}
