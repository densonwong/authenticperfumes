import { ContentForm } from "@/components/admin/content-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getBanners } from "@/lib/repositories/catalog";

export default async function AdminBannersPage() {
  await requireAdmin();
  const banners = await getBanners();

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <div className="border border-stone/30 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</p>
            <h1 className="mt-1 text-xl font-semibold">Banners</h1>
          </div>
          {banners.map((banner) => (
            <article key={banner.id} className="border border-stone/30 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">{banner.title}</h2>
                <span className="text-xs uppercase tracking-[0.12em] text-stone">{banner.position}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink/70">{banner.subtitle}</p>
              <p className="mt-2 truncate text-xs text-stone">{banner.href}</p>
            </article>
          ))}
        </div>
        <div className="space-y-3">
          <div className="border border-stone/30 bg-white p-4">
            <h2 className="text-sm font-semibold">Edit preview</h2>
          </div>
          <ContentForm type="banner" item={banners[0]} />
        </div>
      </section>
    </main>
  );
}
