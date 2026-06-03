import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/lib/types";

export function CollectionTile({ banner, priority = false }: { banner: Banner; priority?: boolean }) {
  return (
    <Link
      href={banner.href}
      className="group relative flex min-h-[260px] overflow-hidden border border-ink/10 bg-ink text-paper focus:outline-none focus:ring-2 focus:ring-gold/70 sm:min-h-[320px]"
    >
      <Image
        src={banner.imageUrl}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover opacity-70 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-80"
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
      <div className="relative mt-auto max-w-xl p-5 sm:p-7">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/75">
          Featured edit
        </p>
        <h2 className="font-serif text-2xl leading-tight sm:text-3xl">{banner.title}</h2>
        <p className="mt-3 text-sm leading-6 text-paper/80">{banner.subtitle}</p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-paper">
          Shop collection
        </p>
      </div>
    </Link>
  );
}
