type AdminShellProps = {
  admin: {
    email: string;
  };
};

const dashboardStats = [
  { label: "Catalog sections", value: "7" },
  { label: "CMS areas", value: "6" },
  { label: "Upload mode", value: "Cloudinary" }
];

export function AdminShell({ admin }: AdminShellProps) {
  return (
    <main className="min-h-screen px-8 py-9 text-ink">
      <section className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-ink/65">
            Manage catalog content, merchandising, customer requests, and back-in-stock interest.
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">
            Signed in as {admin.email}
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          {dashboardStats.map((stat) => (
            <div key={stat.label} className="border border-ink/10 bg-warm p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/55">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold text-ink">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="border border-ink/10 bg-warm p-5">
          <h2 className="text-sm font-semibold text-ink">Next workflow</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
            Use the sidebar to add products, update stock and variants, upload images to Cloudinary,
            manage brands, and review customer requests.
          </p>
        </section>
      </section>
    </main>
  );
}
