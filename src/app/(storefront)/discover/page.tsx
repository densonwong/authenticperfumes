import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getDiscoverPosts } from "@/lib/repositories/catalog";

export const metadata: Metadata = {
  title: "Discover",
  description: "Fragrance guides, reviews, glossary notes, and consultation articles."
};

export default async function DiscoverPage() {
  const posts = await getDiscoverPosts();
  const categories = [...new Set(posts.map((post) => post.category))];

  return (
    <main className="bg-paper">
      <section className="border-b border-ink/10 px-4 py-8 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              Discover
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">Fragrance notes</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
              Practical guides and product notes for choosing perfume with less guesswork.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category}`}
                className="border border-ink/10 bg-warm/45 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink hover:border-gold hover:text-gold"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post.id}
              id={post.category}
              className={index === 0 ? "bg-paper md:col-span-2" : "bg-paper"}
            >
              <Link
                href={`/discover/${post.slug}`}
                className={`grid gap-5 p-4 transition hover:bg-white sm:p-5 ${
                  index === 0 ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-end" : ""
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-warm">
                  <Image
                    src={post.imageUrl}
                    alt=""
                    fill
                    sizes={index === 0 ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                    {post.category}
                  </p>
                  <h2 className="mt-3 font-serif text-2xl leading-tight text-ink sm:text-3xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-ink/65">{post.excerpt}</p>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                    Read article
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
