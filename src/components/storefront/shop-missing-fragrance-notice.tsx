import { ArrowRight, FlaskConical, MessageCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function ShopMissingFragranceNotice({ locale }: { locale: Locale }) {
  const isId = locale === "id";
  const requestUrl = buildWhatsAppUrl(
    isId
      ? "Halo Authentic Perfumes 8, saya mencari parfum tertentu. Mohon bantu cek ketersediaan, harga, dan opsi pemesanan."
      : "Hello Authentic Perfumes 8, I am looking for a specific fragrance. Please help check availability, price, and sourcing options."
  );

  return (
    <div className="grid gap-5 border border-ink/10 bg-warm/45 p-6 sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-8">
      <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-paper text-gold lg:flex">
        <FlaskConical className="h-7 w-7" aria-hidden="true" />
      </div>

      <div>
        <h2 className="font-serif text-2xl leading-tight text-ink sm:text-3xl">
          {isId ? "Tidak menemukan parfum yang Anda cari?" : "Can't find the fragrance you're looking for?"}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/65">
          {isId
            ? "Tidak semua produk kami ditampilkan di website. Hubungi kami dengan menyebutkan brand, nama parfum, dan ukuran yang Anda inginkan."
            : "Not all of our products are displayed on the website. Contact us with the brand, fragrance name, and size you're looking for."}
        </p>
      </div>

      <a
        href={requestUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition duration-300 hover:bg-gold active:scale-[0.98] lg:w-auto"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        {isId ? "Hubungi Kami" : "Contact Us"}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}
