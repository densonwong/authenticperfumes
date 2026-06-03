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
  Newspaper,
  PackageSearch,
  ShieldCheck,
  Store
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/brands", label: "Brands", icon: Building2 },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareText },
  { href: "/admin/discover", label: "Discover", icon: Newspaper },
  { href: "/admin/trust-media", label: "Trust media", icon: ShieldCheck },
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
    <div className="min-h-screen bg-[#f3f7fb] text-[#1f3168]">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#d9e2ef] bg-white">
        <div className="flex h-[72px] items-center border-b border-[#d9e2ef] px-6">
          <Link href="/admin" className="font-serif text-2xl font-semibold text-[#27366f]">
            Authentic.
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-5" aria-label="Admin navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm transition ${
                  active
                    ? "bg-[#27366f] font-semibold text-white"
                    : "text-[#62718f] hover:bg-[#eef3f9] hover:text-[#27366f]"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-[#d9e2ef] px-4 py-5">
          <Link
            href="/"
            className="flex h-10 items-center gap-3 rounded-md px-3 text-sm text-[#62718f] hover:bg-[#eef3f9] hover:text-[#27366f]"
          >
            <Store className="h-4 w-4" aria-hidden="true" />
            Storefront
          </Link>
          <Link
            href="/admin/login"
            className="flex h-10 items-center gap-3 rounded-md px-3 text-sm text-[#62718f] hover:bg-[#eef3f9] hover:text-[#27366f]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </Link>
        </div>
      </aside>

      <div className="pl-64">
        {children}
      </div>
    </div>
  );
}
