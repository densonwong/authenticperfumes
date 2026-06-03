import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import "./globals.css";

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
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
