import { ContentForm } from "@/components/admin/content-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getDiscoverPosts } from "@/lib/repositories/catalog";

export default async function AdminDiscoverPage() {
  await requireAdmin();
  const posts = await getDiscoverPosts();

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <div className="border border-stone/30 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</p>
            <h1 className="mt-1 text-xl font-semibold">Discover</h1>
          </div>
          {posts.map((post) => (
            <article key={post.id} className="border border-stone/30 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">{post.title}</h2>
                <span className="text-xs uppercase tracking-[0.12em] text-stone">{post.category}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink/70">{post.excerpt}</p>
              <p className="mt-2 text-xs text-stone">{new Date(post.publishedAt).toLocaleDateString("id-ID")}</p>
            </article>
          ))}
        </div>
        <div className="space-y-3">
          <div className="border border-stone/30 bg-white p-4">
            <h2 className="text-sm font-semibold">Edit preview</h2>
          </div>
          <ContentForm type="discover" item={posts[0]} />
        </div>
      </section>
    </main>
  );
}
