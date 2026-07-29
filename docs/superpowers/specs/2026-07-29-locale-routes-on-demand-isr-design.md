# Locale Routes and On-Demand ISR Design

## Goal

Serve Indonesian and English storefront pages from Vercel's CDN without prebuilding every product and brand during deployment and without invoking a rendering function on every repeat visit.

## URL Model

All public storefront pages use an explicit locale prefix:

- Indonesian: `/id`, `/id/products/<slug>`, `/id/brands/<slug>`
- English: `/en`, `/en/products/<slug>`, `/en/brands/<slug>`

The locale is restricted to `id` or `en`; unsupported locale segments return `notFound()`. Existing unprefixed storefront URLs permanently redirect to the equivalent Indonesian URL. Redirects preserve product and brand slugs and relevant query strings where supported.

Canonical and alternate metadata identify both localized versions. Indonesian is the default (`x-default`) version. The sitemap contains localized public URLs rather than the old unprefixed URLs.

## Rendering Architecture

Public pages that show shared catalog content use static rendering and Incremental Static Regeneration (ISR). Product and brand detail routes return no slug values from `generateStaticParams`, so deployments do not render every catalog record. The first request to a valid slug renders the page and stores the response in the CDN; repeat requests use that cached response until invalidated.

The locale segment itself is statically known (`id` and `en`). Public layouts and pages derive their dictionary from the locale route parameter, not a cookie. This removes the request-time cookie dependency that currently forces all storefront pages to render dynamically.

The following remain dynamic by design:

- `/id/shop` and `/en/shop` when server-side URL filters are used;
- admin pages and authentication;
- mutation and form APIs;
- any page that genuinely consumes request-specific data.

Static catalog pages include home, brand directory, product detail, brand detail, new arrivals, best sellers, pre-order, testimonials, about, and contact where their current behavior permits static rendering.

## Layout Structure

The application uses multiple root layouts so each localized document can emit the correct `<html lang>` value without cookies:

- a localized storefront root layout under a locale segment;
- an admin root layout for `/admin`;
- route handlers remain outside layout rendering.

Shared fonts, metadata helpers, analytics, and global styles are extracted into reusable modules where necessary so the two root layouts remain consistent without duplicating configuration.

## Language Toggle

The language toggle becomes a normal localized link. It replaces only the leading `/id` or `/en` segment and preserves the rest of the path plus query parameters. Switching language therefore navigates to a cacheable URL and remains shareable, indexable, and browser-history friendly. No locale cookie is required for rendering.

## Data and Cache Flow

1. A visitor requests `/en/products/example`.
2. Vercel serves the stored ISR response if present.
3. On a cache miss, Next.js renders once using cached repository data and stores the completed response.
4. An admin product mutation updates Supabase and synchronizes the affected brand counter.
5. The mutation invalidates catalog data tags and both `/id/...` and `/en/...` page paths affected by the change.
6. The next request regenerates only those invalidated pages.

Existing paginated Supabase repository reads, stored product counts, and cache tags remain in use. ISR caches complete page responses; repository caching separately reduces database work during regeneration and dynamic shop requests.

## Redirect and SEO Rules

- `/` redirects permanently to `/id`.
- Existing storefront paths such as `/products/:slug`, `/brands/:slug`, `/shop`, and content pages redirect permanently to `/id/...`.
- Admin and API URLs are never locale-prefixed.
- Canonicals point to the current localized URL.
- `alternates.languages` provides `id-ID`, `en`, and `x-default` links.
- JSON-LD URLs use the current locale path.
- The sitemap lists both localized versions of indexable public pages.

## Error Handling

- Invalid locale values return 404 rather than falling back silently.
- Unknown product and brand slugs return 404 in both languages.
- Redirect loops are prevented by matching only unprefixed legacy paths.
- Cache invalidation failures are surfaced from admin mutations rather than reporting a fully successful update.
- Locale switching preserves the current localized route whenever that route exists.

## Testing and Verification

- Locale utilities validate `id` and `en`, build localized paths, and replace locale prefixes while preserving query strings.
- Rendering tests verify Indonesian and English dictionaries are selected from route parameters without reading cookies.
- Redirect configuration tests cover home, product, brand, shop, and content paths.
- Admin mutation tests or assertions verify both locale paths are invalidated.
- Repository tests continue covering counts and scoped catalog reads.
- `npm test`, type checking, and production build pass.
- Build output does not enumerate every product or brand slug and marks cacheable localized detail routes as static/ISR rather than dynamic functions.
- After deployment, a first request produces a cache miss and a repeat request produces a CDN hit for the same product URL.

## Cost Characteristics

- Deployment work stays nearly constant as the catalog grows because product and brand detail pages are not prebuilt.
- Each localized detail page incurs rendering work only on its first request after creation or invalidation.
- Repeat visits are CDN responses and do not render the page again.
- Each product may have two cached documents, one per language.
- Dynamic shop searches continue to use function invocations because their result is request-specific.

## Non-Goals

- Translating product names or database-authored descriptions that currently have only one stored value.
- Redesigning the storefront UI.
- Changing admin or API URL structures.
- Adding middleware solely for locale detection.
- Adding Redis or a separate caching service.
