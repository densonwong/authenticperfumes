import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Locale } from "@/lib/i18n";

export function RequestFragranceCta({
  locale,
  brandName
}: {
  locale: Locale;
  brandName?: string;
}) {
  const requestUrl = buildWhatsAppUrl(
    locale === "id"
      ? `Halo Authentic Perfumes 8, saya ingin request parfum${brandName ? ` ${brandName}` : ""}. Mohon bantu cek stok, harga, dan opsi sourcing.`
      : `Hello Authentic Perfumes 8, I would like to request${brandName ? ` a ${brandName}` : ""} fragrance. Please help check stock, price, and sourcing options.`
  );

  return (
    <div className="border border-ink bg-ink p-5 text-paper sm:p-7 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          {locale === "id" ? "Tidak menemukan parfum yang dicari?" : "Looking for another fragrance?"}
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-tight">
          {locale === "id"
            ? brandName
              ? `Cari ${brandName} Lainnya?`
              : "Cari Parfum Lainnya?"
            : brandName
              ? `Looking for Another ${brandName}?`
              : "Looking for Another Fragrance?"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-paper/72">
          {locale === "id"
            ? "Tidak semua koleksi kami ditampilkan secara online. Kirimkan nama parfum yang Anda inginkan, dan tim kami akan membantu mengecek ketersediaan serta harganya."
            : brandName
              ? `We carry many more ${brandName} fragrances than those displayed online. Request any fragrance and our team will check availability, price, and sourcing options for you.`
              : "Not every fragrance in our collection is displayed online. Send us the perfume name you want, and our team will help check availability and price."}
        </p>
      </div>
      <a
        href={requestUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex w-full justify-center border border-gold bg-gold px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition duration-300 hover:border-paper hover:bg-paper hover:text-ink active:scale-[0.98] lg:mt-0 lg:w-auto"
      >
        Request Fragrance
      </a>
    </div>
  );
}
