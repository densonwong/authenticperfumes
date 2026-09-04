import type { SupabaseClient } from "@supabase/supabase-js";

export async function syncBrandProductCounts(
  supabase: SupabaseClient,
  brandIds: Array<string | null | undefined>
) {
  const uniqueBrandIds = [...new Set(brandIds.filter((id): id is string => Boolean(id)))];

  await Promise.all(
    uniqueBrandIds.map(async (brandId) => {
      const { count, error: countError } = await supabase
        .from("products")
        .select("id,product_variants!inner(id)", { count: "exact", head: true })
        .eq("brand_id", brandId)
        .eq("published", true);

      if (countError) {
        throw new Error(`Unable to count products for brand ${brandId}: ${countError.message}`);
      }

      const { error: updateError } = await supabase
        .from("brands")
        .update({ product_count: count ?? 0 })
        .eq("id", brandId);

      if (updateError) {
        throw new Error(`Unable to update product count for brand ${brandId}: ${updateError.message}`);
      }
    })
  );
}
