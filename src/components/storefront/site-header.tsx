"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Menu,
  Search,
  X
} from "lucide-react";
import { LanguageToggle } from "@/components/storefront/language-toggle";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const perfumeItems = [
  { label: "Discover All Fragrances", href: "/shop" },
  { label: "REQ PERFUME", href: "request" },
  { label: "Brand A-Z", href: "/brands" },
  { label: "New Arrival", href: "/new-arrivals" },
  { label: "Best Seller", href: "/best-sellers" },
  { label: "Pre Order", href: "/pre-order" }
];

export function SiteHeader({
  locale,
  dictionary
}: {
  locale: Locale;
  dictionary: Dictionary["nav"];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPerfumesOpen, setIsPerfumesOpen] = useState(false);
  const MenuIcon = isMenuOpen ? X : Menu;
  const requestUrl = buildWhatsAppUrl(
    locale === "id"
      ? "Halo Authentic Perfumes 8, saya ingin request fragrance. Mohon bantu cek stok, harga, dan opsi sourcing."
      : "Hello Authentic Perfumes 8, I would like to request a fragrance. Please help check stock, price, and sourcing options."
  );
  const perfumeLinks = perfumeItems.map((item) => ({
    ...item,
    href: item.href === "request" ? requestUrl : localizedPath(locale, item.href),
    external: item.href === "request"
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-2 px-4 py-3 lg:flex lg:justify-between lg:px-8">
        <button
          className="inline-flex h-10 w-10 items-center justify-center border border-ink/15 text-ink lg:hidden"
          type="button"
          aria-label={dictionary.open}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <MenuIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link
          href={localizedPath(locale, "/")}
          className="min-w-0 justify-self-center text-center font-logo text-[clamp(1.12rem,5.2vw,1.65rem)] leading-none tracking-[0.12em] text-ink lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:text-3xl lg:tracking-[0.16em]"
        >
          AUTHENTIC PERFUMES8
        </Link>

        <div className="hidden flex-1 lg:block" />

        <div className="flex items-center justify-end gap-2">
          <LanguageToggle locale={locale} label={dictionary.language} />
          <Link
            href={localizedPath(locale, "/shop")}
            className="inline-flex h-10 w-10 items-center justify-center text-ink transition hover:bg-warm focus:outline-none focus:ring-2 focus:ring-gold/60"
            aria-label={dictionary.search}
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            href={localizedPath(locale, "/shop")}
            className="hidden h-10 items-center border border-ink bg-ink px-5 font-caps text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink lg:inline-flex"
          >
            {dictionary.shop}
          </Link>
        </div>
      </div>

      <nav
        className="hidden border-t border-ink/10 bg-paper px-6 lg:block"
        aria-label="Primary navigation"
      >
        <ul className="mx-auto flex max-w-7xl items-center justify-center gap-8">
          <li>
            <Link
              href={localizedPath(locale, "/")}
              className="flex min-h-12 items-center text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold"
            >
              {dictionary.home}
            </Link>
          </li>
          <li className="group relative">
            <button
              type="button"
              className="flex min-h-12 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold focus:outline-none focus:text-gold"
            >
              Perfumes
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 border border-gold/30 bg-paper p-2 opacity-0 shadow-[0_18px_45px_rgba(39,34,28,0.14)] transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {perfumeLinks.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-warm hover:text-gold"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-warm hover:text-gold"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </li>
          <li>
            <a
              href={requestUrl}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center text-xs font-semibold uppercase tracking-[0.18em] text-gold transition hover:text-ink"
            >
              REQ FRAGRANCE
            </a>
          </li>
          <li>
            <Link
              href={localizedPath(locale, "/testimonials")}
              className="flex min-h-12 items-center text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold"
            >
              {dictionary.testimonials}
            </Link>
          </li>
          <li>
            <Link
              href={localizedPath(locale, "/contact")}
              className="flex min-h-12 items-center text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold"
            >
              {dictionary.contact}
            </Link>
          </li>
        </ul>
      </nav>

      <nav
        id="mobile-navigation"
        className={`${isMenuOpen ? "block" : "hidden"} border-t border-ink/10 bg-paper px-4 py-3 lg:hidden`}
        aria-label="Mobile navigation"
      >
        <ul className="grid divide-y divide-ink/10">
          <li>
            <Link
              href={localizedPath(locale, "/")}
              onClick={() => setIsMenuOpen(false)}
              className="flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold"
            >
              {dictionary.home}
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="flex min-h-11 w-full items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold"
              aria-expanded={isPerfumesOpen}
              onClick={() => setIsPerfumesOpen((current) => !current)}
            >
              Perfumes
              <ChevronDown
                className={`h-4 w-4 transition ${isPerfumesOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {isPerfumesOpen ? (
              <div className="mb-3 grid border border-gold/25 bg-warm/45 p-2">
                {perfumeLinks.map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink/78 transition hover:text-gold"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink/78 transition hover:text-gold"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            ) : null}
          </li>
          <li>
            <a
              href={requestUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.18em] text-gold transition hover:text-ink"
            >
              REQ FRAGRANCE
            </a>
          </li>
          <li>
            <Link
              href={localizedPath(locale, "/testimonials")}
              onClick={() => setIsMenuOpen(false)}
              className="flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold"
            >
              {dictionary.testimonials}
            </Link>
          </li>
          <li>
            <Link
              href={localizedPath(locale, "/contact")}
              onClick={() => setIsMenuOpen(false)}
              className="flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold"
            >
              {dictionary.contact}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
