# Indonesian Localization and Complete Collection Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove English interface-copy leaks from `/id` while preserving original catalog/customer content, and add the localized complete-collection section between the brand marquee and Best Seller section.

**Architecture:** Reusable storefront labels remain centralized in `src/lib/i18n.ts`; shared client components receive `locale` or translated dictionary values instead of embedding English. The new homepage CTA is an isolated locale-aware component rendered by the homepage at the approved position. Page-specific editorial copy and metadata use explicit Indonesian/English branches.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Lock Indonesian dictionary behavior with tests

**Files:**
- Create: `tests/indonesian-localization.test.ts`
- Modify: `src/lib/i18n.ts`

- [ ] **Step 1: Write the failing dictionary regression test**

```ts
import { describe, expect, it } from "vitest";
import { dictionaries } from "../src/lib/i18n";

describe("Indonesian storefront dictionary", () => {
  it("uses Indonesian interface and promotional copy", () => {
    expect(dictionaries.id.nav.home).toBe("Beranda");
    expect(dictionaries.id.home.discoverMore).toBe("Lihat selengkapnya");
    expect(dictionaries.id.home.brandUniverse).toBe("Jelajahi merek");
    expect(dictionaries.id.home.requestTitle).toBe("Mencari parfum tertentu? Hubungi kami sekarang");
    expect(dictionaries.id.home.requestViaWhatsApp).toBe("Hubungi kami sekarang");
    expect(dictionaries.id.forms.sendRequest).toBe("Kirim melalui WhatsApp");
    expect(dictionaries.id.product.fulfillment).toBe("Ketersediaan");
  });

  it("keeps approved brand and navigation wording", () => {
    expect(dictionaries.id.nav.shop).toBe("Belanja");
    expect(dictionaries.id.product.authentic).toBe("Harga Authentic");
  });

  it("does not change English dictionary values", () => {
    expect(dictionaries.en.nav.home).toBe("Home");
    expect(dictionaries.en.home.discoverMore).toBe("Discover more");
  });
});
```

- [ ] **Step 2: Run the focused test and confirm the current copy fails**

Run: `npm test -- tests/indonesian-localization.test.ts`

Expected: FAIL because `dictionaries.id` still contains `Home`, `Discover more`, and other English values.

- [ ] **Step 3: Replace Indonesian dictionary leaks at the source**

Update the Indonesian values in `src/lib/i18n.ts` to these approved labels:

```ts
announcementItems: [
  "100% ASLI",
  "STOK TERSEDIA",
  "GRATIS KONSULTASI AROMA",
  "KIRIM KE SELURUH INDONESIA"
],
nav: {
  home: "Beranda",
  shop: "Belanja",
  brands: "Merek A-Z",
  newArrivals: "Produk Terbaru",
  bestSellers: "Terlaris",
  preOrder: "Pre-Order",
  testimonials: "Testimoni",
  contact: "Kontak",
  search: "Cari katalog",
  open: "Buka navigasi",
  language: "Bahasa"
},
status: {
  ready_stock: "Stok tersedia",
  pre_order: "Pre-order",
  limited_stock: "Stok terbatas",
  out_of_stock: "Stok habis"
},
home: {
  freshEdit: "Produk Terbaru",
  newNoteworthy: "Produk Terbaru",
  customerFavorites: "Favorit Pelanggan",
  bestSellers: "Terlaris",
  fastDispatch: "Stok Tersedia",
  readyStock: "Stok Tersedia",
  conciergeSourcing: "Temukan Aroma Pilihan Anda",
  preOrderPicks: "Temukan Aroma Pilihan Anda",
  discoverScent: "Temukan Aroma Pilihan Anda",
  consultNow: "Konsultasi sekarang",
  discoverMore: "Lihat selengkapnya",
  brandUniverse: "Jelajahi merek",
  featuredHouses: "Merek pilihan",
  requestFragrance: "Pencarian parfum",
  requestTitle: "Mencari parfum tertentu? Hubungi kami sekarang",
  requestBody: "Kirim merek, varian parfum, dan ukuran yang diinginkan. Kami akan mengonfirmasi ketersediaan, estimasi harga, dan opsi pemesanan melalui WhatsApp.",
  requestViaWhatsApp: "Hubungi kami sekarang"
},
forms: {
  requestEyebrow: "Permintaan Parfum",
  requestTitle: "Permintaan Parfum",
  productName: "Nama Parfum",
  brandName: "Nama Merek",
  size: "Ukuran",
  name: "Nama",
  contact: "Nomor WhatsApp",
  sendRequest: "Kirim melalui WhatsApp",
  submitting: "Membuka WhatsApp",
  requestSuccess: "Membuka WhatsApp.",
  requestError: "Gagal mengirim. Silakan coba lagi atau hubungi kami melalui WhatsApp.",
  notifyEyebrow: "Notifikasi stok",
  notifyTitle: "Beri tahu saya",
  saveNotification: "Simpan notifikasi",
  notifySuccess: "Notifikasi disimpan. Kami akan menghubungi Anda saat produk tersedia.",
  nameError: "Masukkan nama Anda.",
  contactError: "Masukkan kontak yang valid.",
  productError: "Masukkan nama parfum.",
  brandError: "Masukkan nama merek.",
  sizeError: "Masukkan ukuran yang diinginkan."
},
product: {
  selectedSize: "Ukuran dipilih",
  stock: "stok",
  authentic: "Harga Authentic",
  status: "Status",
  statusBody: "Stok akhir dan waktu pengiriman dikonfirmasi sebelum pembayaran melalui WhatsApp.",
  installment: "Pembayaran 2–3 kali tersedia untuk produk tertentu. Ketentuan dikonfirmasi melalui WhatsApp sebelum pembayaran.",
  buyWhatsapp: "Beli melalui WhatsApp",
  requestSimilar: "Cari parfum serupa",
  origin: "Asal",
  notes: "Catatan",
  sku: "SKU",
  fulfillment: "Ketersediaan",
  preOrderAvailable: "Tersedia melalui pre-order",
  readyStockFocused: "Stok tersedia",
  previousImage: "Gambar produk sebelumnya",
  nextImage: "Gambar produk berikutnya",
  imageThumbnails: "Thumbnail gambar produk",
  viewImage: "Lihat gambar produk"
}
```

- [ ] **Step 4: Run the dictionary test**

Run: `npm test -- tests/indonesian-localization.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the dictionary foundation**

```bash
git add tests/indonesian-localization.test.ts src/lib/i18n.ts
git commit -m "fix: localize Indonesian storefront dictionary"
```

### Task 2: Localize global navigation and shared components

**Files:**
- Modify: `tests/site-header.test.tsx`
- Create: `tests/storefront-localized-components.test.tsx`
- Modify: `src/components/storefront/site-header.tsx`
- Modify: `src/components/storefront/site-footer.tsx`
- Modify: `src/components/storefront/filter-panel.tsx`
- Modify: `src/components/storefront/product-card.tsx`
- Modify: `src/components/storefront/product-purchase-panel.tsx`
- Modify: `src/components/storefront/product-slider.tsx`
- Modify: `src/components/storefront/request-fragrance-cta.tsx`
- Modify: `src/components/storefront/testimonial-grid.tsx`
- Modify: `src/components/storefront/trust-strip.tsx`

- [ ] **Step 1: Extend header regression coverage**

Add these assertions to the Indonesian `SiteHeader` test:

```ts
expect(screen.getAllByText("Parfum").length).toBeGreaterThan(0);
expect(screen.getAllByText("Lihat Semua Parfum").length).toBeGreaterThan(0);
expect(screen.queryByText("Discover All Fragrances")).toBeNull();
expect(screen.queryByText("New Arrival")).toBeNull();
expect(screen.getAllByRole("link", { name: "REQ FRAGRANCE" })).toHaveLength(2);
expect(screen.queryByText("REQ PERFUME")).toBeNull();
```

- [ ] **Step 2: Add shared-component localization tests**

Create `tests/storefront-localized-components.test.tsx` with focused renders for Indonesian filter and CTA labels:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RequestFragranceCta } from "../src/components/storefront/request-fragrance-cta";

describe("localized storefront components", () => {
  it("renders the Indonesian fragrance request CTA", () => {
    render(<RequestFragranceCta locale="id" />);
    expect(
      screen.getByRole("link", { name: "Minta Bantuan Mencari Parfum" }).getAttribute("href")
    ).toContain("wa.me");
    expect(screen.queryByText("Request Fragrance")).toBeNull();
  });

  it("keeps the English fragrance request CTA", () => {
    render(<RequestFragranceCta locale="en" />);
    expect(screen.getByRole("link", { name: "Request Fragrance" })).toBeTruthy();
  });
});
```

- [ ] **Step 3: Run the shared-component tests and confirm failures**

Run: `npm test -- tests/site-header.test.tsx tests/storefront-localized-components.test.tsx`

Expected: FAIL on the current English dropdown and CTA labels.

- [ ] **Step 4: Make shared components locale-aware**

In `site-header.tsx`, replace the constant English menu labels with locale-specific labels while keeping `REQ FRAGRANCE` unchanged:

```ts
const perfumeItems = locale === "id"
  ? [
      { label: "Lihat Semua Parfum", href: "/shop" },
      { label: "Merek A-Z", href: "/brands" },
      { label: "Produk Terbaru", href: "/new-arrivals" },
      { label: "Terlaris", href: "/best-sellers" },
      { label: "Pre-Order", href: "/pre-order" }
    ]
  : [
      { label: "Discover All Fragrances", href: "/shop" },
      { label: "Brand A-Z", href: "/brands" },
      { label: "New Arrival", href: "/new-arrivals" },
      { label: "Best Seller", href: "/best-sellers" },
      { label: "Pre Order", href: "/pre-order" }
    ];
const perfumesLabel = locale === "id" ? "Parfum" : "Perfumes";
```

Use localized labels for primary/mobile navigation ARIA names. Apply the same locale-aware pattern to:

- footer headings and navigation labels (`Jelajahi`, `Bantuan`, `Ikuti Kami`, `Beranda`);
- filter genders (`Uniseks`, `Wanita`, `Pria`) and status toggles (`Stok tersedia`, `Pre-order`, `Terlaris`, `Produk terbaru`);
- no-price fallback (`Tanya` for Indonesian, `Ask` for English);
- slider controls (`Geser ke kiri`, `Geser ke kanan`);
- request CTA button (`Minta Bantuan Mencari Parfum`);
- testimonial image/dialog ARIA labels;
- trust-strip ARIA label (`Jaminan toko`).

Pass `locale` into components that need it and update their call sites without translating catalog/customer values.

- [ ] **Step 5: Run the shared-component tests**

Run: `npm test -- tests/site-header.test.tsx tests/storefront-localized-components.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit global localization**

```bash
git add tests/site-header.test.tsx tests/storefront-localized-components.test.tsx src/components/storefront
git commit -m "fix: localize shared Indonesian storefront UI"
```

### Task 3: Localize page-owned copy and metadata

**Files:**
- Create: `tests/indonesian-page-copy.test.ts`
- Modify: `src/app/(localized)/[locale]/(storefront)/page.tsx`
- Modify: `src/app/(localized)/[locale]/(storefront)/about/page.tsx`
- Modify: `src/app/(localized)/[locale]/(storefront)/best-sellers/page.tsx`
- Modify: `src/app/(localized)/[locale]/(storefront)/new-arrivals/page.tsx`
- Modify: `src/app/(localized)/[locale]/(storefront)/brands/page.tsx`
- Modify: `src/app/(localized)/[locale]/(storefront)/brands/[slug]/page.tsx`
- Modify: `src/app/(localized)/[locale]/(storefront)/contact/page.tsx`
- Modify: `src/app/(localized)/[locale]/(storefront)/pre-order/page.tsx`
- Modify: `src/app/(localized)/[locale]/(storefront)/products/[slug]/page.tsx`
- Modify: `src/app/(localized)/[locale]/(storefront)/shop/page.tsx`
- Modify: `src/app/(localized)/[locale]/(storefront)/testimonials/page.tsx`

- [ ] **Step 1: Add a source-level regression test for known page-copy leaks**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const home = readFileSync("src/app/(localized)/[locale]/(storefront)/page.tsx", "utf8");
const contact = readFileSync("src/app/(localized)/[locale]/(storefront)/contact/page.tsx", "utf8");

describe("Indonesian page-owned copy", () => {
  it("contains localized homepage banner copy", () => {
    expect(home).toContain('title: "Temukan aroma pilihan Anda"');
    expect(home).not.toContain('title: "Discover your scent"');
  });

  it("uses Indonesian Instagram update wording", () => {
    expect(contact).toContain("produk terbaru, stok kembali, dan promosi");
    expect(contact).not.toContain("new arrivals, restock, dan promotion");
  });
});
```

- [ ] **Step 2: Run the page-copy test and confirm failures**

Run: `npm test -- tests/indonesian-page-copy.test.ts`

Expected: FAIL on the existing mixed-language homepage and contact copy.

- [ ] **Step 3: Localize page-specific Indonesian copy**

Apply explicit locale branches for titles/descriptions and visible copy. Required replacements include:

```ts
// Homepage Indonesian banner
title: "Temukan aroma pilihan Anda",
subtitle: "Konsultasi aroma, hadiah, dan pilihan personal langsung melalui WhatsApp."

// Contact Indonesian Instagram description
"Ikuti @authenticperfumes8_ untuk mendapatkan informasi terbaru mengenai produk terbaru, stok kembali, dan promosi."

// Product-detail Indonesian gender presentation
const genderLabel = locale === "id"
  ? ({ unisex: "Uniseks", women: "Wanita", men: "Pria" } as const)[product.gender]
  : ({ unisex: "Unisex", women: "Women", men: "Men" } as const)[product.gender];
```

Translate storefront-owned Indonesian copy on About, collection pages, Brands, Contact, Pre-Order, Product, Shop, and Testimonials. Keep `brand.name`, `brand.description`, `brand.country`, `product.name`, `product.concentration`, testimonial quotes, customer names, SKU, sizes, and prices unchanged.

For every `generateMetadata`, return an Indonesian title and description when `locale === "id"`; keep current English metadata for `/en`.

- [ ] **Step 4: Run page and domain tests**

Run: `npm test -- tests/indonesian-page-copy.test.ts tests/domain-helpers.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit page localization**

```bash
git add tests/indonesian-page-copy.test.ts 'src/app/(localized)/[locale]'
git commit -m "fix: localize Indonesian storefront pages"
```

### Task 4: Add the complete-collection homepage section

**Files:**
- Create: `src/components/storefront/complete-collection-cta.tsx`
- Create: `tests/complete-collection-cta.test.tsx`
- Modify: `src/app/(localized)/[locale]/(storefront)/page.tsx`

- [ ] **Step 1: Write the failing component test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompleteCollectionCta } from "../src/components/storefront/complete-collection-cta";

describe("CompleteCollectionCta", () => {
  it("renders Indonesian copy and destination", () => {
    render(<CompleteCollectionCta locale="id" />);
    expect(screen.getByText("KOLEKSI LENGKAP KAMI")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Jelajahi Seluruh Koleksi Parfum Kami" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "LIHAT SEMUA PARFUM" }).getAttribute("href")).toBe("/id/shop");
  });

  it("renders English copy and destination", () => {
    render(<CompleteCollectionCta locale="en" />);
    expect(screen.getByText("OUR COMPLETE COLLECTION")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Explore Our Complete Fragrance Collection" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "DISCOVER ALL FRAGRANCES" }).getAttribute("href")).toBe("/en/shop");
  });
});
```

- [ ] **Step 2: Run the component test and confirm the missing component failure**

Run: `npm test -- tests/complete-collection-cta.test.tsx`

Expected: FAIL because `CompleteCollectionCta` does not exist.

- [ ] **Step 3: Implement the responsive section component**

Create `src/components/storefront/complete-collection-cta.tsx`:

```tsx
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";

export function CompleteCollectionCta({ locale }: { locale: Locale }) {
  const copy = locale === "id"
    ? {
        eyebrow: "KOLEKSI LENGKAP KAMI",
        title: "Jelajahi Seluruh Koleksi Parfum Kami",
        body: "Temukan seluruh koleksi parfum niche dan desainer dari berbagai merek pilihan dunia.",
        action: "LIHAT SEMUA PARFUM"
      }
    : {
        eyebrow: "OUR COMPLETE COLLECTION",
        title: "Explore Our Complete Fragrance Collection",
        body: "Discover our complete niche and designer fragrance collection from selected houses around the world.",
        action: "DISCOVER ALL FRAGRANCES"
      };

  return (
    <section data-complete-collection className="border-y border-ink/10 bg-warm/35 px-4 py-8 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 border border-ink/10 bg-paper/65 p-6 md:grid-cols-[1fr_1px_1fr_auto] md:items-center md:p-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{copy.eyebrow}</p>
          <h2 className="mt-3 max-w-md font-serif text-3xl leading-tight text-ink">{copy.title}</h2>
        </div>
        <div className="hidden h-16 bg-ink/15 md:block" aria-hidden="true" />
        <p className="max-w-lg text-sm leading-7 text-ink/68">{copy.body}</p>
        <Link
          href={localizedPath(locale, "/shop")}
          className="inline-flex min-h-12 items-center justify-center gap-3 border border-ink px-5 text-xs font-semibold uppercase tracking-[0.15em] text-ink transition hover:bg-ink hover:text-paper"
        >
          {copy.action}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Place it after the brand marquee**

In the homepage, import the component and render it directly after `BrandMarquee`:

```tsx
<BrandMarquee brands={logoWallBrands} label={dictionary.home.featuredHouses} locale={locale} />
<CompleteCollectionCta locale={locale} />

<section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
  {/* Best Seller remains here */}
</section>
```

- [ ] **Step 5: Run the section and homepage-focused tests**

Run: `npm test -- tests/complete-collection-cta.test.tsx tests/site-header.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit the new homepage section**

```bash
git add src/components/storefront/complete-collection-cta.tsx tests/complete-collection-cta.test.tsx 'src/app/(localized)/[locale]/(storefront)/page.tsx'
git commit -m "feat: add complete collection homepage section"
```

### Task 5: Verify the integrated storefront

**Files:**
- Modify only if verification finds a reproducible issue in files already listed above.

- [ ] **Step 1: Run the full automated test suite**

Run: `npm test`

Expected: all test files pass with zero failures.

- [ ] **Step 2: Run TypeScript validation**

Run: `npm run typecheck`

Expected: exit code 0 with no TypeScript diagnostics.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: Next.js compiles successfully and generates all routes.

- [ ] **Step 4: Validate the diff**

Run: `git diff --check && git status --short`

Expected: no whitespace errors; only intentional implementation files are changed.

- [ ] **Step 5: Verify the local rendered pages**

Run the production server and inspect `/id`, `/id/shop`, one `/id/products/<slug>` page, `/id/brands`, `/id/new-arrivals`, `/id/best-sellers`, `/id/contact`, `/id/pre-order`, `/id/testimonials`, and `/id/about`.

Expected:

- no known English interface copy remains;
- original brand/product/testimonial content remains unchanged;
- `REQ FRAGRANCE` remains in the main navigation only;
- the complete-collection section appears after brand logos and before Best Seller;
- its Indonesian button opens `/id/shop` and English button opens `/en/shop`.

- [ ] **Step 6: Commit any verification-only correction**

If a reproducible issue required a correction, stage only the affected implementation and test files and commit with:

```bash
git commit -m "fix: complete storefront localization verification"
```

If no correction is needed, do not create an empty commit.
