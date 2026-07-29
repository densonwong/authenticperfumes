import Link from "next/link";
import { Plus } from "lucide-react";
import { ContentForm } from "@/components/admin/content-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProducts, getAdminTestimonials } from "@/lib/repositories/admin-cms";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function valueOf(searchParams: Awaited<SearchParams>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminTestimonialsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const [testimonials, products, resolvedSearchParams] = await Promise.all([
    getAdminTestimonials(),
    getAdminProducts(),
    searchParams
  ]);
  const selectedId = valueOf(resolvedSearchParams, "edit");
  const selectedTestimonial = selectedId
    ? testimonials.find((testimonial) => testimonial.id === selectedId) ?? null
    : null;

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between border border-stone/30 bg-white p-4">
            <div>
              <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</Link>
              <h1 className="mt-1 text-xl font-semibold">Testimonials</h1>
            </div>
            <Link href="/admin/testimonials" className="inline-flex h-9 items-center gap-2 border border-ink bg-ink px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-ink">
              <Plus className="h-4 w-4" />
              New
            </Link>
          </div>
          {testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <article key={testimonial.id} className="border border-stone/30 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold">{testimonial.customerName}</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-stone">{testimonial.productName}</p>
                  </div>
                  <Link href={`/admin/testimonials?edit=${testimonial.id}`} className="text-xs font-semibold uppercase tracking-[0.12em] underline underline-offset-4">
                    Edit
                  </Link>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/70">{testimonial.quote}</p>
              </article>
            ))
          ) : (
            <div className="border border-stone/30 bg-white p-4 text-sm text-stone">
              No testimonials in Supabase yet. Create the first customer review.
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="border border-stone/30 bg-white p-4">
            <h2 className="text-sm font-semibold">{selectedTestimonial ? "Edit testimonial" : "New testimonial"}</h2>
          </div>
          <ContentForm
            key={selectedTestimonial?.id ?? "new"}
            type="testimonial"
            item={selectedTestimonial}
            products={products}
          />
        </div>
      </section>
    </main>
  );
}
