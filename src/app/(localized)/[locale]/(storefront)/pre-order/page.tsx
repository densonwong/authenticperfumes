import type { Metadata } from "next";
import { ProductCard } from "@/components/storefront/product-card";
import { getDictionary, normalizeLocale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import { getPreOrderProducts } from "@/lib/repositories/catalog";
import { localizedPageMetadata, siteUrl } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = normalizeLocale((await params).locale);
  return localizedPageMetadata(locale, "/pre-order", locale === "id"
    ? {
        title: "Pre-Order Parfum",
        description: "Pelajari proses pre-order, kebijakan pembayaran, pengiriman, serta ketentuan pemesanan Authentic Perfumes 8."
      }
    : {
        title: "Pre Order",
        description: "Understand Authentic Perfumes 8 pre-order process, payment policy, shipping, and order terms."
      });
}

const process = [
  "Send the perfume name, variant, and desired size through WhatsApp.",
  "We will confirm availability, the estimated price, and payment terms before ordering.",
  "Once confirmed, the perfume will be processed and we will provide updates throughout the process.",
  "After the item arrives, the order will be prepared and shipped to you."
];

const processId = [
  "Kirim nama parfum, varian, dan ukuran yang diinginkan melalui WhatsApp.",
  "Kami akan mengonfirmasi ketersediaan, estimasi harga, dan ketentuan pembayaran sebelum pemesanan.",
  "Setelah dikonfirmasi, parfum akan diproses dan kami akan memberikan kabar terbaru selama proses berlangsung.",
  "Setelah barang tiba, pesanan akan disiapkan dan dikirim kepada Anda."
];

const paymentPolicy = [
  "Payment constitutes acceptance of the terms.",
  "All transactions are final and cannot be cancelled or exchanged.",
  "Deposits and payments already received are non-refundable. If an order is cancelled, the deposit or payment is forfeited.",
  "If the item is unavailable, a 100% refund will be issued."
];

const paymentPolicyId = [
  "Pembayaran merupakan tanda persetujuan.",
  "Semua transaksi bersifat final (tidak dapat dibatalkan/ditukar).",
  "DP maupun pembayaran yang sudah masuk tidak dapat dikembalikan. Jika pesanan dibatalkan, DP atau pembayaran akan hangus.",
  "Jika barang tidak tersedia, pembayaran akan dikembalikan 100%."
];

const termsGroups = [
  {
    title: "Ready Stock",
    items: [
      "Full payment is required to secure the item.",
      "Reservations or holds are not available."
    ]
  },
  {
    title: "Pre-Order (PO)",
    items: [
      "A minimum 50% deposit is required.",
      "Deposits below 50% are only available for selected trips and must be confirmed in advance.",
      "For orders above IDR 15 million, a 50% deposit remains mandatory without exception."
    ]
  },
  { title: "Payment Policy", items: paymentPolicy },
  {
    title: "Final Payment",
    items: [
      "Final payment is due when the item arrives in Indonesia and no later than seven days after notification."
    ]
  },
  {
    title: "Pre-Order Estimate",
    items: [
      "Arrival times may change depending on the logistics process.",
      "Delays may occur for reasons outside our control, except for hand-carried items with a previously communicated schedule."
    ]
  },
  {
    title: "Order Shipping",
    items: [
      "Orders are shipped after full payment is received.",
      "Complaints and claims must include an uninterrupted, uncut unboxing video.",
      "Complaints without video evidence cannot be processed."
    ]
  }
];

const termsGroupsId = [
  {
    title: "Stok Tersedia",
    items: [
      "Pembayaran penuh diperlukan untuk mengamankan barang.",
      "Barang tidak dapat dipesan sementara atau ditahan."
    ]
  },
  {
    title: "Pre-Order (PO)",
    items: [
      "Minimal DP 50%.",
      "Pengecualian untuk DP di bawah 50% hanya berlaku untuk perjalanan tertentu (silakan konfirmasi terlebih dahulu).",
      "Namun, pesanan >15 juta: DP tetap wajib 50% (tanpa pengecualian)."
    ]
  },
  { title: "Kebijakan Pembayaran", items: paymentPolicyId },
  {
    title: "Pelunasan",
    items: [
      "Pelunasan pembayaran dilakukan saat barang tiba di Indonesia dan maksimal H+7 setelah pemberitahuan."
    ]
  },
  {
    title: "Estimasi Pre-Order",
    items: [
      "Waktu kedatangan dapat berubah mengikuti proses logistik.",
      "Keterlambatan dapat terjadi di luar kendali kami, kecuali untuk barang yang dibawa langsung dengan jadwal yang telah diinformasikan."
    ]
  },
  {
    title: "Pengiriman Pesanan",
    items: [
      "Pesanan akan dikirim setelah pembayaran lunas.",
      "Komplain dan klaim wajib menyertakan video pembukaan paket tanpa jeda atau potongan.",
      "Komplain tanpa bukti video tidak dapat diproses."
    ]
  }
];

export default async function PreOrderPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = normalizeLocale((await params).locale);
  const dictionary = getDictionary(locale);
  const products = await getPreOrderProducts();
  const isId = locale === "id";
  const processItems = isId ? processId : process;
  const paymentPolicyItems = isId ? paymentPolicyId : paymentPolicy;
  const localizedTermsGroups = isId ? termsGroupsId : termsGroups;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: siteUrl(localizedPath(locale, "/pre-order")),
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
        name: isId ? "Bagaimana kebijakan pembayaran pre-order?" : "What is the pre-order payment policy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: paymentPolicyItems.join(" ")
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
              {isId ? "Pre-order dengan proses yang jelas" : "Pre-order with a clear process"}
            </h1>
            <p className="mt-4 text-sm leading-7 text-ink/68">
              {isId
                ? "Untuk parfum yang belum tersedia, kami akan mengonfirmasi ketersediaan, harga, estimasi kedatangan, dan detail produk sebelum Anda melakukan pemesanan."
                : "For fragrances that are not available as ready stock, we will confirm availability, price, estimated arrival, and product details before you place an order."}
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
            <section id="payment-policy" className="scroll-mt-32 border border-ink/10 bg-paper p-5">
              <h2 className="font-serif text-2xl text-ink">
                {isId ? "Kebijakan Pembayaran" : "Payment Policy"}
              </h2>
              <ol className="mt-4 space-y-3">
                {paymentPolicyItems.map((item, index) => (
                  <li key={item} className="text-sm leading-6 text-ink/70">
                    <span className="font-semibold text-ink">{index + 1}. </span>
                    {item}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
        <section id="shipping" className="scroll-mt-32 border border-ink/10 bg-warm/45 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {isId ? "Pengiriman" : "Shipping"}
          </p>
          <h2 className="mt-3 font-serif text-2xl text-ink">
            {isId ? "Pengiriman ke seluruh Indonesia" : "Ship to all Indonesia"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            {isId
              ? "Pesanan dengan stok tersedia dikirim setelah pembayaran terkonfirmasi. Untuk pre-order, pengiriman dilakukan setelah barang tiba dan siap dikirim kepada Anda."
              : "Ready-stock orders are shipped after payment is confirmed. Pre-orders are shipped after the item arrives and is ready to be sent to you."}
          </p>
        </section>
        <section id="terms" className="scroll-mt-32 border border-ink/10 bg-warm/45 p-5">
          <h2 className="font-serif text-2xl text-ink">
            {isId ? "Syarat dan Ketentuan" : "Terms and Conditions"}
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {localizedTermsGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-ink">{group.title}</h3>
                <ul className="mt-2 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-6 text-ink/70">
                      <span aria-hidden="true">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-5 border-b border-ink/10 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {isId ? "Tersedia untuk dipesan" : "Available to request"}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">{isId ? "Daftar pre-order saat ini" : "Current pre-order list"}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} dictionary={dictionary} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}
