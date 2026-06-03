type AdminShellProps = {
  admin: {
    email: string;
  };
};

const dashboardStats = [
  { label: "Catalog sections", value: "9" },
  { label: "CMS areas", value: "8" },
  { label: "Upload mode", value: "Cloudinary" }
];

export function AdminShell({ admin }: AdminShellProps) {
  return (
    <main className="min-h-screen px-8 py-9 text-[#1f3168]">
      <section className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-semibold text-[#27366f]">Dashboard</h1>
          <p className="text-sm text-[#667695]">
            Manage catalog content, merchandising, customer requests, and back-in-stock interest.
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667695]">
            Signed in as {admin.email}
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          {dashboardStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#d9e2ef] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667695]">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold text-[#27366f]">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-[#d9e2ef] bg-white p-5">
          <h2 className="text-sm font-semibold text-[#27366f]">Next workflow</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667695]">
            Use the sidebar to add products, update stock and variants, upload images to Cloudinary,
            manage brands, and review customer requests.
          </p>
        </section>
      </section>
    </main>
  );
}
