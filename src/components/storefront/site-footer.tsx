import Link from "next/link";
import { Instagram } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/seo";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 3c.3 2.1 1.5 3.4 3.4 3.6v3.1c-1.2 0-2.3-.3-3.4-1v5.9c0 3.7-2.3 6.4-5.9 6.4-3.1 0-5.6-2.2-5.6-5.2 0-3.3 2.6-5.4 6.2-5.1v3.2c-1.7-.3-3 .4-3 1.9 0 1.2 1 2.1 2.3 2.1 1.5 0 2.5-.9 2.5-3V3h3.5Z" />
    </svg>
  );
}

export function SiteFooter({ dictionary }: { dictionary: Dictionary }) {
  const isId = dictionary.nav.shop === "Belanja";
  const exploreLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: dictionary.nav.shop },
    { href: "/brands", label: dictionary.nav.brands },
    { href: "/new-arrivals", label: dictionary.nav.newArrivals },
    { href: "/best-sellers", label: dictionary.nav.bestSellers }
  ];
  const supportLinks = [
    { href: "/pre-order", label: dictionary.nav.preOrder },
    { href: "/testimonials", label: dictionary.nav.testimonials },
    { href: "/pre-order#terms", label: isId ? "Syarat dan Ketentuan" : "Terms and Conditions" },
    { href: "/contact", label: isId ? "Hubungi Kami" : "Contact Us" }
  ];

  return (
    <footer className="border-t border-ink/10 bg-warm">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_0.8fr] lg:px-8">
        <div className="max-w-sm">
          <Link href="/" className="font-logo text-2xl tracking-[0.16em] text-ink">
            AUTHENTIC PERFUMES8
          </Link>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            {isId
              ? "Parfum niche dan designer original dengan layanan request brand, pre-order, dan konsultasi via WhatsApp."
              : "Original niche and designer fragrances with brand request, pre-order, and WhatsApp consultation service."}
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            Explore
          </h2>
          <nav className="mt-4 grid gap-2 text-sm text-ink/65" aria-label="Explore footer navigation">
            {exploreLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            Support
          </h2>
          <nav className="mt-4 grid gap-2 text-sm text-ink/65" aria-label="Support footer navigation">
            {supportLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="lg:justify-self-end">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            Follow Us
          </h2>
          <div className="mt-4 flex gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center border border-ink/15 text-ink/65 transition hover:border-ink/35 hover:text-ink"
              aria-label="Instagram Authentic Perfumes 8"
              title="Instagram"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center border border-ink/15 text-ink/65 transition hover:border-ink/35 hover:text-ink"
              aria-label="TikTok Authentic Perfumes 8"
              title="TikTok"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-ink/50 lg:px-8">
          &copy; 2026 AUTHENTIC PERFUMES8. {isId ? "Parfum original untuk Indonesia." : "Original fragrances for Indonesia."}
        </div>
      </div>
    </footer>
  );
}
