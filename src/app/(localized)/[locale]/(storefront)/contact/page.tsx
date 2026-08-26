import type { Metadata } from "next";
import { Instagram, MessageCircle } from "lucide-react";
import { RequestFragranceForm } from "@/components/storefront/request-fragrance-form";
import { getDictionary, normalizeLocale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import { localizedPageMetadata, siteUrl, INSTAGRAM_URL, SITE_NAME, TIKTOK_URL } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = normalizeLocale((await params).locale);
  return localizedPageMetadata(locale, "/contact", {
    title: "Contact",
    description: "Contact Authentic Perfumes 8 for stock checks, pre-orders, fragrance requests, and consultation."
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = normalizeLocale((await params).locale);
  const dictionary = getDictionary(locale);
  const isId = locale === "id";
  const contactOptions = isId
    ? [
        {
          title: "WhatsApp",
          body: "Hubungi kami melalui WhatsApp untuk informasi harga, ketersediaan produk, atau pertanyaan lainnya.",
          icon: MessageCircle,
          href: buildWhatsAppUrl("Halo Authentic Perfumes 8, saya ingin bertanya tentang parfum.")
        },
        {
          title: "Instagram",
          body: "Ikuti @authenticperfumes8_ untuk mendapatkan informasi terbaru mengenai new arrivals, restock, dan promotion.",
          icon: Instagram,
          href: INSTAGRAM_URL
        }
      ]
    : [
        {
          title: "WhatsApp",
          body: "Contact us through WhatsApp for pricing, product availability, or any other questions.",
          icon: MessageCircle,
          href: buildWhatsAppUrl("Hello Authentic Perfumes 8, I would like to ask about a fragrance.")
        },
        {
          title: "Instagram",
          body: "Follow @authenticperfumes8_ for the latest information on new arrivals, restocks, and promotions.",
          icon: Instagram,
          href: INSTAGRAM_URL
        }
      ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `${SITE_NAME} Contact`,
    url: siteUrl(localizedPath(locale, "/contact")),
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
            {isId
              ? "Tanyakan stok, sourcing, atau rekomendasi parfum."
              : "Ask about stock, sourcing, or fragrance recommendations."}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-ink/68">
            {isId
              ? "Sertakan nama parfum, ukuran, dan budget yang diinginkan. Tim kami akan membantu mengecek ketersediaan dan memberikan opsi terbaik untuk Anda."
              : "Include the fragrance name, preferred size, and budget. Our team will check availability and provide the best options for you."}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-2 lg:px-8">
        {contactOptions.map((option) => {
          const Icon = option.icon;

          return (
            <a
              key={option.title}
              href={option.href}
              target="_blank"
              rel="noreferrer"
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
        <div className="mx-auto max-w-4xl">
          <RequestFragranceForm dictionary={dictionary.forms} />
        </div>
      </section>
    </main>
  );
}
