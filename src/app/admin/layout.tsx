import type { Metadata } from "next";
import { AdminFrame } from "@/components/admin/admin-frame";

export const metadata: Metadata = {
  title: "Admin | Authentic Perfumes"
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminFrame>{children}</AdminFrame>;
}
