# Indonesian Storefront Localization Design

## Goal

Make every storefront-owned interface and marketing string on `/id` read naturally in Indonesian while preserving original catalog and customer-authored content.

## Scope

The Indonesian locale must translate storefront-controlled copy across:

- announcement bar, desktop/mobile navigation, perfume dropdown, and footer;
- homepage section headings, links, banners, trust strip, consultation block, and request block;
- shop headings, filters, status labels, gender labels, empty states, and price fallbacks;
- product detail controls, availability copy, forms, and accessibility labels;
- brand directory, brand detail interface labels, collection pages, contact, pre-order, about, and testimonials;
- page titles, descriptions, breadcrumbs, and other locale-owned SEO text.

The standalone `REQ FRAGRANCE` navigation label remains unchanged because it is an explicitly approved brand/navigation label.

## Content That Remains Original

The application must not translate content owned by the catalog or customers:

- brand names;
- perfume names;
- fragrance concentrations such as `Eau de Parfum`;
- brand descriptions and country/origin data from the database;
- testimonial comments and customer names;
- SKU values, sizes, prices, and other product data.

These values may be English or another language on `/id` because they are source content rather than interface copy.

## Architecture

The existing `Dictionary` in `src/lib/i18n.ts` remains the source of truth for reusable storefront copy. Missing reusable labels will be added to the dictionary instead of being repeated as locale conditionals.

Page-specific long-form copy may continue using an explicit `locale === "id"` branch when the text only appears once. Shared components that currently contain English literals will receive the locale or translated labels they need. No runtime translation service will be introduced.

## Component Changes

### Navigation and Global Chrome

- Localize Indonesian homepage and perfume navigation labels.
- Keep `REQ FRAGRANCE` unchanged and outside the Perfumes dropdown.
- Localize footer headings, links, navigation labels, and store-guarantee accessibility text.
- Localize slider and testimonial dialog accessibility labels.

### Homepage and Collection Pages

- Replace English promotional phrases in the Indonesian dictionary with natural Indonesian equivalents.
- Localize Indonesian banner titles and promotional calls to action.
- Localize collection-page headings and metadata without altering product data.

### Shop and Product Detail

- Localize filter gender and availability labels using locale-aware data.
- Localize the no-price fallback and product availability interface.
- Localize gender presentation on product detail pages while preserving concentration names.
- Preserve numeric size sorting and independently scrollable desktop filters.

### Forms and Calls to Action

- Localize request and notification labels, submission states, fallbacks, and CTA buttons.
- Preserve the Indonesian WhatsApp message behavior.

### Editorial Pages

- Localize interface and marketing copy on About, Contact, Pre-Order, Brands, and Testimonials.
- Preserve testimonial quotes and database brand descriptions in their original language.

## Testing

Automated regression coverage will:

- assert approved Indonesian dictionary values for known localization leaks;
- render locale-aware shared components and verify Indonesian labels;
- verify the standalone `REQ FRAGRANCE` link remains present and the dropdown does not regain `REQ PERFUME`;
- verify English locale values remain unchanged;
- run the full test suite, TypeScript check, production build, and whitespace validation.

## Live Verification

After deployment, the `/id` storefront will be checked across the homepage, shop, a product detail page, brands, new arrivals, best sellers, contact, pre-order, testimonials, and about pages.

Verification will distinguish storefront copy from original database content. A page passes when no known English interface phrase remains, while approved original names, descriptions, and customer comments are unchanged.

