import { CreditCard, MessageCircle, PackageCheck, ShieldCheck } from "lucide-react";

const items = [
  {
    label: "100% Authentic",
    detail: "Verified sourcing",
    icon: ShieldCheck
  },
  {
    label: "Indonesia Shipping",
    detail: "Tracked dispatch",
    icon: PackageCheck
  },
  {
    label: "Split Payment",
    detail: "Flexible checkout",
    icon: CreditCard
  },
  {
    label: "Fragrance Consultation",
    detail: "WhatsApp guidance",
    icon: MessageCircle
  }
];

export function TrustStrip() {
  return (
    <section className="border-y border-ink/10 bg-warm/70" aria-label="Store guarantees">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-ink/10 px-4 sm:grid-cols-4 sm:divide-y-0 lg:px-8">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex min-w-0 items-center gap-3 px-2 py-4 sm:px-4">
              <Icon className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-ink">
                  {item.label}
                </p>
                <p className="mt-1 truncate text-xs text-ink/60">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
