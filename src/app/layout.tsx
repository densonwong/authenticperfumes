import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Authentic Perfumes",
    template: "%s | Authentic Perfumes"
  },
  description:
    "Original niche and designer fragrances in Indonesia with ready stock, pre-order, split payment, and fragrance consultation."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
