# Catalog Counts and Read Efficiency Design

## Goal

Keep brand product counts correct after every admin product change while reducing repeated Supabase reads and avoiding the 1,000-row response limit.

## Current Problem

The public and admin brand repositories fetch every product's `brand_id` and count the rows in application memory. Supabase limits a normal response to 1,000 rows, while the live catalog has 1,014 published products. Products beyond that response are omitted from the count, so some brands display zero even though their detail pages contain products.

Several storefront paths also fetch the complete product catalog and filter it in application memory. Dynamic rendering makes those reads recur for visitors, increasing database, network, and rendering work.

## Architecture

Use `brands.product_count` as the canonical denormalized count for published products. PostgreSQL maintains it transactionally through a trigger whenever a product is inserted, deleted, moved between brands, or changes its `published` state. A one-time migration backfills every existing brand from the products table.

Brand list queries then read only the brands table. Product queries accept database filters so a brand detail page fetches only products for its brand. Full-catalog queries that remain necessary use pagination, ensuring they are never silently truncated at 1,000 rows.

Public catalog reads are cached in Next.js with explicit cache tags. Admin create, update, and delete handlers invalidate the affected catalog tags and paths after successful database writes. Admin pages remain uncached and read live data through the service-role client.

## Data Rules

- `product_count` counts only products where `published = true`.
- Product insertion increments the selected brand only when published.
- Product deletion decrements its brand only when it was published.
- Changing `brand_id` moves one count from the old brand to the new brand when published.
- Changing `published` increments or decrements the current brand.
- Counts never depend on product variants, stock, status, or merchandising flags.
- A backfill recalculates all counts, including resetting brands with no published products to zero.

## Query and Cache Boundaries

- Brand directories read `brands.product_count`; they do not scan products.
- Brand detail pages query products with `brand_id = <brand id>` and `published = true`.
- Product lookup by slug queries that slug directly.
- Homepage collections query only their required flags and a display limit.
- Shop data is fetched without silent truncation. Pagination is preferred for the storefront; a paged repository fallback may temporarily preserve the existing filter experience.
- Public cache entries use catalog-specific tags such as `catalog:brands`, `catalog:products`, and affected detail tags.
- Successful admin mutations invalidate relevant tags. Failed or partially failed mutations do not invalidate as if they succeeded.

## Failure Handling

Repository errors must not be treated as an empty live catalog. Existing seed fallback remains available only when live Supabase configuration is absent or when the current application explicitly chooses demo behavior. Database query failures should be surfaced or logged rather than silently showing incorrect counts.

Product creation and its variants should behave atomically where practical. At minimum, if variant creation fails after the product row is created, the handler must remove the incomplete product or report a recoverable consistency error.

## Similar-Risk Audit

Audit every `.from("products")` and `.from("brands")` read for:

- unbounded result sets subject to Supabase's 1,000-row maximum;
- application-side filtering that can be performed by PostgreSQL;
- repeated full-catalog reads during one page render;
- missing cache invalidation after admin mutations;
- fallback behavior that hides database errors;
- counts derived from partial result sets.

The scope includes public catalog repositories, admin CMS repositories, product and brand pages, homepage collections, shop filters, API reads, sitemap generation, and admin mutation routes.

## Verification

- Repository tests prove brand lists use stored counts and brand detail queries are scoped.
- Migration-level SQL tests or executable assertions cover insert, delete, brand move, publish, and unpublish transitions.
- A dataset exceeding 1,000 products returns correct brand counts and complete paged results where required.
- Admin product create, update, and delete tests verify cache invalidation calls.
- Type checking, unit tests, production build, and diff checks pass.
- A read-only live-data check confirms THOO = 5, Til = 1, and TIZIANA TERENZI = 6 after migration.

## Non-Goals

- Replacing Supabase or Next.js.
- Adding a separate cache service such as Redis.
- Real-time browser subscriptions for catalog changes.
- Redesigning the storefront UI.
