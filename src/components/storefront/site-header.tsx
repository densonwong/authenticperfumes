"use client";

import Link from "next/link";
import {
  Menu,
  Search
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Brands A-Z", href: "/brands" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Pre Order", href: "/pre-order" },
  { label: "Sampling", href: "/sampling" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <button
          className="inline-flex h-10 w-10 items-center justify-center border border-ink/15 text-ink lg:hidden"
          type="button"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-[0.16em] text-ink sm:text-3xl"
        >
          Authentic Perfumes
        </Link>

        <div className="hidden flex-1 lg:block" />

        <div className="flex items-center gap-1">
          <Link
            href="/shop"
            className="inline-flex h-10 w-10 items-center justify-center text-ink transition hover:bg-warm focus:outline-none focus:ring-2 focus:ring-gold/60"
            aria-label="Search catalog"
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
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex min-h-12 items-center text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
