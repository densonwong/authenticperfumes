import { requireAdmin } from "@/lib/admin-auth";

type WorkflowStatus = "new" | "in_progress" | "fulfilled" | "closed";

const statuses: WorkflowStatus[] = ["new", "in_progress", "fulfilled", "closed"];

const requests = [
  {
    id: "request-naxos-1861",
    customer: "Aditya P.",
    contact: "+62 812 3300 1861",
    fragrance: "Xerjoff Naxos 100ml",
    budget: "IDR3.8m - IDR4.2m",
    status: "new" as WorkflowStatus
  },
  {
    id: "request-ganymede",
    customer: "Mira K.",
    contact: "+62 811 4400 221",
    fragrance: "Marc-Antoine Barrois Ganymede",
    budget: "Open",
    status: "in_progress" as WorkflowStatus
  },
  {
    id: "request-grand-soir",
    customer: "Felix T.",
    contact: "+62 878 1200 908",
    fragrance: "MFK Grand Soir",
    budget: "Below IDR4m",
    status: "fulfilled" as WorkflowStatus
  }
];

export default async function AdminRequestsPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <div className="border border-stone/30 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</p>
          <h1 className="mt-1 text-xl font-semibold">Fragrance requests</h1>
        </div>
        <div className="overflow-x-auto border border-stone/30 bg-white">
          <table className="min-w-full divide-y divide-stone/20 text-sm">
            <thead className="bg-warm/70 text-left text-xs font-semibold uppercase tracking-[0.12em] text-stone">
              <tr>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Fragrance</th>
                <th className="px-3 py-3">Budget</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/20">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-3 py-3 font-semibold">{request.customer}</td>
                  <td className="px-3 py-3 text-stone">{request.contact}</td>
                  <td className="px-3 py-3">{request.fragrance}</td>
                  <td className="px-3 py-3">{request.budget}</td>
                  <td className="px-3 py-3">
                    <select defaultValue={request.status} className="min-w-36 border-stone/40 text-sm">
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
