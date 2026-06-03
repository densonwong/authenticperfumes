import Link from "next/link";
import { Plus } from "lucide-react";
import { ContentForm } from "@/components/admin/content-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminBanners } from "@/lib/repositories/admin-cms";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function valueOf(searchParams: Awaited<SearchParams>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminBannersPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const [banners, resolvedSearchParams] = await Promise.all([getAdminBanners(), searchParams]);
  const selectedId = valueOf(resolvedSearchParams, "edit");
  const selectedBanner = selectedId
    ? banners.find((banner) => banner.id === selectedId) ?? null
    : null;

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between border border-stone/30 bg-white p-4">
            <div>
              <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</Link>
              <h1 className="mt-1 text-xl font-semibold">Banners</h1>
            </div>
            <Link href="/admin/banners" className="inline-flex h-9 items-center gap-2 border border-ink bg-ink px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-ink">
              <Plus className="h-4 w-4" />
              New
            </Link>
          </div>
          {banners.length > 0 ? (
            banners.map((banner) => (
              <article key={banner.id} className="border border-stone/30 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold">{banner.title}</h2>
                  <span className="text-xs uppercase tracking-[0.12em] text-stone">{banner.position}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/70">{banner.subtitle}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="truncate text-xs text-stone">{banner.href}</p>
                  <Link href={`/admin/banners?edit=${banner.id}`} className="text-xs font-semibold uppercase tracking-[0.12em] underline underline-offset-4">
                    Edit
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="border border-stone/30 bg-white p-4 text-sm text-stone">
              No banners in Supabase yet. Create the first homepage banner.
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="border border-stone/30 bg-white p-4">
            <h2 className="text-sm font-semibold">{selectedBanner ? "Edit banner" : "New banner"}</h2>
          </div>
          <ContentForm key={selectedBanner?.id ?? "new"} type="banner" item={selectedBanner} />
        </div>
      </section>
    </main>
  );
}
