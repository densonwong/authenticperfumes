"use client";

import Link from "next/link";
import {
  Menu,
  Search
} from "lucide-react";
import { LanguageToggle } from "@/components/storefront/language-toggle";
import type { Dictionary, Locale } from "@/lib/i18n";

type NavItem = {
  key: keyof Dictionary["nav"];
  href: string;
};

const navItems: NavItem[] = [
  { key: "shop", href: "/shop" },
  { key: "brands", href: "/brands" },
  { key: "newArrivals", href: "/new-arrivals" },
  { key: "bestSellers", href: "/best-sellers" },
  { key: "preOrder", href: "/pre-order" },
  { key: "sampling", href: "/sampling" },
  { key: "testimonials", href: "/testimonials" },
  { key: "contact", href: "/contact" }
];

export function SiteHeader({
  locale,
  dictionary
}: {
  locale: Locale;
  dictionary: Dictionary["nav"];
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <button
          className="inline-flex h-10 w-10 items-center justify-center border border-ink/15 text-ink lg:hidden"
          type="button"
          aria-label={dictionary.open}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-logo text-2xl tracking-[0.16em] text-ink sm:text-3xl"
        >
          Authentic Perfumes
        </Link>

        <div className="hidden flex-1 lg:block" />

        <div className="flex items-center gap-1">
          <LanguageToggle locale={locale} label={dictionary.language} />
          <Link
            href="/shop"
            className="inline-flex h-10 w-10 items-center justify-center text-ink transition hover:bg-warm focus:outline-none focus:ring-2 focus:ring-gold/60"
            aria-label={dictionary.search}
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <nav
        className="hidden border-t border-ink/10 bg-paper px-6 lg:block"
        aria-label="Primary navigation"
      >
        <ul className="mx-auto flex max-w-7xl items-center justify-center gap-8">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="flex min-h-12 items-center text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold"
              >
                {dictionary[item.key]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
