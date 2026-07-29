import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminPage() {
  const admin = await requireAdmin();

  return <AdminShell admin={admin} />;
}
