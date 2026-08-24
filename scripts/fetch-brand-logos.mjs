/**
 * Pulls real vector wordmarks for the homepage logo wall from Brandfetch and
 * stores them as local SVGs under public/brand-logos/.
 *
 * Why local SVG instead of the catalogue's own logo_url: many uploaded logos
 * are far too small to render sharply (Almost Human is 109x11 after trimming),
 * and a few are product photos rather than logos. An SVG is resolution
 * independent, so the wall stays sharp at any size, and self-hosting keeps the
 * storefront free of a third-party runtime dependency.
 *
 * The Brand API is metered — the free tier is small — so this script is frugal
 * by design: the free search endpoint resolves each brand name to a domain, and
 * only confident matches spend a metered Brand API call. Remaining quota is
 * printed after every call, and --limit caps the spend.
 *
 * Usage:
 *   BRANDFETCH_API_KEY=... BRANDFETCH_CLIENT_ID=... \
 *     node scripts/fetch-brand-logos.mjs --limit 30
 *   node scripts/fetch-brand-logos.mjs --slugs amouage,xerjoff
 *
 * Matches are never trusted blindly: search happily returns a games studio for
 * "Almost Human". The script writes public/_logo-review.html so every logo can
 * be eyeballed before the result is committed.
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const OUTPUT_DIR = "public/brand-logos";
const MAP_FILE = "src/lib/brand-logos.generated.json";
const REVIEW_FILE = "public/_logo-review.html";

// A logo whose search hit scores below this is reported for manual review
// instead of being downloaded.
const MIN_QUALITY_SCORE = 0.5;

// A wordmark has no business being heavier than this. Brandfetch occasionally
// returns a photographic crest (Alexandre J came back as a 355KB PNG), which
// belongs in a product shot, not a logo strip.
const MAX_BYTES = 80_000;

/**
 * Hand-verified domains for brands the search endpoint cannot resolve on name
 * alone. Search is confidently wrong for several of these: it offers Alfred
 * Dunhill for Alfred Ritchy and Puebla Roja for Roja Perfumes, so anything not
 * listed here is left for a human rather than guessed.
 */
const DOMAIN_OVERRIDES = {
  zoologist: "zoologistperfumes.com",
  "toskovat-perfumes": "toskovat.com"
};

/**
 * Brands whose Brandfetch logo cannot be used, verified on the review page.
 * Listing them stops a later run from spending quota on the same dead end.
 *
 * Two failure modes show up. Some domains belong to a different company that
 * happens to share the name. Others return artwork drawn in white: Brandfetch
 * only holds the light-coloured variant, which is invisible on this
 * storefront's paper background. Measuring the share of dark pixels catches
 * those - Nasomatto and Serge Lutens come back at 0%, Toskovat at 3%, against
 * 100% for a usable mark like Amouage.
 */
const WRONG_BRAND = {
  acampora: "acampora.it is Gruppo Acampora, not Bruno Acampora Profumi",
  adar: "adar.com.br is a Brazilian company, not the UAE perfume house",
  accendis: "accendis.nl returns an unrelated blue tech wordmark",
  "adamo-parfum": "adamoparfum.com returns a round icon, not a wordmark",
  "agarthi-scent-core": "agarthi.com logo is low quality and unconfirmed",
  "almost-human": "almosthuman.store is unconfirmed; search also offers a games studio",
  nasomatto: "artwork is entirely white; invisible on a light background",
  "serge-lutens": "artwork is entirely white; invisible on a light background",
  "toskovat-perfumes": "artwork is 3% dark ink; effectively invisible on paper",
  "imaginary-authors": "only a tagline-heavy lockup, unreadable at strip size",
  "room-1015": "no wordmark logo in the index",
  xerjoff: "PNG only, and its background is opaque white with no tRNS chunk"
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
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

function parseArgs(argv) {
  const args = { limit: 30, slugs: null };

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--limit") args.limit = Number(argv[i + 1]);
    if (argv[i] === "--slugs") args.slugs = argv[i + 1]?.split(",").map((s) => s.trim());
  }

  return args;
}

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function readBrands(supabase) {
  const pageSize = 500;
  const brands = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("brands")
      .select("name,slug,product_count")
      .order("product_count", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(`Unable to load brands: ${error.message}`);
    brands.push(...(data ?? []));
    if ((data?.length ?? 0) < pageSize) break;
  }

  return brands;
}

/** Free endpoint: resolves a brand name to candidate domains. */
async function search(name, clientId) {
  const url = new URL(`https://api.brandfetch.io/v2/search/${encodeURIComponent(name)}`);
  url.searchParams.set("c", clientId);

  const response = await fetch(url);
  if (!response.ok) return [];

  const body = await response.json();
  return Array.isArray(body) ? body : [];
}

function pickMatch(brandName, candidates) {
  const target = normalize(brandName);
  const exact = candidates.filter((c) => normalize(c.name ?? "") === target);
  const pool = exact.length > 0 ? exact : candidates;
  const best = pool.sort((a, b) => (b.qualityScore ?? 0) - (a.qualityScore ?? 0))[0];

  if (!best) return { match: null, reason: "no search result" };
  if (normalize(best.name ?? "") !== target) {
    return { match: null, reason: `name mismatch: got "${best.name}"` };
  }
  if ((best.qualityScore ?? 0) < MIN_QUALITY_SCORE) {
    return { match: null, reason: `low quality score ${best.qualityScore?.toFixed(2)}` };
  }

  return { match: best, reason: null };
}

/**
 * Metered endpoint. Returns the wordmark drawn in dark ink, which is the one
 * that reads on this storefront's paper background. Brandfetch's "light" theme
 * means the light-coloured artwork meant for dark backgrounds — asking for it
 * here returns white-on-white logos that render as empty gaps.
 */
async function fetchLogo(domain, apiKey) {
  const response = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  const quota = response.headers.get("x-api-key-quota");

  if (!response.ok) {
    return { error: `brand api ${response.status}`, quota };
  }

  const body = await response.json();
  const wordmarks = (body.logos ?? []).filter((logo) => logo.type === "logo");
  const onLight = wordmarks.find((logo) => logo.theme === "dark") ?? wordmarks[0];

  if (!onLight) return { error: "no wordmark logo", quota };

  const formats = onLight.formats ?? [];
  const format = formats.find((f) => f.format === "svg") ?? formats[0];

  if (!format?.src) return { error: "no downloadable format", quota };

  return { format, quota };
}

/** SVG carries its own geometry, so the aspect never has to be hardcoded. */
function readSvgAspect(svg) {
  const viewBox = svg.match(/viewBox="([\d.\-\s]+)"/)?.[1];
  if (viewBox) {
    const [, , width, height] = viewBox.trim().split(/\s+/).map(Number);
    if (width > 0 && height > 0) return width / height;
  }

  const width = Number(svg.match(/\bwidth="([\d.]+)"/)?.[1]);
  const height = Number(svg.match(/\bheight="([\d.]+)"/)?.[1]);

  return width > 0 && height > 0 ? width / height : null;
}

function writeReviewPage(entries) {
  const cells = entries
    .map(
      (entry) => `<figure><img src="/brand-logos/${entry.file}" alt="${entry.name}">
      <figcaption>${entry.name}<br><small>${entry.domain} - ${entry.aspect.toFixed(
        2
      )}</small></figcaption></figure>`
    )
    .join("");

  fs.writeFileSync(
    REVIEW_FILE,
    `<!doctype html><meta charset=utf-8><title>Logo review</title><style>
body{margin:0;padding:16px;font:12px/1.4 -apple-system,sans-serif;background:#F2F2F0}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px}
figure{margin:0;padding:12px;background:#fff;border:1px solid #e3e0da;text-align:center}
img{height:44px;width:auto;max-width:100%;object-fit:contain}
figcaption{margin-top:10px;color:#555}
</style><div class=g>${cells}</div>`
  );
}

async function main() {
  loadEnvFile(".env.local");

  const apiKey = process.env.BRANDFETCH_API_KEY;
  const clientId = process.env.BRANDFETCH_CLIENT_ID;

  if (!apiKey || !clientId) {
    throw new Error(
      "Set BRANDFETCH_API_KEY and BRANDFETCH_CLIENT_ID (keep them in .env.local, never in committed code)."
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase credentials.");

  const args = parseArgs(process.argv.slice(2));
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
  const allBrands = await readBrands(supabase);

  const brands = args.slugs
    ? allBrands.filter((brand) => args.slugs.includes(brand.slug))
    : allBrands.slice(0, args.limit);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const existing = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, "utf8")) : {};
  const resolved = { ...existing };
  const skipped = [];
  let spent = 0;

  for (const brand of brands) {
    if (resolved[brand.slug]) {
      console.log(`= ${brand.slug} already fetched`);
      continue;
    }

    if (WRONG_BRAND[brand.slug]) {
      skipped.push({ slug: brand.slug, name: brand.name, reason: WRONG_BRAND[brand.slug] });
      console.log(`- ${brand.slug}: ${WRONG_BRAND[brand.slug]}`);
      continue;
    }

    const override = DOMAIN_OVERRIDES[brand.slug];
    const { match, reason } = override
      ? { match: { domain: override, name: brand.name }, reason: null }
      : pickMatch(brand.name, await search(brand.name, clientId));

    if (!match) {
      skipped.push({ slug: brand.slug, name: brand.name, reason });
      console.log(`- ${brand.slug}: ${reason}`);
      continue;
    }

    const { format, quota, error } = await fetchLogo(match.domain, apiKey);
    spent += 1;

    if (error) {
      skipped.push({ slug: brand.slug, name: brand.name, reason: error });
      console.log(`- ${brand.slug}: ${error} (quota left ${quota})`);
      if (error.startsWith("brand api 4")) break;
      continue;
    }

    const assetResponse = await fetch(format.src);
    if (!assetResponse.ok) {
      skipped.push({ slug: brand.slug, name: brand.name, reason: `download ${assetResponse.status}` });
      continue;
    }

    const extension = format.format === "svg" ? "svg" : format.format;
    const file = `${brand.slug}.${extension}`;
    const body = Buffer.from(await assetResponse.arrayBuffer());

    if (body.length > MAX_BYTES) {
      skipped.push({
        slug: brand.slug,
        name: brand.name,
        reason: `${Math.round(body.length / 1024)}KB is too heavy for a wordmark`
      });
      continue;
    }

    fs.writeFileSync(path.join(OUTPUT_DIR, file), body);

    const aspect =
      extension === "svg"
        ? readSvgAspect(body.toString("utf8"))
        : format.width / format.height;

    if (!aspect) {
      skipped.push({ slug: brand.slug, name: brand.name, reason: "unreadable geometry" });
      fs.rmSync(path.join(OUTPUT_DIR, file));
      continue;
    }

    resolved[brand.slug] = {
      name: brand.name,
      domain: match.domain,
      file,
      aspect: Number(aspect.toFixed(3)),
      bytes: body.length
    };

    console.log(
      `+ ${brand.slug}: ${extension} ${aspect.toFixed(2)} aspect, ${body.length}b (quota left ${quota})`
    );
  }

  // Prune anything an earlier run accepted before the weight guard existed.
  for (const [slug, entry] of Object.entries(resolved)) {
    if (entry.bytes <= MAX_BYTES) continue;

    const stale = path.join(OUTPUT_DIR, entry.file);
    if (fs.existsSync(stale)) fs.rmSync(stale);
    delete resolved[slug];
    console.log(`- ${slug}: dropped, ${Math.round(entry.bytes / 1024)}KB is too heavy`);
  }

  const ordered = Object.fromEntries(Object.entries(resolved).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(MAP_FILE, `${JSON.stringify(ordered, null, 2)}\n`);
  writeReviewPage(Object.entries(ordered).map(([slug, entry]) => ({ slug, ...entry })));

  console.log(
    `\n${Object.keys(ordered).length} logos in ${MAP_FILE} | ${spent} metered calls this run | ${skipped.length} skipped`
  );
  if (skipped.length > 0) {
    console.log("Skipped (needs a manual logo or a hand-picked domain):");
    for (const item of skipped) console.log(`  ${item.slug}: ${item.reason}`);
  }
  console.log(`\nReview them at /_logo-review.html before committing.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
