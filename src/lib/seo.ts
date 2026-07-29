import { getPublicSiteUrl } from "@/lib/env";
import type { Metadata } from "next";
import { defaultLocale, type Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";

export const SITE_NAME = "Authentic Perfumes 8";
export const INSTAGRAM_URL = "https://www.instagram.com/authenticperfumes8_?igsh=MWg5ZWVxa3loeGd1eQ==";
export const TIKTOK_URL = "https://www.tiktok.com/@authenticperfumes8_?_r=1&_t=ZS-977N0qpXaks";

export function siteUrl(path = "/") {
  const baseUrl = getPublicSiteUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export function localizedAlternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      "id-ID": localizedPath("id", path),
      en: localizedPath("en", path),
      "x-default": localizedPath(defaultLocale, path)
    }
  };
}

export function localizedPageMetadata(
  locale: Locale,
  path: string,
  metadata: Metadata = {}
): Metadata {
  return {
    ...metadata,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      ...metadata.openGraph,
      url: localizedPath(locale, path)
    }
  };
}

export function organizationJsonLd(locale: Locale = defaultLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl(localizedPath(locale, "/")),
    sameAs: [INSTAGRAM_URL, TIKTOK_URL],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+62 823-1000-1899",
        areaServed: "ID",
        availableLanguage: ["id", "en"]
      }
    ]
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  locale: Locale = defaultLocale
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl(localizedPath(locale, item.path))
    }))
  };
}
