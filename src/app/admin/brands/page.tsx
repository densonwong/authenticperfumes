import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getBrands } from "@/lib/repositories/catalog";

export default async function AdminBrandsPage() {
  await requireAdmin();
  const brands = await getBrands();

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <div className="flex items-center justify-between border border-stone/30 bg-white p-4">
          <div>
            <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</Link>
            <h1 className="mt-1 text-xl font-semibold">Brands</h1>
          </div>
          <Link href="/admin/brands/new" className="inline-flex h-9 items-center gap-2 border border-ink bg-ink px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-ink">
            <Plus className="h-4 w-4" />
            New
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand) => (
            <article key={brand.id} className="border border-stone/30 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">{brand.name}</h2>
                  <p className="mt-1 text-xs text-stone">{brand.country} / {brand.productCount} products</p>
                </div>
                <Link
                  href={`/admin/brands/${brand.id}`}
                  className="text-xs font-semibold uppercase tracking-[0.12em] underline underline-offset-4"
                >
                  Update
                </Link>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/70">{brand.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
