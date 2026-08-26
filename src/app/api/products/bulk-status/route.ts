import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { parseBulkProductStatusPayload } from "@/lib/admin-product-bulk";
import { invalidateCatalog } from "@/lib/catalog-cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  await requireAdmin();
  const parsed = parseBulkProductStatusPayload(await request.json().catch(() => null));

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database service is unavailable." }, { status: 503 });
  }

  const { data, error } = await supabase.rpc("bulk_update_product_availability", {
    product_ids: parsed.ids,
    target_status: parsed.target
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  invalidateCatalog(["products"]);

  return NextResponse.json({ updatedCount: Number(data ?? 0), target: parsed.target });
}
