# Catalog Management Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans task-by-task in this session. The user explicitly requested immediate inline implementation.

**Goal:** Add bulk product actions, safe size deletion, and storefront brand suggestions.

**Architecture:** Extend the existing product manager; isolate confirmation dialog, variant manager, and search combobox. Authenticated endpoints invoke an atomic PostgreSQL RPC. Public visibility is derived from having variants, preserving publication intent.

**Tech Stack:** Next.js, React, TypeScript, Supabase/PostgreSQL, Vitest.

## Tasks

### 1. Domain validation and regression tests
- [x] Create `src/lib/catalog-management.ts` and `tests/catalog-management.test.ts`.
- [x] Test bounded UUID selections, strict actions, confirmation payloads, and normalized volume keys (`expect(productSizeKey('1,5 ml')).toBe(productSizeKey('1.5ml'))`).
- [x] Run focused tests red, implement helpers, rerun green.

### 2. Atomic admin mutations
- [x] Add `supabase/migrations/20260904090000_catalog_management.sql`: `manage_catalog_selection(action, target_ids, preview, confirmed_empty_products)` returns affected IDs/slugs and empty-product warnings. Lock and validate all targets before writing; reject changed warning scope. Service-role execution only.
- [x] Add authenticated `/api/products/bulk-actions` route with bounded payload validation, RPC errors, and affected cache invalidation.
- [x] Add route tests for authorization, invalid input, database errors, confirmation conflicts, and successful invalidation.
- [x] Correct brand count triggers for published products with variants. Add test-transaction SQL covering rollback, last-variant confirmation, and preserved other variants.

### 3. Dashboard interfaces
- [x] Add accessible native-dialog confirmation component with cancel focus, busy state, scrollable target list, and warning copy.
- [x] Extend product manager with three new actions, badge state, variantless indicator, and selection reset on filters. Add server projection fields in admin Products page.
- [x] Add `/admin/product-sizes`, sidebar link, and variant manager with normalized size filter/search, ID-based selection, and server preview before confirmation.
- [x] Test modal cancellation, selected targets, result state, exact last-variant acknowledgement, and filter selection reset.

### 4. Variantless public visibility
- [x] Filter variantless products centrally in all catalog entry points; hide direct detail and sitemap through existing repository consumers. Do not change published flag.
- [x] Correct brand count synchronization and add sizes page cache invalidation.
- [x] Test list/detail/brand exclusion, admin preservation, and restored visibility after a variant returns.

### 5. Brand suggestions
- [x] Add `brand-search-input.tsx` with prefix-matched suggestions, keyboard navigation, Enter/Escape handling, locale labels, and bounded scroll.
- [x] Integrate with filter form: brand selection clears q, preserves other filters, and submits using the existing form action.
- [x] Test prefix matching, free text, keyboard selection, no results, and locale behavior.

### 6. Verification and handoff
- [x] Run all tests, production build, typecheck, and diff checks sequentially. Review changed files and SQL permissions.
- [x] Run SQL against an isolated local database when available; never execute destructive tests on production.
- [x] Verify desktop/mobile interactions without deleting real catalog records.
- [x] Commit scoped changes on `codex/catalog-bulk-variant-management`. Do not push or deploy without current authorization; disclose pending migration if not applied.

## Verification record

- 95 tests across 19 files passed; production build, TypeScript, and diff checks passed.
- Standalone `npm run lint` could not run: the repository has no configured ESLint setup and `next lint` prompts for initial configuration. No unrelated lint configuration was added.
- Actual schema and migration executed in isolated PGlite; rollback, privileges, last-size acknowledgement, and restored visibility tested. This is not a concurrent production-load test.
- Desktop/mobile browser interactions passed with mocked mutation requests. Temporary fixture route removed before final build.
- Local production browser checks: full catalog and filtered catalog had no hydration errors; Calaj filter returned five matching products. Development-only full-list hydration warning also occurred with autocomplete disabled; no unrelated framework changes made.
- Brand filtering now resolves the real brand ID from its slug rather than guessing an ID/name.
- Before deployment: apply `supabase/migrations/20260904090000_catalog_management.sql` to the target database, then deploy code. New mutation endpoint requires an admin profile and service-role RPC access.
- No production mutations, migration, push, or deployment performed. No real products or sizes deleted.
