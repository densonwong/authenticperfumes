# Admin Bulk Product Status Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the public product description, add searchable/selectable bulk Ready Stock and Pre Order management for up to 2,000 admin products, and verify Ready Stock discovery remains correctly filtered.

**Architecture:** Extract bulk-status types, filtering, local result mapping, and payload validation into a pure helper tested with Vitest. A client-side admin manager owns search, filtering, selection, confirmation, and optimistic-after-success row updates; an authenticated API calls one transactional Supabase function that updates products and variants atomically, then invalidates storefront caches.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Supabase/PostgreSQL, Tailwind CSS, Vitest, Testing Library

---

## File Map

- Create `src/lib/admin-product-bulk.ts`: shared admin list types, filtering, result mapping, and API payload validation.
- Create `tests/admin-product-bulk.test.ts`: pure helper coverage for search/filter, selection inputs, validation, and result mapping.
- Create `src/components/admin/product-list-manager.tsx`: searchable product table, availability filter, checkboxes, and bulk actions.
- Create `tests/product-list-manager.test.tsx`: interaction tests for search, Select All, successful updates, and request failures.
- Modify `src/app/(admin)/admin/products/page.tsx`: retain server authentication/data loading and render the client manager.
- Create `src/app/api/products/bulk-status/route.ts`: authenticated validation, transactional RPC call, and cache invalidation.
- Create `supabase/migrations/20260826110000_bulk_product_availability.sql`: atomic product and variant status function.
- Modify `src/app/(localized)/[locale]/(storefront)/products/[slug]/page.tsx`: hide the visual description paragraph only.
- Modify `tests/domain-helpers.test.ts`: protect localized Ready Stock query-string paths.

### Task 1: Bulk Product Domain Helpers

**Files:**
- Create: `tests/admin-product-bulk.test.ts`
- Create: `src/lib/admin-product-bulk.ts`

- [ ] **Step 1: Write failing helper tests**

```ts
import { describe, expect, it } from "vitest";
import {
  applyBulkAvailability,
  filterAdminProductItems,
  parseBulkProductStatusPayload,
  type AdminProductListItem
} from "../src/lib/admin-product-bulk";

const products: AdminProductListItem[] = [
  { id: "11111111-1111-4111-8111-111111111111", name: "Neroli Nasimba", brandName: "Maison Crivelli", status: "ready_stock", readyStock: true, preOrder: false, stock: 2, fromPrice: 0 },
  { id: "22222222-2222-4222-8222-222222222222", name: "Naxos", brandName: "Xerjoff", status: "pre_order", readyStock: false, preOrder: true, stock: 0, fromPrice: 0 }
];

describe("admin bulk product helpers", () => {
  it("searches product and brand names case-insensitively", () => {
    expect(filterAdminProductItems(products, "crivelli", "all").map((item) => item.name)).toEqual(["Neroli Nasimba"]);
    expect(filterAdminProductItems(products, "NAXOS", "all").map((item) => item.name)).toEqual(["Naxos"]);
  });

  it("filters with storefront availability flags", () => {
    expect(filterAdminProductItems(products, "", "ready_stock")).toEqual([products[0]]);
    expect(filterAdminProductItems(products, "", "pre_order")).toEqual([products[1]]);
  });

  it("validates and deduplicates a bulk payload", () => {
    expect(parseBulkProductStatusPayload({ ids: [products[0].id, products[0].id], target: "pre_order" })).toEqual({
      ids: [products[0].id],
      target: "pre_order"
    });
  });

  it("rejects invalid, empty, and oversized payloads", () => {
    expect(parseBulkProductStatusPayload({ ids: [], target: "pre_order" })).toEqual({ error: "Select at least one product." });
    expect(parseBulkProductStatusPayload({ ids: ["not-a-uuid"], target: "ready_stock" })).toEqual({ error: "Every product ID must be a valid UUID." });
    expect(parseBulkProductStatusPayload({ ids: Array.from({ length: 2001 }, (_, index) => `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`), target: "ready_stock" })).toEqual({ error: "You can update at most 2,000 products at once." });
    expect(parseBulkProductStatusPayload({ ids: [products[0].id], target: "out_of_stock" })).toEqual({ error: "Target must be ready_stock or pre_order." });
  });

  it("maps successful status changes without altering stock or price", () => {
    expect(applyBulkAvailability(products, new Set([products[0].id]), "pre_order")[0]).toMatchObject({
      status: "pre_order",
      readyStock: false,
      preOrder: true,
      stock: 2,
      fromPrice: 0
    });
  });
});
```

- [ ] **Step 2: Run the focused test and confirm the missing-module failure**

Run: `npm test -- tests/admin-product-bulk.test.ts`

Expected: FAIL because `src/lib/admin-product-bulk.ts` does not exist.

- [ ] **Step 3: Implement the pure helper**

```ts
import { isUuid } from "@/lib/ids";
import type { ProductStatus } from "@/lib/types";

export type BulkAvailabilityTarget = "ready_stock" | "pre_order";
export type AvailabilityFilter = "all" | BulkAvailabilityTarget;

export type AdminProductListItem = {
  id: string;
  name: string;
  brandName: string;
  status: ProductStatus;
  readyStock: boolean;
  preOrder: boolean;
  stock: number;
  fromPrice: number;
};

export function filterAdminProductItems(items: AdminProductListItem[], query: string, availability: AvailabilityFilter) {
  const normalizedQuery = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesQuery = !normalizedQuery || `${item.name} ${item.brandName}`.toLowerCase().includes(normalizedQuery);
    const matchesAvailability = availability === "all" || (availability === "ready_stock" ? item.readyStock : item.preOrder);
    return matchesQuery && matchesAvailability;
  });
}

export function applyBulkAvailability(items: AdminProductListItem[], ids: Set<string>, target: BulkAvailabilityTarget) {
  return items.map((item) => ids.has(item.id)
    ? { ...item, status: target, readyStock: target === "ready_stock", preOrder: target === "pre_order" }
    : item
  );
}

export function parseBulkProductStatusPayload(body: unknown): { ids: string[]; target: BulkAvailabilityTarget } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Invalid request body." };
  const input = body as { ids?: unknown; target?: unknown };
  if (!Array.isArray(input.ids) || input.ids.length === 0) return { error: "Select at least one product." };
  if (input.ids.length > 2000) return { error: "You can update at most 2,000 products at once." };
  if (input.target !== "ready_stock" && input.target !== "pre_order") return { error: "Target must be ready_stock or pre_order." };
  if (!input.ids.every((id): id is string => typeof id === "string" && isUuid(id))) return { error: "Every product ID must be a valid UUID." };
  return { ids: [...new Set(input.ids)], target: input.target };
}
```

- [ ] **Step 4: Run the focused test and commit**

Run: `npm test -- tests/admin-product-bulk.test.ts`

Expected: PASS with 5 tests.

```bash
git add src/lib/admin-product-bulk.ts tests/admin-product-bulk.test.ts
git commit -m "test: define admin bulk product behavior"
```

### Task 2: Searchable and Selectable Admin Product Manager

**Files:**
- Create: `tests/product-list-manager.test.tsx`
- Create: `src/components/admin/product-list-manager.tsx`
- Modify: `src/app/(admin)/admin/products/page.tsx`

- [ ] **Step 1: Write failing component interaction tests**

Create two representative `AdminProductListItem` fixtures, mock `window.confirm`, and render `ProductListManager`. Assert these exact behaviors:

```tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductListManager } from "../src/components/admin/product-list-manager";
import type { AdminProductListItem } from "../src/lib/admin-product-bulk";

const products: AdminProductListItem[] = [
  { id: "11111111-1111-4111-8111-111111111111", name: "Neroli Nasimba", brandName: "Maison Crivelli", status: "ready_stock", readyStock: true, preOrder: false, stock: 2, fromPrice: 0 },
  { id: "22222222-2222-4222-8222-222222222222", name: "Naxos", brandName: "Xerjoff", status: "pre_order", readyStock: false, preOrder: true, stock: 0, fromPrice: 0 }
];

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("ProductListManager", () => {
  it("searches by brand without scrolling through unrelated rows", () => {
    render(<ProductListManager initialProducts={products} />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Search products" }), { target: { value: "Xerjoff" } });
    expect(screen.getByText("Naxos")).toBeTruthy();
    expect(screen.queryByText("Neroli Nasimba")).toBeNull();
  });

  it("selects all currently filtered products", () => {
    render(<ProductListManager initialProducts={products} />);
    fireEvent.change(screen.getByLabelText("Availability"), { target: { value: "pre_order" } });
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all matching products" }));
    expect(screen.getByText("1 selected")).toBeTruthy();
  });

  it("updates selected rows only after a successful request", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ updatedCount: 1 }) }));
    render(<ProductListManager initialProducts={products} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select Neroli Nasimba" }));
    fireEvent.click(screen.getByRole("button", { name: "Set Pre Order" }));
    await waitFor(() => expect(screen.getByText("1 product updated to Pre Order.")).toBeTruthy());
    expect(screen.getAllByText("pre order").length).toBeGreaterThan(0);
    expect(screen.getByText("0 selected")).toBeTruthy();
  });

  it("retains selection and displays the server error", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Database unavailable." }) }));
    render(<ProductListManager initialProducts={products} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select Neroli Nasimba" }));
    fireEvent.click(screen.getByRole("button", { name: "Set Pre Order" }));
    await waitFor(() => expect(screen.getByText("Database unavailable.")).toBeTruthy());
    expect(screen.getByText("1 selected")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the component test and confirm the missing-component failure**

Run: `npm test -- tests/product-list-manager.test.tsx`

Expected: FAIL because `src/components/admin/product-list-manager.tsx` does not exist.

- [ ] **Step 3: Implement the client manager**

Create a `"use client"` component that:

```ts
export function ProductListManager({ initialProducts }: { initialProducts: AdminProductListItem[] })
```

Use state for `products`, `query`, `availability`, `selectedIds`, `message`, and `isUpdating`. Derive `filteredProducts` with `filterAdminProductItems`. The selection handlers must use these exact semantics:

```ts
function toggleAllMatching() {
  const matchingIds = filteredProducts.map((product) => product.id);
  const allSelected = matchingIds.length > 0 && matchingIds.every((id) => selectedIds.has(id));
  setSelectedIds((current) => {
    const next = new Set(current);
    matchingIds.forEach((id) => allSelected ? next.delete(id) : next.add(id));
    return next;
  });
}
```

The bulk request must confirm the count, post to `/api/products/bulk-status`, update rows only on `response.ok`, retain selection on errors, and format success as singular/plural:

```ts
async function updateAvailability(target: BulkAvailabilityTarget) {
  const ids = [...selectedIds];
  const label = target === "ready_stock" ? "Ready Stock" : "Pre Order";
  if (!ids.length || !window.confirm(`Set ${ids.length} selected product${ids.length === 1 ? "" : "s"} to ${label}?`)) return;
  setIsUpdating(true);
  setMessage(null);
  const updatedIds = new Set(ids);
  try {
    const response = await fetch("/api/products/bulk-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, target })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to update products.");
    setProducts((current) => applyBulkAvailability(current, updatedIds, target));
    setSelectedIds(new Set());
    setMessage(`${result.updatedCount} product${result.updatedCount === 1 ? "" : "s"} updated to ${label}.`);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : "Unable to update products.");
  } finally {
    setIsUpdating(false);
  }
}
```

Render:

- a search input with `type="search"` and `aria-label="Search products"`;
- a native availability `<select aria-label="Availability">` with `all`, `ready_stock`, and `pre_order`;
- matching and selection counts;
- Clear Selection, Set Ready Stock, and Set Pre Order buttons;
- a vertically bounded table container with a sticky header;
- a header checkbox labeled `Select all matching products`;
- a checkbox labeled `Select ${product.name}` in each row;
- the existing product, brand, status, stock, From, and Edit columns;
- an empty-results row when filters match no products.

- [ ] **Step 4: Convert the server page to summary data**

Keep `requireAdmin()` and `getAdminProducts()`. Map products to the client type:

```ts
const items: AdminProductListItem[] = products.map((product) => ({
  id: product.id,
  name: product.name,
  brandName: product.brandName,
  status: product.status,
  readyStock: product.readyStock,
  preOrder: product.preOrder,
  stock: product.variants.reduce((total, variant) => total + variant.stock, 0),
  fromPrice: product.variants[0]?.authenticPrice ?? 0
}));
```

Replace the static table with `<ProductListManager initialProducts={items} />`; keep the page heading and New link unchanged.

- [ ] **Step 5: Run component tests, type-check, and commit**

Run:

```bash
npm test -- tests/product-list-manager.test.tsx tests/admin-product-bulk.test.ts
npm run typecheck
```

Expected: both test files PASS and type checking exits 0.

```bash
git add src/components/admin/product-list-manager.tsx 'src/app/(admin)/admin/products/page.tsx' tests/product-list-manager.test.tsx
git commit -m "feat: add searchable bulk product manager"
```

### Task 3: Atomic Bulk Availability API

**Files:**
- Create: `supabase/migrations/20260826110000_bulk_product_availability.sql`
- Create: `src/app/api/products/bulk-status/route.ts`
- Modify: `tests/admin-product-bulk.test.ts`

- [ ] **Step 1: Add route-oriented validation assertions**

Extend `tests/admin-product-bulk.test.ts` to assert the parser accepts both exact targets and rejects non-array IDs:

```ts
expect(parseBulkProductStatusPayload({ ids: [products[0].id], target: "ready_stock" })).toEqual({ ids: [products[0].id], target: "ready_stock" });
expect(parseBulkProductStatusPayload({ ids: [products[1].id], target: "pre_order" })).toEqual({ ids: [products[1].id], target: "pre_order" });
expect(parseBulkProductStatusPayload({ ids: products[0].id, target: "pre_order" })).toEqual({ error: "Select at least one product." });
```

- [ ] **Step 2: Add the transactional database function**

```sql
create or replace function public.bulk_update_product_availability(
  product_ids uuid[],
  target_status text
)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  updated_count integer;
  normalized_status public.product_status;
begin
  if target_status not in ('ready_stock', 'pre_order') then
    raise exception 'Unsupported availability target';
  end if;

  normalized_status := target_status::public.product_status;

  update public.products
  set
    status = normalized_status,
    ready_stock = target_status = 'ready_stock',
    pre_order = target_status = 'pre_order'
  where id = any(product_ids);

  get diagnostics updated_count = row_count;

  update public.product_variants
  set status = normalized_status
  where product_id = any(product_ids);

  return updated_count;
end;
$$;

revoke all on function public.bulk_update_product_availability(uuid[], text) from public, anon, authenticated;
grant execute on function public.bulk_update_product_availability(uuid[], text) to service_role;
```

- [ ] **Step 3: Add the authenticated bulk route**

Implement `POST` with this control flow:

```ts
export async function POST(request: Request) {
  await requireAdmin();
  const parsed = parseBulkProductStatusPayload(await request.json().catch(() => null));
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Database service is unavailable." }, { status: 503 });

  const { data, error } = await supabase.rpc("bulk_update_product_availability", {
    product_ids: parsed.ids,
    target_status: parsed.target
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  invalidateCatalog(["products"]);
  return NextResponse.json({ updatedCount: Number(data ?? 0), target: parsed.target });
}
```

- [ ] **Step 4: Run focused tests, type-check, and commit**

Run:

```bash
npm test -- tests/admin-product-bulk.test.ts tests/product-list-manager.test.tsx
npm run typecheck
```

Expected: all focused tests PASS and type checking exits 0.

```bash
git add src/app/api/products/bulk-status/route.ts src/lib/admin-product-bulk.ts tests/admin-product-bulk.test.ts supabase/migrations/20260826110000_bulk_product_availability.sql
git commit -m "feat: add atomic bulk availability endpoint"
```

### Task 4: Product Detail and Ready Stock Discovery

**Files:**
- Modify: `src/app/(localized)/[locale]/(storefront)/products/[slug]/page.tsx`
- Modify: `tests/domain-helpers.test.ts`

- [ ] **Step 1: Add the localized Ready Stock path regression assertion**

Add to the existing localized-path test:

```ts
expect(localizedPath("id", "/shop?readyStock=true")).toBe("/id/shop?readyStock=true");
expect(localizedPath("en", "/shop?readyStock=true")).toBe("/en/shop?readyStock=true");
```

- [ ] **Step 2: Run the domain test before layout changes**

Run: `npm test -- tests/domain-helpers.test.ts`

Expected: PASS, documenting that query strings are preserved by the existing path helper.

- [ ] **Step 3: Remove only the visual description paragraph**

Delete this JSX from the product detail layout:

```tsx
<p className="mt-5 text-sm leading-7 text-ink/70">{product.description}</p>
```

Do not remove description usage from `generateMetadata`, Open Graph, or Product JSON-LD.

- [ ] **Step 4: Verify the homepage link and shop filter remain wired**

Confirm the homepage Ready Stock header continues using:

```tsx
href={localizedPath(locale, "/shop?readyStock=true")}
```

Confirm `selectedFrom()` and `filterProducts()` in the shop page continue reading `readyStock` and excluding `!product.readyStock` when it equals `"true"`.

- [ ] **Step 5: Run tests, type-check, and commit**

Run:

```bash
npm test -- tests/domain-helpers.test.ts
npm run typecheck
```

Expected: domain tests PASS and type checking exits 0.

```bash
git add 'src/app/(localized)/[locale]/(storefront)/products/[slug]/page.tsx' tests/domain-helpers.test.ts
git commit -m "fix: simplify product details and protect ready-stock links"
```

### Task 5: Full Verification

**Files:**
- Verify all modified files

- [ ] **Step 1: Run fresh automated verification**

Run:

```bash
npm test
npm run typecheck
npm run build
git diff --check
```

Expected: every command exits 0 and all tests pass.

- [ ] **Step 2: Verify the admin manager in a browser**

Start the built app locally and authenticate to `/admin/products`. Verify:

- searching a unique product or brand immediately reduces visible rows;
- Ready Stock and Pre Order filters show only matching flag values;
- Select All selects all currently matching rows;
- changing filters preserves prior selections;
- Clear Selection resets the count;
- bulk buttons are disabled with no selection;
- cancelling confirmation sends no request;
- a controlled test product can be changed to Pre Order and back to Ready Stock, including its variant status, without changing stock quantity.

- [ ] **Step 3: Verify public storefront behavior**

At desktop and mobile widths, verify:

```text
/id
/en
/id/shop?readyStock=true
/en/shop?readyStock=true
/id/products/<known-slug>
/en/products/<known-slug>
```

Confirm Ready Stock discovery returns only Ready Stock items and the detail page omits the long description while retaining the purchase panel.

- [ ] **Step 4: Review final repository state**

Run:

```bash
git status --short
git diff --check
git log --oneline main..HEAD
```

Expected: the worktree is clean, no whitespace errors exist, and the new commits are present on `codex/storefront-content-filter-updates`.
