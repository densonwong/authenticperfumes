import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { siteUrl, SITE_NAME } from "@/lib/seo";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "300",
  variable: "--font-logo"
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-caps"
});

export const documentClassName = `${montserrat.variable} ${openSans.variable}`;

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description:
    "Original niche and designer fragrances with ready stock, pre-order, split payment, and fragrance consultation.",
  applicationName: SITE_NAME,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"]
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: siteUrl(),
    title: SITE_NAME,
    description:
      "Original niche and designer fragrances with ready stock, pre-order, split payment, and fragrance consultation."
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Original niche and designer fragrances with ready stock, pre-order, split payment, and fragrance consultation."
  },
  robots: {
    index: true,
    follow: true
  }
};
