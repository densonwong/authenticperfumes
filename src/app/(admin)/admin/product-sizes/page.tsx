import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProducts } from "@/lib/repositories/admin-cms";
import { VariantListManager } from "@/components/admin/variant-list-manager";

export default async function ProductSizesPage() {
  await requireAdmin();
  const products = await getAdminProducts();
  const variants = products.flatMap(product => product.variants.map(variant => ({
    id: variant.id, productId: product.id, name: product.name, brandName: product.brandName,
    size: variant.size, stock: variant.stock, status: variant.status
  })));
  return <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
    <section className="mx-auto max-w-7xl space-y-4">
      <div className="border bg-white p-4"><h1 className="text-xl font-semibold">Ukuran Produk</h1>
        <p className="mt-2 text-sm text-stone">Kelola ukuran lintas merek. Menghapus ukuran tidak menghapus produk utamanya.</p></div>
      <VariantListManager initialVariants={variants} />
    </section>
  </main>;
}
