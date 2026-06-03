"use client";

import Link from "next/link";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  groups?: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
};

const navItems: NavItem[] = [
  {
    label: "Brands",
    href: "/brands",
    groups: [
      {
        title: "Shop by house",
        links: [
          { label: "Niche Houses", href: "/brands?type=niche" },
          { label: "Designer Labels", href: "/brands?type=designer" },
          { label: "Indie Discoveries", href: "/brands?type=indie" }
        ]
      },
      {
        title: "Featured edits",
        links: [
          { label: "Creed", href: "/brands/creed" },
          { label: "Maison Francis Kurkdjian", href: "/brands/maison-francis-kurkdjian" },
          { label: "Diptyque", href: "/brands/diptyque" }
        ]
      }
    ]
  },
  { label: "New", href: "/new-arrivals" },
  {
    label: "Fragrances",
    href: "/shop",
    groups: [
      {
        title: "Families",
        links: [
          { label: "Woody", href: "/shop?note=Woody" },
          { label: "Floral", href: "/shop?note=Floral" },
          { label: "Amber", href: "/shop?note=Amber" }
        ]
      },
      {
        title: "Occasion",
        links: [
          { label: "Office Friendly", href: "/shop?q=office" },
          { label: "Evening", href: "/shop?q=evening" },
          { label: "Tropical Weather", href: "/shop?q=tropical" }
        ]
      }
    ]
  },
  { label: "Sampling", href: "/sampling" },
  { label: "Pre Order", href: "/pre-order" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Trust Center", href: "/testimonials" },
  {
    label: "Discover",
    href: "/discover",
    groups: [
      {
        title: "Guides",
        links: [
          { label: "How to Choose", href: "/discover/how-to-choose" },
          { label: "Layering Notes", href: "/discover/layering" },
          { label: "Gift Finder", href: "/discover/gifts" }
        ]
      },
      {
        title: "Concierge",
        links: [
          { label: "Scent Consultation", href: "/discover/consultation" },
          { label: "Authenticity Process", href: "/testimonials" },
          { label: "Pre Order Guide", href: "/pre-order" }
        ]
      }
    ]
  },
  { label: "Contact", href: "/contact" }
];

const headerActions = [
  { label: "Search", icon: Search, href: "/search" },
  { label: "Account", icon: User, href: "/account" },
  { label: "Wishlist", icon: Heart, href: "/wishlist" },
  { label: "Bag", icon: ShoppingBag, href: "/bag" }
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
          {headerActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                href={action.href}
                className="inline-flex h-10 w-10 items-center justify-center text-ink transition hover:bg-warm focus:outline-none focus:ring-2 focus:ring-gold/60"
                aria-label={action.label}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </div>

      <nav
        className="hidden border-t border-ink/10 bg-paper px-6 lg:block"
        aria-label="Primary navigation"
      >
        <ul className="mx-auto flex max-w-7xl items-center justify-center gap-9">
          {navItems.map((item) => (
            <li key={item.label} className="group relative">
              <Link
                href={item.href}
                className="flex min-h-12 items-center text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:text-gold"
              >
                {item.label}
              </Link>

              {item.groups ? (
                <div className="invisible absolute left-1/2 top-full w-[520px] -translate-x-1/2 border border-ink/10 bg-paper p-6 opacity-0 shadow-xl shadow-ink/10 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="grid grid-cols-2 gap-8">
                    {item.groups.map((group) => (
                      <div key={group.title}>
                        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                          {group.title}
                        </p>
                        <ul className="space-y-3">
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="text-sm text-ink/75 transition hover:text-ink"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
