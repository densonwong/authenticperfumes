# Catalog Counts and Read Efficiency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep brand counts correct after admin mutations and eliminate silent 1,000-row truncation while reducing repeated public catalog reads.

**Architecture:** PostgreSQL maintains `brands.product_count` for published products, while application mutation handlers also resynchronize affected counts so existing deployments remain correct before the migration is applied. Public repository results use tagged Next.js data caches; mutations invalidate the appropriate tags. Large product reads paginate, and detail reads filter at the database.

**Tech Stack:** Next.js 15 App Router, TypeScript, Supabase/PostgreSQL, Vitest

---

### Task 1: Database count invariant

**Files:**
- Create: `supabase/migrations/20260729000000_sync_brand_product_counts.sql`
- Modify: `supabase/schema.sql`

- [x] **Step 1: Add the SQL trigger migration**

Create a `sync_brand_product_count()` trigger function that handles published inserts, deletes, `brand_id` changes, and `published` changes. Recalculate all current counts before enabling the trigger.

- [x] **Step 2: Mirror the trigger in the canonical schema**

Add the same function, trigger, and backfill statement to `supabase/schema.sql` after the product indexes.

- [x] **Step 3: Validate SQL structure**

Run `rg -n "sync_brand_product_count|products_sync_brand_product_count|update public.brands" supabase` and `git diff --check`.

Expected: migration and canonical schema both contain the invariant; diff check exits 0.

### Task 2: Repository reads without truncation

**Files:**
- Modify: `src/lib/repositories/catalog.ts`
- Modify: `src/lib/repositories/admin-cms.ts`
- Modify: `src/app/(storefront)/brands/[slug]/page.tsx`
- Test: `tests/catalog-repository.test.ts`

- [x] **Step 1: Write failing repository tests**

Add tests for seed-mode `getProductsByBrandId()` and verify known products remain addressable by direct slug lookup.

- [x] **Step 2: Run the repository test to verify failure**

Run `npm test -- tests/catalog-repository.test.ts`.

Expected: fail because `getProductsByBrandId` does not exist.

- [x] **Step 3: Implement scoped and paginated reads**

Make brand lists trust `product_count`. Add a reusable paged product reader using `.range(from, to)` with pages below Supabase's 1,000-row response cap. Implement direct product-by-slug and product-by-brand queries. Apply pagination to admin product reads as well.

- [x] **Step 4: Use the scoped brand product query**

Change the brand detail page to call `getProductsByBrandId(brand.id)` instead of loading every product and filtering in memory.

- [x] **Step 5: Run repository tests**

Run `npm test -- tests/catalog-repository.test.ts`.

Expected: all catalog repository tests pass.

### Task 3: Cache and mutation synchronization

**Files:**
- Create: `src/lib/catalog-cache.ts`
- Create: `src/lib/repositories/brand-counts.ts`
- Modify: `src/lib/repositories/catalog.ts`
- Modify: `src/app/api/products/route.ts`
- Modify: `src/app/api/products/[id]/route.ts`
- Modify: `src/app/api/brands/route.ts`
- Modify: `src/app/api/brands/[id]/route.ts`

- [x] **Step 1: Define cache tags and one invalidation helper**

Export stable brand/product cache tags and an `invalidateCatalog()` helper that calls `revalidateTag` and the relevant public/admin paths.

- [x] **Step 2: Cache public repository reads**

Wrap live brand and product reads with `unstable_cache`, using separate tags so product mutations invalidate both products and derived brand displays.

- [x] **Step 3: Add exact affected-brand resynchronization**

Implement `syncBrandProductCounts(supabase, brandIds)` using exact `head: true` published-product counts and `brands.product_count` updates. It must deduplicate IDs and throw on either count or update failure.

- [x] **Step 4: Update product mutations**

After successful create, update, or delete operations, synchronize all affected old/new brand IDs and invalidate catalog cache. Fetch old product identity before update/delete. If variant insertion fails during create, delete the incomplete product.

- [x] **Step 5: Update brand mutations**

Ignore manual product-count input for new brands, setting zero. Invalidate the brands cache after successful create, update, or delete.

- [x] **Step 6: Run tests and typecheck**

Run `npm test` and `npm run typecheck`.

Expected: both commands exit 0.

### Task 4: Live backfill and full verification

**Files:**
- Create: `scripts/sync-brand-product-counts.mjs`
- Modify: `package.json`
- Modify: `README.md`

- [x] **Step 1: Add an idempotent maintenance script**

Read all brands in pages, request exact published-product counts per brand, update changed counters, and print only a summary plus changed brand names. Load `.env.local` without printing credentials.

- [x] **Step 2: Expose and document the command**

Add `catalog:sync-counts` to package scripts and document that the SQL migration is the canonical invariant while this command is a safe repair/backfill utility.

- [x] **Step 3: Run the live backfill**

Run `npm run catalog:sync-counts`.

Expected: stored counts match exact published counts for THOO, Til, and TIZIANA TERENZI; rerunning reports zero changes.

- [x] **Step 4: Run final verification**

Run `npm test`, `npm run typecheck`, `npm run build`, and `git diff --check`.

Expected: all commands exit 0.

- [x] **Step 5: Review and commit**

Inspect `git diff`, verify no credentials or unrelated changes, then commit the implementation with a focused fix message.
