import Link from "next/link";
import {
  Bell,
  Boxes,
  Building2,
  Image,
  LayoutDashboard,
  MessageSquareText,
  Newspaper,
  PackageSearch,
  ShieldCheck,
  Sparkles
} from "lucide-react";

type AdminShellProps = {
  admin: {
    email: string;
  };
};

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

const dashboardStats = [
  { label: "Catalog sections", value: "9" },
  { label: "Pending workflows", value: "3" },
  { label: "Preview mode", value: "Ready" }
];

export function AdminShell({ admin }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="border-b border-stone/30 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-ink bg-ink text-white">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold">Authentic Perfumes Admin</p>
              <p className="text-xs text-stone">{admin.email}</p>
            </div>
          </div>
          <Link href="/" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone hover:text-ink">
            Storefront
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="border border-stone/30 bg-white">
          <nav className="grid p-2" aria-label="Admin navigation">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex h-10 items-center gap-2 px-3 text-sm text-ink hover:bg-warm"
                >
                  <Icon className="h-4 w-4 text-stone" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="space-y-5">
          <section className="border border-stone/30 bg-white p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <p className="mt-1 text-sm text-stone">
                  Manage catalog content, merchandising, customer requests, and back-in-stock interest.
                </p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Operations</p>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            {dashboardStats.map((stat) => (
              <div key={stat.label} className="border border-stone/30 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </section>

          <section className="border border-stone/30 bg-white">
            <div className="border-b border-stone/30 px-4 py-3">
              <h2 className="text-sm font-semibold">Admin areas</h2>
            </div>
            <div className="divide-y divide-stone/20">
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-warm"
                >
                  <span>{item.label}</span>
                  <span className="text-xs uppercase tracking-[0.12em] text-stone">Open</span>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
