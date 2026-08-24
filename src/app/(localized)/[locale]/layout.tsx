import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { WhatsAppFloatingButton } from "@/components/storefront/whatsapp-floating-button";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { organizationJsonLd } from "@/lib/seo";
import { documentClassName, siteMetadata } from "@/lib/site-document";
import "../../globals.css";

type Params = Promise<{ locale: string }>;

export const metadata: Metadata = siteMetadata;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function StorefrontLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Params;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  const dictionary = getDictionary(locale);
  const isId = locale === "id";

  return (
    <html lang={locale} className={documentClassName}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }}
        />
        <AnnouncementBar items={dictionary.announcementItems} text={dictionary.announcement} />
        <SiteHeader locale={locale} dictionary={dictionary.nav} />
        {children}
        <SiteFooter locale={locale} dictionary={dictionary} />
        <WhatsAppFloatingButton
          label={isId ? "Chat dengan Authentic Perfumes 8 di WhatsApp" : "Chat with Authentic Perfumes 8 on WhatsApp"}
          message={
            isId
              ? "Halo Authentic Perfumes 8, saya ingin konsultasi parfum dan cek stok terbaru."
              : "Hello Authentic Perfumes 8, I would like fragrance consultation and the latest stock information."
          }
        />
        <Analytics />
      </body>
    </html>
  );
}
