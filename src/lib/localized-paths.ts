import type { Locale } from "@/lib/i18n";

const localePrefixPattern = /^\/(id|en)(?=\/|$)/;

export function localizedPath(locale: Locale, href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (localePrefixPattern.test(href)) {
    return href.replace(localePrefixPattern, `/${locale}`);
  }
  return `/${locale}${href === "/" ? "" : href}`;
}

export function switchLocalePath(href: string, locale: Locale) {
  if (localePrefixPattern.test(href)) {
    return href.replace(localePrefixPattern, `/${locale}`);
  }
  return localizedPath(locale, href);
}
