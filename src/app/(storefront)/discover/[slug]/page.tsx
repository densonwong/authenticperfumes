import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDiscoverPostBySlug, getDiscoverPosts } from "@/lib/repositories/catalog";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = await getDiscoverPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getDiscoverPostBySlug(slug);

  return {
    title: post ? post.title : "Discover",
    description: post?.excerpt,
    openGraph: post
      ? {
          title: post.title,
          description: post.excerpt,
          images: [post.imageUrl]
        }
      : undefined
  };
}

export default async function DiscoverDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getDiscoverPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="bg-paper">
      <article className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Link
          href="/discover"
          className="text-xs font-semibold uppercase tracking-[0.16em] text-gold"
        >
          Discover
        </Link>
        <header className="mt-4 border-b border-ink/10 pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
            {post.category} / {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(post.publishedAt))}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">{post.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/68">{post.excerpt}</p>
        </header>
        <div className="relative mt-6 aspect-[16/9] overflow-hidden border border-ink/10 bg-warm">
          <Image
            src={post.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="mt-8 max-w-3xl text-base leading-8 text-ink/75">
          <p>{post.body}</p>
          <p className="mt-5">
            For a more precise shortlist, share your favorite notes, current bottle, climate,
            occasion, and budget through consultation. We will match the direction against current
            ready stock and pre-order availability.
          </p>
        </div>
      </article>
    </main>
  );
}
