# Storefront Content and Filter Updates Design

**Date:** 2026-08-26
**Status:** Approved for specification review

## Objective

Update the Authentic Perfumes8 storefront content and navigation to match the supplied Indonesian copy, provide equivalent English copy, simplify the contact and testimonial pages, and improve the shop filter experience without changing the database or admin workflows.

## Scope

### Contact page

- Replace the Indonesian heading and introduction with the approved contact copy.
- Add an equivalent English translation.
- Keep only the WhatsApp and Instagram contact cards, using the supplied descriptions and the existing external links.
- Remove the "Ship to All Indonesia" contact card.
- Remove the entire "Detail request WhatsApp" information panel.
- Let the fragrance request form occupy the available content width.
- Use sentence-style capitalization for the request heading and all field labels in both locales.

### Testimonials

- Show only the customer photo, customer name, and testimonial comment on storefront testimonial cards.
- Hide the perfume/product name from both the card and the enlarged-photo dialog.
- Preserve the existing product-name data and admin management fields so no testimonial data is lost.

### Home request section

- Replace the Indonesian request paragraph with: "Kirim brand, varian parfum, dan ukuran yang diinginkan. Kami akan mengonfirmasi ketersediaan, estimasi harga, dan opsi pemesanan melalui WhatsApp."
- Add an English translation with the same meaning.

### Pre-order page

- Replace the pre-order introduction with the supplied Indonesian wording and a matching English translation.
- Replace the process list with the supplied four steps.
- Rename "Kebijakan refund" to "Kebijakan Pembayaran" and replace its contents with the supplied four payment-policy items.
- Update the shipping description with the supplied wording.
- Replace the existing payment and brief terms cards with a readable terms-and-conditions section containing these groups:
  - Ready Stock
  - Pre-Order (PO)
  - Kebijakan Pembayaran
  - Pelunasan
  - Estimasi Pre-Order
  - Pengiriman Pesanan
- Preserve the current pre-order product list below the policy content.
- Keep the existing WhatsApp pre-order action.
- Update structured FAQ data so it reflects the new process and payment policy.

### Navigation

- Remove the standalone "REQ FRAGRANCE" item from desktop and mobile navigation.
- Remove "REQ PERFUME" from the Perfumes dropdown on desktop and mobile.
- Keep the remaining links and order unchanged.

### Shop filters

- On desktop, constrain the sticky filter panel to the available viewport height below the sticky header.
- Give the filter panel its own vertical scrolling area so its lower controls can be reached without scrolling the entire product page.
- Keep the existing mobile flow unchanged unless required to prevent overflow.
- Sort size options numerically from smallest to largest after normalizing decimal commas and recognizing common volume units.
- Place values that do not represent a volume, such as perfume blotter bundles, after numeric volume sizes and sort those fallback values naturally.
- Preserve the exact original option labels and selected query values.

## Implementation Boundaries

- No database migration.
- No removal of testimonial product-name fields from API, repository, schema, or admin pages.
- No new CMS fields.
- No redesign outside the requested sections.
- Existing WhatsApp destinations and product filtering behavior remain unchanged.

## Verification

- Run the relevant automated test suite, lint, type checking when available, and production build.
- Add focused tests for size ordering if the sorting helper is extracted into a testable module.
- Verify that all request navigation items are absent from desktop and mobile markup.
- Verify Indonesian and English content paths render successfully.
- Inspect contact, testimonials, home, pre-order, and shop pages at desktop and mobile widths.
- Confirm the desktop filter panel scrolls independently and its final apply button remains reachable.

## Acceptance Criteria

1. All supplied Indonesian copy appears in the intended storefront sections with equivalent English copy.
2. Contact displays two contact methods and no WhatsApp detail panel.
3. Storefront testimonials show no perfume type or product name.
4. Neither desktop nor mobile navigation contains a fragrance-request item.
5. The desktop filter panel scrolls independently within the viewport.
6. Size choices are ordered from smallest to largest, with non-volume choices after volume choices.
7. Existing admin and data-management behavior continues to work.
8. Automated checks and the production build pass.
