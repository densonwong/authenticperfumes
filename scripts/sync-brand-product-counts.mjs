import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(path) {
  if (!fs.existsSync(path)) return;

  for (const rawLine of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator < 1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) process.env[key] = value;
  }
}

async function readAllBrands(supabase) {
  const pageSize = 500;
  const brands = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("brands")
      .select("id,name,product_count")
      .order("name")
      .range(from, from + pageSize - 1);

    if (error) throw new Error(`Unable to load brands: ${error.message}`);
    brands.push(...(data ?? []));
    if ((data?.length ?? 0) < pageSize) break;
  }

  return brands;
}

async function syncBrand(supabase, brand) {
  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", brand.id)
    .eq("published", true);

  if (countError) throw new Error(`Unable to count ${brand.name}: ${countError.message}`);
  const nextCount = count ?? 0;

  if (brand.product_count === nextCount) return null;

  const { error: updateError } = await supabase
    .from("brands")
    .update({ product_count: nextCount })
    .eq("id", brand.id);

  if (updateError) throw new Error(`Unable to update ${brand.name}: ${updateError.message}`);
  return { name: brand.name, from: brand.product_count, to: nextCount };
}

async function main() {
  loadEnvFile(".env.local");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const brands = await readAllBrands(supabase);
  const changed = [];
  const concurrency = 10;

  for (let index = 0; index < brands.length; index += concurrency) {
    const batch = brands.slice(index, index + concurrency);
    const results = await Promise.all(batch.map((brand) => syncBrand(supabase, brand)));
    changed.push(...results.filter(Boolean));
  }

  console.log(`Checked ${brands.length} brands; updated ${changed.length}.`);
  changed.forEach((brand) => console.log(`${brand.name}: ${brand.from} -> ${brand.to}`));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
