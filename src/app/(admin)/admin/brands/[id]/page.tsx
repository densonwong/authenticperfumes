import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandForm } from "@/components/admin/brand-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminBrands } from "@/lib/repositories/admin-cms";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const [{ id }, brands] = await Promise.all([params, getAdminBrands()]);
  const brand = brands.find((item) => item.id === id || item.slug === id);

  if (!brand) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto max-w-4xl space-y-4">
        <div className="border border-stone/30 bg-white p-4">
          <Link href="/admin/brands" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Brands</Link>
          <h1 className="mt-1 text-xl font-semibold">Edit {brand.name}</h1>
        </div>
        <BrandForm brand={brand} />
      </section>
    </main>
  );
}
