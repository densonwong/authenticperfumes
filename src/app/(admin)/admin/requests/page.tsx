import Link from "next/link";
import { StatusSelect } from "@/components/admin/status-select";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminFragranceRequests } from "@/lib/repositories/admin-cms";
import type { RequestStatus } from "@/lib/types";

const statuses: RequestStatus[] = ["new", "in_review", "sourced", "closed"];

export default async function AdminRequestsPage() {
  await requireAdmin();
  const requests = await getAdminFragranceRequests();

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink lg:px-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <div className="border border-stone/30 bg-white p-4">
          <Link href="/admin" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</Link>
          <h1 className="mt-1 text-xl font-semibold">Fragrance requests</h1>
        </div>
        <div className="overflow-x-auto border border-stone/30 bg-white">
          <table className="min-w-full divide-y divide-stone/20 text-sm">
            <thead className="bg-warm/70 text-left text-xs font-semibold uppercase tracking-[0.12em] text-stone">
              <tr>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Fragrance</th>
                <th className="px-3 py-3">Notes</th>
                <th className="px-3 py-3">Created</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/20">
              {requests.map((request) => {
                const contact = request.email ?? request.phone;

                return (
                  <tr key={request.id} className="align-top">
                    <td className="px-3 py-3 font-semibold">{request.customerName}</td>
                    <td className="px-3 py-3 text-stone">{contact}</td>
                    <td className="px-3 py-3">{request.requestedFragrance}</td>
                    <td className="max-w-xs px-3 py-3 text-stone">{request.notes ?? "-"}</td>
                    <td className="px-3 py-3 text-stone">
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      }).format(new Date(request.createdAt))}
                    </td>
                    <td className="px-3 py-3">
                      <StatusSelect
                        id={request.id}
                        endpoint="/api/fragrance-requests"
                        value={request.status}
                        options={statuses}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {requests.length === 0 ? (
            <div className="border-t border-stone/20 p-6 text-sm text-stone">
              No fragrance requests yet.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
