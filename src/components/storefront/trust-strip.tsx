import { CreditCard, MessageCircle, PackageCheck, ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

const icons = [ShieldCheck, PackageCheck, CreditCard, MessageCircle];

export function TrustStrip({ dictionary }: { dictionary: Dictionary["trust"] }) {
  const items = [
  {
      label: dictionary.authentic,
      detail: dictionary.sourcing
  },
  {
      label: dictionary.shipping,
      detail: dictionary.dispatch
  },
  {
      label: dictionary.split,
      detail: dictionary.flexible
  },
  {
      label: dictionary.consultation,
      detail: dictionary.guidance
  }
  ];

  return (
    <section className="border-y border-ink/10 bg-warm/70" aria-label="Store guarantees">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-ink/10 px-4 sm:grid-cols-4 sm:divide-y-0 lg:px-8">
        {items.map((item, index) => {
          const Icon = icons[index];

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
