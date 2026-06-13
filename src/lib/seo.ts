import { getPublicSiteUrl } from "@/lib/env";

export const SITE_NAME = "Authentic Perfumes 8";
export const INSTAGRAM_URL = "https://www.instagram.com/authenticperfumes8_?igsh=MWg5ZWVxa3loeGd1eQ==";
export const TIKTOK_URL = "https://www.tiktok.com/@authenticperfumes8_?_r=1&_t=ZS-977N0qpXaks";

export function siteUrl(path = "/") {
  const baseUrl = getPublicSiteUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl(),
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

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path)
    }))
  };
}
