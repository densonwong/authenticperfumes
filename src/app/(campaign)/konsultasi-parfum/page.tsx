import type { Metadata } from "next";
import Script from "next/script";
import { landingContent } from "./landing-content";
import "./landing-fonts.css";
import "./landing.css";

export const metadata: Metadata = {
  title: "Konsultasi dan Rekomendasi Parfum | AuthenticPerfumes8",
  description:
    "Bahas keaslian, aroma sebelum blind buy, parfum rare dan rilisan baru, serta pilihan cicilan bersama AuthenticPerfumes8 melalui WhatsApp.",
  robots: { index: false, follow: false },
};

export default function FragranceConsultationPage() {
  return (
    <>
      {/* Markup is a checked-in static string, never fetched or user-generated. */}
      <div dangerouslySetInnerHTML={{ __html: landingContent }} />
      <Script
        id="fragrance-consultation-form"
        src="/landing/konsultasi-parfum/consultation.js"
        strategy="afterInteractive"
      />
    </>
  );
}
