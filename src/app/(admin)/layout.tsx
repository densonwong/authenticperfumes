import { Analytics } from "@vercel/analytics/next";
import { documentClassName } from "@/lib/site-document";
import "../globals.css";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={documentClassName}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
