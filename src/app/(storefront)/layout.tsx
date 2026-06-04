import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { WhatsAppFloatingButton } from "@/components/storefront/whatsapp-floating-button";
import { getDictionary, getLocale } from "@/lib/i18n";
import { organizationJsonLd } from "@/lib/seo";

export default async function StorefrontLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isId = locale === "id";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <AnnouncementBar text={dictionary.announcement} />
      <SiteHeader locale={locale} dictionary={dictionary.nav} />
      {children}
      <SiteFooter dictionary={dictionary} />
      <WhatsAppFloatingButton
        label={isId ? "Chat dengan Authentic Perfumes 8 di WhatsApp" : "Chat with Authentic Perfumes 8 on WhatsApp"}
        message={
          isId
            ? "Halo Authentic Perfumes 8, saya ingin konsultasi parfum dan cek stok terbaru."
            : "Hello Authentic Perfumes 8, I would like fragrance consultation and the latest stock information."
        }
      />
    </>
  );
}
