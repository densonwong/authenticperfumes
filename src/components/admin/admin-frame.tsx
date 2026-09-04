"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Boxes,
  Building2,
  Image,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  PackageSearch,
  Store
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/product-sizes", label: "Ukuran Produk", icon: PackageSearch },
  { href: "/admin/brands", label: "Brands", icon: Building2 },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareText },
  { href: "/admin/requests", label: "Requests", icon: PackageSearch },
  { href: "/admin/stock-notifications", label: "Stock notifications", icon: Bell }
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="z-40 flex w-full flex-col border-r border-ink/10 bg-warm md:fixed md:inset-y-0 md:left-0 md:w-64">
        <div className="flex h-[72px] items-center border-b border-ink/10 px-6">
          <Link href="/admin" className="font-logo text-2xl text-ink">
            Authentic Perfumes 8
          </Link>
        </div>

        <nav className="grid flex-1 grid-cols-2 gap-1 px-4 py-5 md:block md:space-y-1" aria-label="Admin navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm transition ${
                  active
                    ? "bg-ink font-semibold text-paper"
                    : "text-ink/65 hover:bg-paper hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-ink/10 px-4 py-5">
          <Link
            href="/id"
            className="flex h-10 items-center gap-3 rounded-md px-3 text-sm text-ink/65 hover:bg-paper hover:text-ink"
          >
            <Store className="h-4 w-4" aria-hidden="true" />
            Storefront
          </Link>
          <Link
            href="/admin/login"
            className="flex h-10 items-center gap-3 rounded-md px-3 text-sm text-ink/65 hover:bg-paper hover:text-ink"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </Link>
        </div>
      </aside>

      <div className="md:pl-64">
        {children}
      </div>
    </div>
  );
}
