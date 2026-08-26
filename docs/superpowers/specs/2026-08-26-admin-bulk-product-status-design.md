# Admin Bulk Product Status Design

**Date:** 2026-08-26
**Status:** Approved for specification review

## Objective

Remove the long public product description from product-detail layouts, make the admin product list searchable and bulk-editable for approximately 1,400 products, and guarantee that the homepage Ready Stock "Discover More" link opens a Ready Stock-only catalog.

## Scope

### Product detail

- Remove the visible `product.description` paragraph below the concentration and gender.
- Keep the description stored in the database and editable in admin.
- Keep the description available to page metadata, Open Graph metadata, and Product structured data.
- Continue hiding origin and fragrance notes from the public detail page.

### Admin product discovery

- Replace the static product table body with an interactive client-side product manager.
- Add a search field above the table that matches product names and brand names case-insensitively.
- Add an availability filter with three choices: All Products, Ready Stock, and Pre Order.
- Match Ready Stock and Pre Order using the product availability flags used by storefront filtering.
- Filter immediately as the administrator types or changes the status filter.
- Keep the New Product action and individual Edit links.
- Show the number of matching products and the number currently selected.
- Keep the search, availability filter, selection count, and bulk actions above the table; make the table header sticky within its scrolling table container.

### Product selection

- Add a checkbox to every matching product row.
- Add a header checkbox that selects or clears all products matching the current search and availability filter.
- When no search or availability filter is active, Select All selects every loaded database product.
- Preserve selections when the administrator changes search text or filters, so they can assemble a multi-product selection.
- Provide a Clear Selection action.
- Do not include seed/demo products because the admin repository returns database products only.

### Bulk availability actions

- Provide two bulk actions:
  - Set Ready Stock
  - Set Pre Order
- Disable bulk actions when nothing is selected or while a request is running.
- Require browser confirmation that states the target status and number of selected products.
- A Ready Stock update changes each selected product to:
  - `status = ready_stock`
  - `ready_stock = true`
  - `pre_order = false`
  - every related product variant `status = ready_stock`
- A Pre Order update changes each selected product to:
  - `status = pre_order`
  - `ready_stock = false`
  - `pre_order = true`
  - every related product variant `status = pre_order`
- Stock quantities, prices, names, descriptions, images, and all other fields remain unchanged.
- After success, update the affected rows in the client immediately, clear the selection, show a success message, and invalidate product/storefront caches.
- On failure, retain the selection and show the returned error so the administrator can retry.

### Atomic database update

- Add a versioned Supabase migration containing a database function for the bulk availability change.
- The function accepts an array of product UUIDs and the target availability (`ready_stock` or `pre_order`).
- Validate that the target is one of the two allowed values.
- Update products and variants inside the same database transaction so the result cannot be partially applied.
- Return the count of selected products that were updated.
- Call the function only through an authenticated admin API endpoint using the existing Supabase admin client.
- Reject missing IDs, invalid UUIDs, unsupported targets, and excessively large payloads with a clear 400 response.
- A maximum of 2,000 product IDs is sufficient for the current catalog and protects the endpoint from unbounded requests.

### Ready Stock "Discover More"

- Keep the homepage Ready Stock section linked to the localized shop URL with `readyStock=true`.
- Verify that the shop page reads the parameter and excludes products whose `readyStock` flag is false.
- Add regression coverage for localized paths with query strings and/or the shop filtering helper so this behavior is protected.
- Do not alter the Best Seller or New Arrival links.

## Components and Data Flow

1. The server-rendered admin products page authenticates the administrator and loads products with `getAdminProducts()`.
2. It passes the serializable product list to a client-side product manager.
3. Search, availability filtering, and selection happen locally for immediate feedback.
4. A confirmed bulk action posts selected IDs and the target availability to the admin-only bulk endpoint.
5. The endpoint validates input and calls the atomic database function.
6. The endpoint invalidates product caches and returns the updated count.
7. The client updates the matching local rows and reports success without requiring a manual page scroll or reload.

## Error Handling and Safety

- No selection: actions remain disabled.
- Cancelled confirmation: no request is made.
- Invalid IDs or target: return HTTP 400 without database changes.
- Missing Supabase configuration: return a clear service-unavailable response; do not report a fake success for bulk operations.
- Authentication failure: use the existing admin authentication behavior.
- Database failure: return HTTP 500, retain the UI selection, and display the error.
- Partial product/variant updates are prevented by the database function transaction.

## Verification

- Unit-test filtering, Select All semantics, local status updates, request errors, and disabled/loading states.
- Unit-test endpoint payload validation and both target-to-status mappings.
- Run the full test suite, type checking, production build, and diff checks.
- Browser-test the admin manager with representative Ready Stock and Pre Order products.
- Verify search finds a product without scrolling through the full list.
- Verify Select All respects the current search/status filter.
- Verify a successful mocked bulk action updates visible row statuses and selection counts.
- Verify Indonesian and English homepage Ready Stock links include `readyStock=true`.
- Verify the corresponding shop route shows only products whose Ready Stock flag is enabled.
- Verify the public product-detail layout no longer renders its description paragraph.

## Acceptance Criteria

1. Public product details no longer show the long description/ingredients paragraph from the screenshot.
2. Admins can search products by product or brand name and filter by Ready Stock or Pre Order.
3. Admins can select individual products or all products matching the active filters.
4. Admins can atomically change up to 2,000 selected products and all their variants to Ready Stock or Pre Order.
5. Bulk Pre Order turns off Ready Stock and turns on Pre Order without changing stock quantities.
6. Bulk Ready Stock turns on Ready Stock and turns off Pre Order without changing stock quantities.
7. Errors are visible and never clear the current selection.
8. Ready Stock "Discover More" opens a localized Ready Stock-only shop result.
9. Existing individual product editing remains available.
