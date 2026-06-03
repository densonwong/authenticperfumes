import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";

export function SiteFooter({ dictionary }: { dictionary: Dictionary }) {
  const isId = dictionary.nav.shop === "Belanja";
  const serviceCopy = isId
    ? [
        ["Authenticity", "Setiap botol bersumber dari channel terpercaya dan dicek sebelum dikirim."],
        ["Konsultasi", "Minta rekomendasi scent matching, hadiah, dan pilihan yang cocok untuk cuaca Indonesia."],
        ["Pre Order", "Request botol khusus dengan update ETA transparan sebelum pelunasan."],
        ["Pengiriman", "Ready stock dikirim ke seluruh Indonesia dengan packaging aman untuk parfum."],
        ["Refund", "Refund jelas berlaku saat order tidak bisa dipenuhi atau diverifikasi."],
        ["WhatsApp", "Hubungi kami untuk cek stok, split payment, dan bantuan concierge."]
      ]
    : [
        ["Authenticity", "Every bottle is sourced through trusted channels and checked before dispatch."],
        ["Consultation", "Ask for scent matching, gift guidance, and weather-friendly recommendations."],
        ["Pre Order", "Request special bottles with transparent ETA updates before final payment."],
        ["Shipping", "Ready stock ships across Indonesia with careful fragrance-safe packaging."],
        ["Refund", "Clear refund handling applies when orders cannot be fulfilled or verified."],
        ["WhatsApp", "Message us for stock checks, split availability, and concierge assistance."]
      ];

  return (
    <footer className="border-t border-ink/10 bg-warm">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-6 lg:px-8">
        {serviceCopy.map(([title, body]) => (
          <section key={title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">{body}</p>
          </section>
        ))}
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-ink/65 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>&copy; 2026 Authentic Perfumes. {isId ? "Parfum original untuk Indonesia." : "Original fragrances for Indonesia."}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/testimonials" className="hover:text-ink">
              {dictionary.nav.testimonials}
            </Link>
            <Link href="/pre-order" className="hover:text-ink">
              {dictionary.nav.preOrder}
            </Link>
            <Link href="/contact" className="hover:text-ink">
              {dictionary.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
