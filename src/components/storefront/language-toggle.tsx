"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const nextLocale: Locale = locale === "id" ? "en" : "id";

  function toggleLocale() {
    document.cookie = `ap_locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="inline-flex h-9 items-center gap-2 border border-ink/15 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-gold hover:text-gold"
      aria-label={label}
      title={label}
    >
      <span>{locale.toUpperCase()}</span>
      <span className="text-ink/35">/</span>
      <span className="text-ink/45">{nextLocale.toUpperCase()}</span>
    </button>
  );
}
