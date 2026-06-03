"use client";

import { createBrowserClient } from "@supabase/ssr";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { hasSupabaseConfig } from "@/lib/env";

export function AdminLoginForm() {
  const router = useRouter();
  const supabaseConfigured = hasSupabaseConfig();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = useMemo(() => {
    if (!supabaseConfigured) {
      return null;
    }

    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, [supabaseConfigured]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!supabase) {
      return;
    }

    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  if (!supabaseConfigured) {
    return (
      <div className="space-y-4 border border-stone/40 bg-white p-5 text-sm text-ink shadow-sm">
        <p>Supabase is not configured. Admin runs in local preview mode.</p>
        <Link
          href="/admin"
          className="inline-flex h-9 items-center gap-2 border border-ink bg-ink px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          Open admin
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-stone/40 bg-white p-5 shadow-sm">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-10 w-full border-stone/50 bg-paper px-3 text-sm text-ink focus:border-ink focus:ring-ink"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-10 w-full border-stone/50 bg-paper px-3 text-sm text-ink focus:border-ink focus:ring-ink"
        />
      </div>
      {error ? <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-9 items-center gap-2 border border-ink bg-ink px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Sign in
      </button>
    </form>
  );
}
