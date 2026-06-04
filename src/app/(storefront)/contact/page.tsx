import type { Metadata } from "next";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { RequestFragranceForm } from "@/components/storefront/request-fragrance-form";
import { getDictionary, getLocale } from "@/lib/i18n";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const INSTAGRAM_URL = "https://www.instagram.com/authenticperfumes8_?igsh=MWg5ZWVxa3loeGd1eQ==";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Authentic Perfumes for stock checks, pre-orders, fragrance requests, and consultation."
};

export default async function ContactPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isId = locale === "id";
  const contactOptions = isId
    ? [
        {
          title: "Concierge WhatsApp",
          body: "Paling cepat untuk cek stok, invoice, update pre-order, dan matching aroma: +62 823-1000-1899.",
          icon: MessageCircle,
          href: buildWhatsAppUrl("Halo Authentic Perfumes, saya ingin bertanya tentang parfum.")
        },
        {
          title: "Email",
          body: "Untuk kolaborasi, wholesale, atau request yang membutuhkan detail lebih panjang.",
          icon: Mail,
          href: "mailto:hello@authenticperfumes.id"
        },
        {
          title: "Instagram",
          body: "Follow update arrival, story customer, dan katalog singkat di @authenticperfumes8_.",
          icon: Instagram,
          href: INSTAGRAM_URL
        },
        {
          title: "Pengiriman Indonesia",
          body: "Ready stock dikirim ke seluruh Indonesia dengan resi dan bukti packing.",
          icon: MapPin,
          href: "/testimonials"
        }
      ]
    : [
        {
          title: "WhatsApp concierge",
          body: "Fastest for stock checks, invoices, pre-order updates, and scent matching: +62 823-1000-1899.",
          icon: MessageCircle,
          href: buildWhatsAppUrl("Halo Authentic Perfumes, saya ingin bertanya tentang parfum.")
        },
        {
          title: "Email",
          body: "Best for collaboration, wholesale inquiries, and longer requests.",
          icon: Mail,
          href: "mailto:hello@authenticperfumes.id"
        },
        {
          title: "Instagram",
          body: "Follow arrivals, customer stories, and short catalog updates at @authenticperfumes8_.",
          icon: Instagram,
          href: INSTAGRAM_URL
        },
        {
          title: "Indonesia delivery",
          body: "Ready stock ships nationwide with tracked delivery and packing proof.",
          icon: MapPin,
          href: "/testimonials"
        }
      ];

  return (
    <main className="bg-paper">
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

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
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
            <h2 className="font-serif text-2xl text-ink">{isId ? "Detail request" : "Request details"}</h2>
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
