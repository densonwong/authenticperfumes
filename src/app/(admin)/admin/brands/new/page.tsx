import Link from "next/link";
import { BrandForm } from "@/components/admin/brand-form";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewBrandPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto max-w-4xl space-y-4">
        <div className="border border-stone/30 bg-white p-4">
          <Link href="/admin/brands" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Brands</Link>
          <h1 className="mt-1 text-xl font-semibold">New brand</h1>
        </div>
        <BrandForm />
      </section>
    </main>
  );
}
