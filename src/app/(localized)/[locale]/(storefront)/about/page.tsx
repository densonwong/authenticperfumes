import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, normalizeLocale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = normalizeLocale((await params).locale);
  return localizedPageMetadata(locale, "/about", locale === "id"
    ? {
        title: "Tentang Kami",
        description: "Kenali Authentic Perfumes 8, katalog parfum asli pilihan untuk pelanggan di Indonesia."
      }
    : {
        title: "About",
        description: "Authentic Perfumes 8 is a boutique catalog for verified authentic fragrances in Indonesia."
      });
}

const values = [
  {
    title: "Verified sourcing",
    body: "We source through trusted channels and inspect bottles before dispatch."
  },
  {
    title: "Curated catalog",
    body: "The selection favors wearable niche signatures, customer favorites, and requested houses."
  },
  {
    title: "Concierge support",
    body: "WhatsApp guidance covers stock checks, blind-buy risk, pre-order timelines, and similar scents."
  }
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = normalizeLocale((await params).locale);
  const dictionary = getDictionary(locale);
  const isId = locale === "id";
  const localizedValues = isId
    ? [
        ["Pengadaan terverifikasi", "Kami memperoleh produk melalui jalur tepercaya dan memeriksa setiap botol sebelum dikirim."],
        ["Katalog pilihan", "Koleksi kami berfokus pada aroma niche yang nyaman dikenakan, favorit pelanggan, dan merek yang banyak dicari."],
        ["Bantuan personal", "Konsultasi melalui WhatsApp mencakup pemeriksaan stok, pertimbangan sebelum membeli, estimasi pre-order, dan rekomendasi parfum serupa."]
      ]
    : values.map((value) => [value.title, value.body]);

  return (
    <main className="bg-paper">
      <section className="border-b border-ink/10 px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {isId ? "Tentang Authentic Perfumes 8" : "About Authentic Perfumes 8"}
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-ink">
            {isId
              ? "Belanja parfum pilihan dengan informasi yang jelas dan tepercaya."
              : "Boutique perfume buying with proof, context, and less noise."}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-ink/68">
            {isId
              ? "Authentic Perfumes 8 membantu pencinta parfum di Indonesia menemukan parfum asli dari merek niche, desainer, dan rumah parfum yang sulit dicari. Katalog kami menyajikan status yang jelas, harga yang wajar, dan konsultasi langsung saat Anda membutuhkan informasi tambahan."
              : "Authentic Perfumes 8 helps Indonesian fragrance buyers discover original bottles across niche, designer, and hard-to-source houses. The experience is catalog-first: clear status, realistic pricing, and direct consultation when a bottle needs more context."}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3 lg:px-8">
        {localizedValues.map(([title, body]) => (
          <article key={title} className="border border-ink/10 bg-warm/45 p-5">
            <h2 className="font-serif text-2xl text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/68">{body}</p>
          </article>
        ))}
      </section>

      <section className="border-t border-ink/10 px-4 py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-serif text-3xl text-ink">{isId ? "Mencari sesuatu yang spesifik?" : "Looking for something specific?"}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
              {isId
                ? "Kirim nama merek, parfum, ukuran, dan anggaran. Kami akan mengonfirmasi apakah produk tersedia, dapat dipesan melalui pre-order, atau lebih cocok diganti dengan parfum serupa."
                : "Send the house, perfume name, size, and budget. We will confirm whether it is ready stock, pre-order, or better handled as a similar-fragrance request."}
            </p>
          </div>
          <Link
            href={localizedPath(locale, "/contact")}
            className="inline-flex border border-ink bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink"
          >
            {dictionary.nav.contact}
          </Link>
        </div>
      </section>
    </main>
  );
}
