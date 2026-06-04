import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminBrands } from "@/lib/repositories/admin-cms";

export default async function NewProductPage() {
  await requireAdmin();
  const brands = await getAdminBrands();

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto max-w-5xl space-y-4">
        <div className="border border-stone/30 bg-white p-4">
          <Link href="/admin/products" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">
            Products
          </Link>
          <h1 className="mt-1 text-xl font-semibold">New product</h1>
        </div>
        <ProductForm brands={brands} />
      </section>
    </main>
  );
}
