# Locale Routes and On-Demand ISR Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve Indonesian and English storefront pages from locale URLs with on-demand ISR, while keeping admin/API routes unchanged and eliminating per-visit rendering for repeat catalog visits.

**Architecture:** Public pages move beneath a validated `[locale]` segment and use route parameters instead of cookies. Separate localized and admin root layouts provide correct document language. Product and brand details use empty `generateStaticParams` results plus static rendering so the first request populates the CDN; admin mutations invalidate both locale variants.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Supabase, Vitest, Vercel ISR

---

### Task 1: Locale and path primitives

**Files:**
- Modify: `src/lib/i18n.ts`
- Create: `src/lib/localized-paths.ts`
- Modify: `tests/domain-helpers.test.ts`

- [x] **Step 1: Write failing tests**

Add assertions covering valid locales, invalid locale rejection, internal-path prefixing, locale-prefix replacement, query/hash preservation, and external URL passthrough:

```ts
expect(isLocale("id")).toBe(true);
expect(isLocale("fr")).toBe(false);
expect(localizedPath("en", "/products/test?variant=1#buy")).toBe("/en/products/test?variant=1#buy");
expect(localizedPath("id", "https://wa.me/1")).toBe("https://wa.me/1");
expect(switchLocalePath("/id/brands/test?q=x", "en")).toBe("/en/brands/test?q=x");
```

- [x] **Step 2: Run the focused test and confirm failure**

Run `npm test -- tests/domain-helpers.test.ts`.

Expected: failure because the locale helpers are not exported.

- [x] **Step 3: Implement locale primitives**

In `i18n.ts`, remove cookie access and export `locales`, `Locale`, and `isLocale`. In `localized-paths.ts`, implement:

```ts
export function localizedPath(locale: Locale, href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (/^\/(id|en)(?:\/|$)/.test(href)) return href.replace(/^\/(id|en)(?=\/|$)/, `/${locale}`);
  return `/${locale}${href === "/" ? "" : href}`;
}

export function switchLocalePath(href: string, locale: Locale) {
  return /^\/(id|en)(?:\/|$)/.test(href)
    ? href.replace(/^\/(id|en)(?=\/|$)/, `/${locale}`)
    : localizedPath(locale, href);
}
```

- [x] **Step 4: Run the focused test**

Run `npm test -- tests/domain-helpers.test.ts`.

Expected: all domain helper tests pass.

### Task 2: Locale-aware root layouts and routes

**Files:**
- Move: `src/app/(storefront)/**` to `src/app/(localized)/[locale]/**`
- Move: `src/app/admin/**` to `src/app/(admin)/admin/**`
- Create: `src/app/(admin)/layout.tsx`
- Modify: `src/app/(localized)/[locale]/layout.tsx`
- Delete: `src/app/layout.tsx`
- Delete: `src/app/[slug]/page.tsx`
- Modify: `next.config.ts`
- Create: `src/lib/site-document.ts`

- [x] **Step 1: Extract shared document configuration**

Move font instances and shared site metadata from the old root layout into `site-document.ts`. Export `documentClassName` and `siteMetadata` for both root layouts.

- [x] **Step 2: Create multiple root layouts**

The localized root layout validates `params.locale`, renders `<html lang={locale}>`, selects the dictionary directly, and includes the storefront shell. The admin root renders `<html lang="en">`, global styles, fonts, analytics, and its children. Keep the existing `admin/layout.tsx` as the nested admin frame.

- [x] **Step 3: Move public and admin route trees**

Move files without changing URL-visible route group names. Public routes become `/:locale/...`; admin remains `/admin/...`. Delete the obsolete short-product redirect page because redirects move to configuration.

- [x] **Step 4: Add permanent legacy redirects**

Add `redirects()` in `next.config.ts` for `/`, `/products/:slug`, `/brands/:slug`, `/shop`, `/brands`, and all public content paths, targeting their `/id` equivalents. Do not match `/admin`, `/api`, assets, or already-localized URLs.

- [x] **Step 5: Run typecheck to expose route-level work**

Run `npm run typecheck`.

Expected: failures identify pages and components that still call `getLocale` or lack locale props; no module-loss errors from the route move.

### Task 3: Localized page data and navigation

**Files:**
- Modify: all pages under `src/app/(localized)/[locale]/`
- Modify: `src/components/storefront/language-toggle.tsx`
- Modify: `src/components/storefront/site-header.tsx`
- Modify: `src/components/storefront/site-footer.tsx`
- Modify: `src/components/storefront/product-card.tsx`
- Modify: `src/components/storefront/product-row.tsx`
- Modify: `src/components/storefront/product-slider.tsx`
- Modify: `src/components/storefront/brand-cloud.tsx`
- Modify: `src/components/storefront/filter-panel.tsx`
- Modify: `src/components/storefront/collection-tile.tsx`

- [x] **Step 1: Replace cookie locale reads**

Every localized page accepts `params: Promise<{ locale: string }>` (plus slug where applicable), validates locale, and calls `getDictionary(locale)`. No public server component calls `cookies()` or `getLocale()`.

- [x] **Step 2: Localize all internal links and form actions**

Pass `locale` into storefront components and wrap internal destinations with `localizedPath(locale, href)`. External WhatsApp/social links and same-page hash links stay unchanged.

- [x] **Step 3: Convert the language toggle to route navigation**

Use the current pathname plus browser query/hash to push the same route under the opposite locale. Do not write `document.cookie` and do not call `router.refresh()`.

- [x] **Step 4: Validate navigation statically**

Run:

```bash
rg -n 'getLocale\(|document\.cookie|href="/(shop|brands|products|new-arrivals|best-sellers|pre-order|testimonials|contact|about)' src/app src/components/storefront
npm run typecheck
```

Expected: no cookie locale reads; any remaining unprefixed storefront link is explicitly justified; typecheck passes.

### Task 4: Localized metadata, sitemap, and invalidation

**Files:**
- Modify: `src/lib/seo.ts`
- Modify: localized page metadata exports/functions
- Modify: `src/app/sitemap.ts`
- Modify: `src/lib/catalog-cache.ts`
- Modify: product, brand, banner, and testimonial mutation routes

- [x] **Step 1: Add localized SEO helpers**

Implement helpers that return localized canonical paths and language alternates:

```ts
export function localizedAlternates(path: string) {
  return {
    languages: {
      "id-ID": localizedPath("id", path),
      en: localizedPath("en", path),
      "x-default": localizedPath("id", path)
    }
  };
}
```

- [x] **Step 2: Update metadata and JSON-LD URLs**

Generate metadata from the locale parameter for localized pages. Canonicals, Open Graph URLs, breadcrumbs, and collection URLs include the locale prefix.

- [x] **Step 3: Emit both locales in the sitemap**

For each static, brand, and product path, return one Indonesian and one English entry with language alternates.

- [x] **Step 4: Invalidate both locale variants**

Replace unprefixed public revalidation paths with localized pairs. Product changes invalidate both product detail URLs, both brand/list paths, and shared collections; brand-name changes also invalidate product data as already required.

- [x] **Step 5: Run tests and typecheck**

Run `npm test` and `npm run typecheck`.

Expected: both commands exit 0.

### Task 5: On-demand ISR and final verification

**Files:**
- Modify: `src/app/(localized)/[locale]/products/[slug]/page.tsx`
- Modify: `src/app/(localized)/[locale]/brands/[slug]/page.tsx`
- Modify: `README.md`
- Modify: this plan checklist

- [x] **Step 1: Enable on-demand static generation**

For product and brand detail routes, export `dynamic = "force-static"`, keep `dynamicParams = true`, and return an empty slug list from `generateStaticParams`. Locale params are supplied by the localized layout.

- [x] **Step 2: Document localized ISR behavior**

Document locale URLs, legacy redirects, first-request generation, repeat CDN delivery, and dual-locale invalidation after admin updates.

- [x] **Step 3: Run fresh full verification**

Run:

```bash
npm test
npm run typecheck
npm run build
git diff --check
```

Expected: all commands pass; build output does not enumerate catalog slugs; locale product/brand routes are static/ISR while shop remains dynamic.

- [x] **Step 4: Inspect local routes**

Start the production server locally and verify `/id`, `/en`, one ID/EN product pair, one ID/EN brand pair, a legacy redirect, `/admin/login`, and `/sitemap.xml`.

- [x] **Step 5: Commit locally without pushing**

Review the complete diff for unrelated changes and credentials, then commit on local `main`. Confirm `main` is ahead of `origin/main` and stop so the user can inspect before authorizing any push.
