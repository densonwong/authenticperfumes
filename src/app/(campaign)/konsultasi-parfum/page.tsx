import type { Metadata } from "next";
import Script from "next/script";
import { ConsultationScript } from "./consultation-script";
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
      <Script id="consultation-meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '28899681473026029');
          fbq('track', 'PageView');
          window.dispatchEvent(new Event('consultation-pixel-ready'));
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=28899681473026029&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      <ConsultationScript />
    </>
  );
}
