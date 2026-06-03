import Image from "next/image";
import Link from "next/link";
import type { DiscoverPost } from "@/lib/types";

export function DiscoverPreview({ posts }: { posts: DiscoverPost[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {posts.map((post) => (
        <article key={post.id} className="border border-ink/10 bg-paper">
          <Link href={`/discover/${post.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-gold/60">
            <div className="relative aspect-[4/3] overflow-hidden bg-warm">
              <Image
                src={post.imageUrl}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-4 sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                {post.category}
              </p>
              <h3 className="mt-3 line-clamp-2 font-serif text-xl leading-tight text-ink">
                {post.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/65">{post.excerpt}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                Read guide
              </p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
