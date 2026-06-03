import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { WhatsAppFloatingButton } from "@/components/storefront/whatsapp-floating-button";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function StorefrontLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isId = locale === "id";

  return (
    <>
      <AnnouncementBar text={dictionary.announcement} />
      <SiteHeader locale={locale} dictionary={dictionary.nav} />
      {children}
      <SiteFooter dictionary={dictionary} />
      <WhatsAppFloatingButton
        label={isId ? "Chat dengan Authentic Perfumes di WhatsApp" : "Chat with Authentic Perfumes on WhatsApp"}
        message={
          isId
            ? "Halo Authentic Perfumes, saya ingin konsultasi parfum dan cek stok terbaru."
            : "Hello Authentic Perfumes, I would like fragrance consultation and the latest stock information."
        }
      />
    </>
  );
}
