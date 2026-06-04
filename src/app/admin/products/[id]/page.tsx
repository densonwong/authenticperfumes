import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminBrands, getAdminProducts } from "@/lib/repositories/admin-cms";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const [{ id }, brands, products] = await Promise.all([params, getAdminBrands(), getAdminProducts()]);
  const product = products.find((item) => item.id === id || item.slug === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto max-w-5xl space-y-4">
        <div className="border border-stone/30 bg-white p-4">
          <Link href="/admin/products" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">
            Products
          </Link>
          <h1 className="mt-1 text-xl font-semibold">Edit {product.name}</h1>
        </div>
        <ProductForm brands={brands} product={product} />
      </section>
    </main>
  );
}
