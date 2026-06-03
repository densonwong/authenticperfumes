import { createClient } from "@supabase/supabase-js";
import { hasSupabaseConfig } from "@/lib/env";

export function createSupabasePublicClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
