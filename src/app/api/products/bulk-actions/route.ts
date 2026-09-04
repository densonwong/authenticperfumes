import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { parseCatalogSelection, type CatalogMutationResult } from "@/lib/catalog-management";
import { invalidateCatalog } from "@/lib/catalog-cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  const input = parseCatalogSelection(await request.json().catch(() => null));
  if ("error" in input) return NextResponse.json(input, { status: 400 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Database service is unavailable." }, { status: 503 });
  const { data: profile, error: profileError } = await supabase.from("profiles")
    .select("role").eq("id", admin.id).maybeSingle();
  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { data, error } = await supabase.rpc("manage_catalog_selection", {
    action: input.action, target_ids: input.ids, preview: input.preview,
    confirmed_empty_products: input.confirmedEmptyProducts
  });
  if (error) {
    const conflict = ["P0001", "P0002"].includes(error.code);
    return NextResponse.json({ error: conflict ? error.message : "Unable to update catalog. Please try again." },
      { status: conflict ? 409 : 500 });
  }
  const result = data as CatalogMutationResult;
  if (!input.preview) invalidateCatalog(["brands", "products"], [
    ...result.slugs.map(slug => `/products/${slug}`),
    ...result.brandSlugs.map(slug => `/brands/${slug}`)
  ]);
  return NextResponse.json(result);
}
