import Link from "next/link";

const serviceCopy = [
  {
    title: "Authenticity",
    body: "Every bottle is sourced through trusted channels and checked before dispatch."
  },
  {
    title: "Consultation",
    body: "Ask for scent matching, gift guidance, and weather-friendly recommendations."
  },
  {
    title: "Pre Order",
    body: "Request special bottles with transparent ETA updates before final payment."
  },
  {
    title: "Shipping",
    body: "Ready stock ships across Indonesia with careful fragrance-safe packaging."
  },
  {
    title: "Refund",
    body: "Clear refund handling applies when orders cannot be fulfilled or verified."
  },
  {
    title: "WhatsApp",
    body: "Message us for stock checks, split availability, and concierge assistance."
  }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-warm">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-6 lg:px-8">
        {serviceCopy.map((item) => (
          <section key={item.title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">{item.body}</p>
          </section>
        ))}
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-ink/65 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>&copy; 2026 Authentic Perfumes. Original fragrances for Indonesia.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/trust-center" className="hover:text-ink">
              Trust Center
            </Link>
            <Link href="/pre-order" className="hover:text-ink">
              Pre Order
            </Link>
            <Link href="/contact" className="hover:text-ink">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
