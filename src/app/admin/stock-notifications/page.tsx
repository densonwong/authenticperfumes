import { requireAdmin } from "@/lib/admin-auth";

type WorkflowStatus = "new" | "in_progress" | "fulfilled" | "closed";

const statuses: WorkflowStatus[] = ["new", "in_progress", "fulfilled", "closed"];

const notifications = [
  {
    id: "notify-side-effect",
    customer: "Jessica L.",
    contact: "jessica@example.com",
    product: "Initio Side Effect 90ml",
    variant: "90ml",
    status: "new" as WorkflowStatus
  },
  {
    id: "notify-reflection-man",
    customer: "Rafi H.",
    contact: "+62 821 4567 0099",
    product: "Amouage Reflection Man",
    variant: "100ml",
    status: "in_progress" as WorkflowStatus
  },
  {
    id: "notify-portrait",
    customer: "Nadine S.",
    contact: "nadine@example.com",
    product: "Frederic Malle Portrait of a Lady",
    variant: "100ml",
    status: "closed" as WorkflowStatus
  }
];

export default async function AdminStockNotificationsPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <div className="border border-stone/30 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</p>
          <h1 className="mt-1 text-xl font-semibold">Stock notifications</h1>
        </div>
        <div className="overflow-x-auto border border-stone/30 bg-white">
          <table className="min-w-full divide-y divide-stone/20 text-sm">
            <thead className="bg-warm/70 text-left text-xs font-semibold uppercase tracking-[0.12em] text-stone">
              <tr>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">Variant</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/20">
              {notifications.map((notification) => (
                <tr key={notification.id}>
                  <td className="px-3 py-3 font-semibold">{notification.customer}</td>
                  <td className="px-3 py-3 text-stone">{notification.contact}</td>
                  <td className="px-3 py-3">{notification.product}</td>
                  <td className="px-3 py-3">{notification.variant}</td>
                  <td className="px-3 py-3">
                    <select defaultValue={notification.status} className="min-w-36 border-stone/40 text-sm">
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
