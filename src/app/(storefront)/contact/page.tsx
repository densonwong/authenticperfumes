import type { Metadata } from "next";
import { Instagram, MapPin, MessageCircle } from "lucide-react";
import { RequestFragranceForm } from "@/components/storefront/request-fragrance-form";
import { getDictionary, getLocale } from "@/lib/i18n";
import { siteUrl, INSTAGRAM_URL, SITE_NAME, TIKTOK_URL } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Authentic Perfumes 8 for stock checks, pre-orders, fragrance requests, and consultation.",
  alternates: {
    canonical: "/contact"
  }
};

export default async function ContactPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isId = locale === "id";
  const contactOptions = isId
    ? [
        {
          title: "WhatsApp",
          body: "Contact Us Through WhatsApp for any inquiries: cek stok, harga, pre-order, dan request brand.",
          icon: MessageCircle,
          href: buildWhatsAppUrl("Halo Authentic Perfumes 8, saya ingin bertanya tentang parfum.")
        },
        {
          title: "Instagram",
          body: "Follow us for new arrivals update and any promotion di @authenticperfumes8_.",
          icon: Instagram,
          href: INSTAGRAM_URL
        },
        {
          title: "Ship to All Indonesia",
          body: "Pengiriman ke seluruh Indonesia dengan konfirmasi stok dan packing aman.",
          icon: MapPin,
          href: "/pre-order#shipping"
        }
      ]
    : [
        {
          title: "WhatsApp",
          body: "Contact Us Through WhatsApp for any inquiries: stock checks, prices, pre-orders, and brand requests.",
          icon: MessageCircle,
          href: buildWhatsAppUrl("Halo Authentic Perfumes 8, saya ingin bertanya tentang parfum.")
        },
        {
          title: "Instagram",
          body: "Follow us for new arrivals updates and any promotion at @authenticperfumes8_.",
          icon: Instagram,
          href: INSTAGRAM_URL
        },
        {
          title: "Ship to All Indonesia",
          body: "Nationwide Indonesia shipping with stock confirmation and safe packing.",
          icon: MapPin,
          href: "/pre-order#shipping"
        }
      ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `${SITE_NAME} Contact`,
    url: siteUrl("/contact"),
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      telephone: "+62 823-1000-1899",
      sameAs: [INSTAGRAM_URL, TIKTOK_URL]
    }
  };

  return (
    <main className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-ink/10 px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {dictionary.nav.contact}
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-ink">
            {isId ? "Tanyakan stok, sourcing, atau shortlist parfum." : "Ask for stock, sourcing, or a fragrance shortlist."}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-ink/68">
            {isId
              ? "Sertakan nama parfum, ukuran, budget, dan timeline agar kami bisa konfirmasi jalur terbaik dengan cepat."
              : "Include the fragrance name, preferred size, budget, and timeline so we can confirm the right path quickly."}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3 lg:px-8">
        {contactOptions.map((option) => {
          const Icon = option.icon;

          return (
            <a
              key={option.title}
              href={option.href}
              target={option.href.startsWith("http") ? "_blank" : undefined}
              rel={option.href.startsWith("http") ? "noreferrer" : undefined}
              className="border border-ink/10 bg-warm/45 p-5 transition hover:border-ink/35 hover:bg-white"
            >
              <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
              <h2 className="mt-4 font-serif text-2xl text-ink">{option.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink/68">{option.body}</p>
            </a>
          );
        })}
      </section>

      <section className="border-t border-ink/10 px-4 py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-ink/10 bg-warm/45 p-5">
            <h2 className="font-serif text-2xl text-ink">{isId ? "Detail request WhatsApp" : "WhatsApp request details"}</h2>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">{isId ? "Produk" : "Product"}</dt>
                <dd className="mt-1 text-ink/70">{isId ? "Brand, parfum, concentration, ukuran." : "Brand, perfume, concentration, size."}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">Budget</dt>
                <dd className="mt-1 text-ink/70">{isId ? "Target landed price atau range harga." : "Target landed price or price band."}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">Timeline</dt>
                <dd className="mt-1 text-ink/70">{isId ? "Ready stock, tanggal event, atau ETA fleksibel." : "Ready stock, event date, or flexible ETA."}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">{isId ? "Selera" : "Taste"}</dt>
                <dd className="mt-1 text-ink/70">{isId ? "Suka, tidak suka, cuaca, dan occasion." : "Likes, dislikes, weather, and occasion."}</dd>
              </div>
            </dl>
          </div>
          <RequestFragranceForm dictionary={dictionary.forms} />
        </div>
      </section>
    </main>
  );
}
