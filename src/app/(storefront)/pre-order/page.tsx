import type { Metadata } from "next";
import { ProductCard } from "@/components/storefront/product-card";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getPreOrderProducts } from "@/lib/repositories/catalog";
import { siteUrl } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Pre Order",
  description: "Understand Authentic Perfumes 8 pre-order process, sourcing updates, and refund policy.",
  alternates: {
    canonical: "/pre-order"
  }
};

const process = [
  "Share the fragrance, size, target budget, and preferred timeline through WhatsApp.",
  "We confirm sourcing availability, estimated landed price, ETA, and payment terms before ordering.",
  "After confirmation, the bottle is purchased through trusted channels and progress updates are sent.",
  "Arrival photos, authenticity checks, and shipping details are shared before final dispatch."
];

const refundPolicy = [
  "If we cannot source or verify the promised bottle, your paid amount is refunded.",
  "Refunds do not apply after a confirmed special order is successfully sourced as agreed, unless the item cannot be fulfilled or verified."
];

const processId = [
  "Kirim parfum, ukuran, target budget, dan timeline yang diinginkan via WhatsApp.",
  "Kami konfirmasi sourcing availability, estimasi landed price, ETA, dan terms pembayaran sebelum order.",
  "Setelah konfirmasi, botol dibeli melalui channel terpercaya dan update progres dikirim.",
  "Foto arrival, pengecekan autentikasi, dan detail pengiriman dibagikan sebelum dispatch final."
];

const refundPolicyId = [
  "Jika kami tidak bisa sourcing atau verifikasi botol sesuai janji, nominal yang sudah dibayar akan di-refund.",
  "Refund tidak berlaku setelah special order yang sudah dikonfirmasi berhasil di-source sesuai kesepakatan, kecuali item tidak dapat dipenuhi atau diverifikasi."
];

export default async function PreOrderPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const products = await getPreOrderProducts();
  const isId = locale === "id";
  const processItems = isId ? processId : process;
  const refundItems = isId ? refundPolicyId : refundPolicy;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: siteUrl("/pre-order"),
    mainEntity: [
      {
        "@type": "Question",
        name: isId ? "Bagaimana proses pre-order?" : "How does pre-order work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: processItems.join(" ")
        }
      },
      {
        "@type": "Question",
        name: isId ? "Bagaimana kebijakan refund pre-order?" : "What is the pre-order refund policy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: refundItems.join(" ")
        }
      }
    ]
  };

  return (
    <main className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-ink/10 px-4 py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              {isId ? "Sistem Pre-Order" : "Pre-Order System"}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">
              {isId ? "Pre-order dengan checkpoint jelas" : "Pre-order with clear checkpoints"}
            </h1>
            <p className="mt-4 text-sm leading-7 text-ink/68">
              {isId
                ? "Pre-order untuk botol yang belum ready stock. Kami konfirmasi availability, harga, ETA, dan ekspektasi autentikasi sebelum Anda commit."
                : "Pre-order is for bottles that are not currently ready stock. We confirm availability, price, ETA, and authenticity expectations before you commit."}
            </p>
            <a
              href={buildWhatsAppUrl("Halo Authentic Perfumes 8, saya ingin menanyakan pre-order parfum.")}
              className="mt-6 inline-flex border border-ink bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink"
            >
              {isId ? "Mulai pre-order" : "Start pre-order"}
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <section className="border border-ink/10 bg-warm/45 p-5">
              <h2 className="font-serif text-2xl text-ink">{isId ? "Proses" : "Process"}</h2>
              <ol className="mt-4 space-y-3">
                {processItems.map((item, index) => (
                  <li key={item} className="text-sm leading-6 text-ink/70">
                    <span className="font-semibold text-ink">{index + 1}. </span>
                    {item}
                  </li>
                ))}
              </ol>
            </section>
            <section id="refund" className="scroll-mt-32 border border-ink/10 bg-paper p-5">
              <h2 className="font-serif text-2xl text-ink">{isId ? "Kebijakan refund" : "Refund policy"}</h2>
              <ul className="mt-4 space-y-3">
                {refundItems.map((item) => (
                  <li key={item} className="text-sm leading-6 text-ink/70">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3 lg:px-8">
        <section id="shipping" className="scroll-mt-32 border border-ink/10 bg-warm/45 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {isId ? "Pengiriman" : "Shipping"}
          </p>
          <h2 className="mt-3 font-serif text-2xl text-ink">
            {isId ? "Pengiriman ke seluruh Indonesia" : "Ship to all Indonesia"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            {isId
              ? "Ready stock dikirim setelah stok dan pembayaran terkonfirmasi. Untuk pre-order, pengiriman dilakukan setelah barang tiba, dicek, dan siap dispatch."
              : "Ready stock ships after stock and payment are confirmed. For pre-order, dispatch happens after arrival, checking, and final confirmation."}
          </p>
        </section>
        <section id="payment" className="scroll-mt-32 border border-ink/10 bg-warm/45 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {isId ? "Pembayaran" : "Payment"}
          </p>
          <h2 className="mt-3 font-serif text-2xl text-ink">
            {isId ? "Pembayaran fleksibel" : "Flexible payment"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            {isId
              ? "Pembayaran bertahap 2-3x tersedia untuk produk tertentu. Detail nominal, deadline, dan pelunasan dikonfirmasi via WhatsApp sebelum order."
              : "2-3x installment payment is available for selected products. Amounts, deadlines, and settlement details are confirmed through WhatsApp before ordering."}
          </p>
        </section>
        <section id="terms" className="scroll-mt-32 border border-ink/10 bg-warm/45 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {isId ? "Syarat dan Ketentuan" : "Terms and Conditions"}
          </p>
          <h2 className="mt-3 font-serif text-2xl text-ink">
            {isId ? "Konfirmasi sebelum pembayaran" : "Confirm before payment"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            {isId
              ? "Harga, stok, ETA, opsi cicilan, dan kebijakan refund dikonfirmasi melalui WhatsApp sebelum transaksi dilanjutkan."
              : "Price, stock, ETA, installment options, and refund terms are confirmed through WhatsApp before the transaction proceeds."}
          </p>
        </section>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-5 border-b border-ink/10 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {isId ? "Tersedia untuk request" : "Available to request"}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">{isId ? "Daftar pre-order saat ini" : "Current pre-order list"}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} dictionary={dictionary} />
          ))}
        </div>
      </section>
    </main>
  );
}
