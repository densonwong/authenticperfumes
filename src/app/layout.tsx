import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { getLocale } from "@/lib/i18n";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Authentic Perfumes",
    template: "%s | Authentic Perfumes"
  },
  description:
    "Original niche and designer fragrances in Indonesia with ready stock, pre-order, split payment, and fragrance consultation."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${montserrat.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
