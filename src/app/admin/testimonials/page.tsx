import { ContentForm } from "@/components/admin/content-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getTestimonials } from "@/lib/repositories/catalog";

export default async function AdminTestimonialsPage() {
  await requireAdmin();
  const testimonials = await getTestimonials();

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <div className="border border-stone/30 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</p>
            <h1 className="mt-1 text-xl font-semibold">Testimonials</h1>
          </div>
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className="border border-stone/30 bg-white p-4">
              <h2 className="text-sm font-semibold">{testimonial.customerName}</h2>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-stone">{testimonial.productName}</p>
              <p className="mt-3 text-sm leading-6 text-ink/70">{testimonial.quote}</p>
            </article>
          ))}
        </div>
        <div className="space-y-3">
          <div className="border border-stone/30 bg-white p-4">
            <h2 className="text-sm font-semibold">Edit preview</h2>
          </div>
          <ContentForm type="testimonial" item={testimonials[0]} />
        </div>
      </section>
    </main>
  );
}
