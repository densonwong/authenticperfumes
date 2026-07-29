"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { switchLocalePath } from "@/lib/localized-paths";

export function LanguageToggle({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const [suffix, setSuffix] = useState("");
  const nextLocale: Locale = locale === "id" ? "en" : "id";

  useEffect(() => {
    setSuffix(`${window.location.search}${window.location.hash}`);
  }, [pathname]);

  return (
    <Link
      href={switchLocalePath(`${pathname}${suffix}`, nextLocale)}
      className="inline-flex h-9 items-center gap-1 border border-ink/15 px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink transition hover:border-gold hover:text-gold sm:gap-2 sm:px-3 sm:text-[11px] sm:tracking-[0.14em]"
      aria-label={label}
      title={label}
    >
      <span>{locale.toUpperCase()}</span>
      <span className="text-ink/35">/</span>
      <span className="text-ink/45">{nextLocale.toUpperCase()}</span>
    </Link>
  );
}
