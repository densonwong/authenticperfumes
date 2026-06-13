"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  X
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const MenuIcon = isMenuOpen ? X : Menu;

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
          href="/"
          className="min-w-0 justify-self-center text-center font-logo text-[clamp(1.12rem,5.2vw,1.65rem)] leading-none tracking-[0.12em] text-ink lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:text-3xl lg:tracking-[0.16em]"
        >
          AUTHENTIC PERFUMES8
        </Link>

        <div className="hidden flex-1 lg:block" />

        <div className="flex items-center justify-end gap-1">
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

      <nav
        id="mobile-navigation"
        className={`${isMenuOpen ? "block" : "hidden"} border-t border-ink/10 bg-paper px-4 py-3 lg:hidden`}
        aria-label="Mobile navigation"
      >
        <ul className="grid divide-y divide-ink/10">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold"
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
