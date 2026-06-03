import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { formatRupiah } from "@/lib/format";
import { getProducts } from "@/lib/repositories/catalog";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getProducts();

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
        <div className="overflow-x-auto border border-stone/30 bg-white">
          <table className="min-w-full divide-y divide-stone/20 text-sm">
            <thead className="bg-warm/70 text-left text-xs font-semibold uppercase tracking-[0.12em] text-stone">
              <tr>
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">Brand</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Stock</th>
                <th className="px-3 py-3">From</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/20">
              {products.map((product) => (
                <tr key={product.id} className="align-top">
                  <td className="px-3 py-3 font-semibold">{product.name}</td>
                  <td className="px-3 py-3 text-stone">{product.brandName}</td>
                  <td className="px-3 py-3">{product.status.replaceAll("_", " ")}</td>
                  <td className="px-3 py-3">{product.variants.reduce((total, variant) => total + variant.stock, 0)}</td>
                  <td className="px-3 py-3">{formatRupiah(product.variants[0]?.authenticPrice ?? 0)}</td>
                  <td className="px-3 py-3">
                    <Link href={`/admin/products/${product.id}`} className="font-semibold text-ink underline underline-offset-4">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
