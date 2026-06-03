import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import xlsx from "xlsx";

const DEFAULT_WORKBOOK = "/Users/tsth/Downloads/Brand parfum a-z final.xlsx";
const DEFAULT_LOGO =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&h=800&q=80";

function loadEnvLocal() {
  const envPath = path.resolve(".env.local");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readBrands(workbookPath) {
  const workbook = xlsx.readFile(workbookPath);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(firstSheet, { header: 1, blankrows: false });
  const rawNames = rows
    .flat()
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .filter((value) => !/^[A-Z]$/.test(value));

  const bySlug = new Map();
  for (const name of rawNames) {
    const baseSlug = slugify(name);
    if (!baseSlug) continue;

    let slug = baseSlug;
    let index = 2;
    while (bySlug.has(slug)) {
      slug = `${baseSlug}-${index}`;
      index += 1;
    }

    bySlug.set(slug, {
      name,
      slug,
      logo_url: DEFAULT_LOGO,
      country: "Unknown",
      founded_year: null,
      description: `${name} fragrances available through Authentic Perfumes.`,
      product_count: 0,
      featured: false,
      published: true
    });
  }

  return [...bySlug.values()];
}

loadEnvLocal();

const dryRun = process.argv.includes("--dry-run");
const workbookPath = process.argv.find((arg) => arg.endsWith(".xlsx")) ?? DEFAULT_WORKBOOK;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!fs.existsSync(workbookPath)) {
  console.error(`Workbook not found: ${workbookPath}`);
  process.exit(1);
}

const brands = readBrands(workbookPath);

if (dryRun) {
  console.log(`Parsed ${brands.length} brands from ${workbookPath}`);
  console.log(`First brand: ${brands[0]?.name ?? "none"}`);
  console.log(`Last brand: ${brands.at(-1)?.name ?? "none"}`);
  process.exit(0);
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add the service-role key to .env.local before importing."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const { error } = await supabase.from("brands").upsert(brands, {
  onConflict: "slug",
  ignoreDuplicates: false
});

if (error) {
  console.error(`Brand import failed: ${error.message}`);
  process.exit(1);
}

console.log(`Imported ${brands.length} brands from ${workbookPath}`);
