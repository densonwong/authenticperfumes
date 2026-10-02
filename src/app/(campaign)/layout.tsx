import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";

// Separate root layout keeps catalog navigation and global styles off ad pages.
export default function CampaignLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
