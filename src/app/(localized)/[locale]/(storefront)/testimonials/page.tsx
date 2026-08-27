import type { Metadata } from "next";
import { TestimonialGrid } from "@/components/storefront/testimonial-grid";
import { getDictionary, normalizeLocale } from "@/lib/i18n";
import { getTestimonials } from "@/lib/repositories/catalog";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = normalizeLocale((await params).locale);
  return localizedPageMetadata(locale, "/testimonials", {
    title: "Testimonials",
    description: "Customer reviews and purchase experiences from Authentic Perfumes 8 buyers."
  });
}

export const dynamic = "force-static";

export default async function TestimonialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = normalizeLocale((await params).locale);
  const dictionary = getDictionary(locale);
  const testimonials = await getTestimonials();
  const isId = locale === "id";

  return (
    <main className="bg-paper">
      <section className="border-b border-ink/10 px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {dictionary.nav.testimonials}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">
            {isId ? "Pengalaman customer nyata" : "Real customer experiences"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
            {isId
              ? "Catatan dari customer yang mempercayai Authentic Perfumes 8 untuk parfum niche dan designer original, dari konsultasi sampai pengiriman."
              : "Notes from customers who trusted Authentic Perfumes 8 for original niche and designer fragrances, from consultation to delivery."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <TestimonialGrid testimonials={testimonials} locale={locale} />
      </section>
    </main>
  );
}
