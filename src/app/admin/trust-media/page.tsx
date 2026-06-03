import { ContentForm } from "@/components/admin/content-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getTrustMedia } from "@/lib/repositories/catalog";

export default async function AdminTrustMediaPage() {
  await requireAdmin();
  const media = await getTrustMedia();

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <div className="border border-stone/30 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</p>
            <h1 className="mt-1 text-xl font-semibold">Trust media</h1>
          </div>
          {media.map((item) => (
            <article key={item.id} className="border border-stone/30 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">{item.title}</h2>
                <span className="text-xs uppercase tracking-[0.12em] text-stone">{item.mediaType}</span>
              </div>
              <p className="mt-2 text-sm text-ink/70">{item.category.replaceAll("_", " ")}</p>
              <p className="mt-2 truncate text-xs text-stone">{item.mediaUrl}</p>
            </article>
          ))}
        </div>
        <div className="space-y-3">
          <div className="border border-stone/30 bg-white p-4">
            <h2 className="text-sm font-semibold">Edit preview</h2>
          </div>
          <ContentForm type="trust-media" item={media[0]} />
        </div>
      </section>
    </main>
  );
}
