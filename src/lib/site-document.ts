import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { siteUrl, SITE_NAME } from "@/lib/seo";

/**
 * Jost is the closest free stand-in for Futura, and it now sets the entire
 * site: no second family. Real Futura PT is a licensed commercial face, not
 * available from Google Fonts, so switching to it would mean buying a licence
 * and self-hosting the files.
 *
 * The Futura look comes from weight and tracking discipline rather than from a
 * contrasting family: 500 (Medium) for the wordmark, 300 (Light) for headings,
 * 400 for copy, and wide tracking on anything uppercase.
 */
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans-face"
});

export const documentClassName = jost.variable;

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
