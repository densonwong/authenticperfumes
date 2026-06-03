import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-10 text-ink">
      <div className="w-full max-w-sm space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-stone">Access the Authentic Perfumes operations console.</p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
