import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductListManager } from "@/components/admin/product-list-manager";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProducts } from "@/lib/repositories/admin-cms";
import type { AdminProductListItem } from "@/lib/admin-product-bulk";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAdminProducts();
  const items: AdminProductListItem[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    brandName: product.brandName,
    status: product.status,
    readyStock: product.readyStock,
    preOrder: product.preOrder,
    stock: product.variants.reduce((total, variant) => total + variant.stock, 0),
    fromPrice: product.variants[0]?.authenticPrice ?? 0
  }));

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <div className="flex items-center justify-between border border-stone/30 bg-white p-4">
          <div>
            <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">
              Admin
            </Link>
            <h1 className="mt-1 text-xl font-semibold">Products</h1>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex h-9 items-center gap-2 border border-ink bg-ink px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-ink"
          >
            <Plus className="h-4 w-4" />
            New
          </Link>
        </div>
        <ProductListManager initialProducts={items} />
      </section>
    </main>
  );
}
