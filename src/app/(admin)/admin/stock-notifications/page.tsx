import Link from "next/link";
import { StatusSelect } from "@/components/admin/status-select";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminStockNotifications } from "@/lib/repositories/admin-cms";
import type { NotificationStatus } from "@/lib/types";

const statuses: NotificationStatus[] = ["pending", "notified", "closed"];

export default async function AdminStockNotificationsPage() {
  await requireAdmin();
  const notifications = await getAdminStockNotifications();

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <div className="border border-stone/30 bg-white p-4">
          <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</Link>
          <h1 className="mt-1 text-xl font-semibold">Stock notifications</h1>
        </div>
        <div className="overflow-x-auto border border-stone/30 bg-white">
          <table className="min-w-full divide-y divide-stone/20 text-sm">
            <thead className="bg-warm/70 text-left text-xs font-semibold uppercase tracking-[0.12em] text-stone">
              <tr>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Product reference</th>
                <th className="px-3 py-3">Created</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/20">
              {notifications.map((notification) => (
                <tr key={notification.id} className="align-top">
                  <td className="px-3 py-3 text-stone">{notification.email ?? notification.phone}</td>
                  <td className="px-3 py-3 font-semibold">{notification.productSlug}</td>
                  <td className="px-3 py-3 text-stone">
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    }).format(new Date(notification.createdAt))}
                  </td>
                  <td className="px-3 py-3">
                    <StatusSelect
                      id={notification.id}
                      endpoint="/api/stock-notifications"
                      value={notification.status}
                      options={statuses}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {notifications.length === 0 ? (
            <div className="border-t border-stone/20 p-6 text-sm text-stone">
              No stock notifications yet.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
