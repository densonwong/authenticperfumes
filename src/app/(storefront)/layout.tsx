import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { WhatsAppFloatingButton } from "@/components/storefront/whatsapp-floating-button";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      {children}
      <SiteFooter />
      <WhatsAppFloatingButton />
    </>
  );
}
