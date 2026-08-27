# Complete Collection Homepage Section Design

## Goal

Add a localized editorial call-to-action section to the homepage that guides visitors to the complete fragrance catalog.

## Placement

The section appears immediately after the brand-logo marquee and before the Best Seller product section. This matches the supplied visual reference and creates a clear transition from featured brands to product collections.

## Layout

On large screens, the section uses a three-part horizontal layout:

1. an eyebrow and serif heading;
2. a short supporting description separated by a subtle vertical rule;
3. an outlined call-to-action button with a right arrow.

On small screens, the three parts stack vertically. The separator becomes horizontal or is omitted when it would reduce clarity. The section uses the existing paper, warm, ink, and gold design tokens, restrained borders, and the site's established spacing and typography.

## Copy

### Indonesian

- Eyebrow: `KOLEKSI LENGKAP KAMI`
- Heading: `Jelajahi Seluruh Koleksi Parfum Kami`
- Body: `Temukan seluruh koleksi parfum niche dan desainer dari berbagai merek pilihan dunia.`
- Button: `LIHAT SEMUA PARFUM`

### English

- Eyebrow: `OUR COMPLETE COLLECTION`
- Heading: `Explore Our Complete Fragrance Collection`
- Body: `Discover our complete niche and designer fragrance collection from selected houses around the world.`
- Button: `DISCOVER ALL FRAGRANCES`

The arrow is decorative and rendered separately from the button text so the accessible name remains concise.

## Navigation

The button uses the existing locale-aware path helper and navigates to:

- `/id/shop` from the Indonesian homepage;
- `/en/shop` from the English homepage.

No new API, database field, or dashboard control is required.

## Implementation Boundary

The section will be a focused storefront component so its layout and localization can be tested independently. The homepage owns only its placement and passes the active locale.

## Testing

Automated coverage will verify:

- Indonesian and English copy;
- locale-aware shop destinations;
- the section appears between the brand marquee and Best Seller area;
- no regression to existing homepage sections.

The full test suite, TypeScript check, production build, and final browser verification will run before deployment.

