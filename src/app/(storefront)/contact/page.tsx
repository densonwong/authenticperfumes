import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { RequestFragranceForm } from "@/components/storefront/request-fragrance-form";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Authentic Perfumes for stock checks, pre-orders, fragrance requests, and consultation."
};

const contactOptions = [
  {
    title: "WhatsApp concierge",
    body: "Fastest for stock checks, invoices, pre-order updates, and scent matching.",
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
    title: "Indonesia delivery",
    body: "Ready stock ships nationwide with tracked delivery and packing proof.",
    icon: MapPin,
    href: "/testimonials"
  }
];

export default function ContactPage() {
  return (
    <main className="bg-paper">
      <section className="border-b border-ink/10 px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Contact
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-ink">
            Ask for stock, sourcing, or a fragrance shortlist.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-ink/68">
            Include the fragrance name, preferred size, budget, and timeline so we can confirm the
            right path quickly.
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
            <h2 className="font-serif text-2xl text-ink">Request details</h2>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">Product</dt>
                <dd className="mt-1 text-ink/70">Brand, perfume, concentration, size.</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">Budget</dt>
                <dd className="mt-1 text-ink/70">Target landed price or price band.</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">Timeline</dt>
                <dd className="mt-1 text-ink/70">Ready stock, event date, or flexible ETA.</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-[0.12em] text-ink/45">Taste</dt>
                <dd className="mt-1 text-ink/70">Likes, dislikes, weather, and occasion.</dd>
              </div>
            </dl>
          </div>
          <RequestFragranceForm />
        </div>
      </section>
    </main>
  );
}
