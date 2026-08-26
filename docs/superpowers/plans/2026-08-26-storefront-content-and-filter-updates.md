# Storefront Content and Filter Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved bilingual storefront copy, simplify contact/testimonial/navigation content, and make desktop shop filters independently scrollable with naturally ordered sizes.

**Architecture:** Keep all content and layout changes in their existing storefront pages and components. Add one pure size-sorting helper in `src/lib` so numeric ordering is isolated and unit-tested, while preserving original option values and all existing database/admin behavior.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Vitest, Testing Library

---

## File Map

- Create `src/lib/product-sizes.ts`: parse common volume labels and sort distinct product sizes.
- Create `tests/product-sizes.test.ts`: verify decimal commas, numeric ordering, units, duplicates, and fallback labels.
- Modify `src/components/storefront/filter-panel.tsx`: use the size helper and add desktop-only independent scrolling.
- Modify `src/app/(localized)/[locale]/(storefront)/contact/page.tsx`: bilingual contact copy, two cards, and single-column request form.
- Modify `src/lib/i18n.ts`: bilingual home request copy and sentence-style request-form labels.
- Modify `src/components/storefront/testimonial-grid.tsx`: remove storefront product-name rendering.
- Modify `src/components/storefront/site-header.tsx`: remove both fragrance-request navigation entries and unused WhatsApp logic.
- Modify `src/app/(localized)/[locale]/(storefront)/pre-order/page.tsx`: bilingual pre-order process, payment policy, shipping, terms, and FAQ data.

### Task 1: Numeric Product-Size Ordering

**Files:**
- Create: `tests/product-sizes.test.ts`
- Create: `src/lib/product-sizes.ts`
- Modify: `src/components/storefront/filter-panel.tsx`

- [ ] **Step 1: Write the failing size-order tests**

```ts
import { describe, expect, it } from "vitest";
import { uniqueSortedProductSizes } from "../src/lib/product-sizes";

describe("uniqueSortedProductSizes", () => {
  it("sorts milliliter sizes numerically and supports decimal commas", () => {
    expect(uniqueSortedProductSizes(["100ml", "1,5ml", "10ml", "50ml"])).toEqual([
      "1,5ml",
      "10ml",
      "50ml",
      "100ml"
    ]);
  });

  it("normalizes liters for comparison without changing labels", () => {
    expect(uniqueSortedProductSizes(["1L", "500ml", "100ml"])).toEqual([
      "100ml",
      "500ml",
      "1L"
    ]);
  });

  it("deduplicates labels and puts non-volume values last", () => {
    expect(uniqueSortedProductSizes(["12 perfume blotters", "10ml", "10ml", "Gift set"])).toEqual([
      "10ml",
      "12 perfume blotters",
      "Gift set"
    ]);
  });
});
```

- [ ] **Step 2: Run the focused test and confirm the missing-module failure**

Run: `npm test -- tests/product-sizes.test.ts`

Expected: FAIL because `src/lib/product-sizes.ts` does not exist.

- [ ] **Step 3: Implement the pure size helper**

```ts
const volumePattern = /^\s*(\d+(?:[.,]\d+)?)\s*(ml|l)\s*$/i;

function volumeInMilliliters(value: string) {
  const match = value.match(volumePattern);
  if (!match) return null;

  const amount = Number.parseFloat(match[1].replace(",", "."));
  if (!Number.isFinite(amount)) return null;

  return match[2].toLowerCase() === "l" ? amount * 1000 : amount;
}

export function uniqueSortedProductSizes(values: string[]) {
  return [...new Set(values)].sort((left, right) => {
    const leftVolume = volumeInMilliliters(left);
    const rightVolume = volumeInMilliliters(right);

    if (leftVolume !== null && rightVolume !== null) return leftVolume - rightVolume;
    if (leftVolume !== null) return -1;
    if (rightVolume !== null) return 1;
    return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
  });
}
```

- [ ] **Step 4: Connect the helper to the filter panel**

Import the helper:

```ts
import { uniqueSortedProductSizes } from "@/lib/product-sizes";
```

Delete the local `uniqueSorted` function and replace the size calculation with:

```ts
const sizes = uniqueSortedProductSizes(
  products.flatMap((product) => product.variants.map((variant) => variant.size))
);
```

- [ ] **Step 5: Run the focused test and commit**

Run: `npm test -- tests/product-sizes.test.ts`

Expected: PASS with 3 tests.

```bash
git add src/lib/product-sizes.ts src/components/storefront/filter-panel.tsx tests/product-sizes.test.ts
git commit -m "fix: sort perfume sizes numerically"
```

### Task 2: Contact Page and Request-Form Copy

**Files:**
- Modify: `src/app/(localized)/[locale]/(storefront)/contact/page.tsx`
- Modify: `src/lib/i18n.ts`

- [ ] **Step 1: Reduce contact options to WhatsApp and Instagram**

Remove the `MapPin` import. Define the two localized options with these exact Indonesian bodies and equivalent English bodies:

```ts
const contactOptions = isId
  ? [
      {
        title: "WhatsApp",
        body: "Hubungi kami melalui WhatsApp untuk informasi harga, ketersediaan produk, atau pertanyaan lainnya.",
        icon: MessageCircle,
        href: buildWhatsAppUrl("Halo Authentic Perfumes 8, saya ingin bertanya tentang parfum.")
      },
      {
        title: "Instagram",
        body: "Ikuti @authenticperfumes8_ untuk mendapatkan informasi terbaru mengenai new arrivals, restock, dan promotion.",
        icon: Instagram,
        href: INSTAGRAM_URL
      }
    ]
  : [
      {
        title: "WhatsApp",
        body: "Contact us through WhatsApp for pricing, product availability, or any other questions.",
        icon: MessageCircle,
        href: buildWhatsAppUrl("Hello Authentic Perfumes 8, I would like to ask about a fragrance.")
      },
      {
        title: "Instagram",
        body: "Follow @authenticperfumes8_ for the latest information on new arrivals, restocks, and promotions.",
        icon: Instagram,
        href: INSTAGRAM_URL
      }
    ];
```

- [ ] **Step 2: Replace the contact hero copy and two-card grid**

Use:

```tsx
<h1 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-ink">
  {isId ? "Tanyakan stok, sourcing, atau rekomendasi parfum." : "Ask about stock, sourcing, or fragrance recommendations."}
</h1>
<p className="mt-5 max-w-3xl text-sm leading-7 text-ink/68">
  {isId
    ? "Sertakan nama parfum, ukuran, dan budget yang diinginkan. Tim kami akan membantu mengecek ketersediaan dan memberikan opsi terbaik untuk Anda."
    : "Include the fragrance name, preferred size, and budget. Our team will check availability and provide the best options for you."}
</p>
```

Change the contact grid to `md:grid-cols-2`. Remove `localizedPath` from contact-card `href` because both remaining links are external and use `_blank` plus `rel="noreferrer"` directly.

- [ ] **Step 3: Remove the WhatsApp-details panel**

Replace the final two-column wrapper and its descriptive `<div>` with:

```tsx
<div className="mx-auto max-w-4xl">
  <RequestFragranceForm dictionary={dictionary.forms} />
</div>
```

- [ ] **Step 4: Apply sentence-style bilingual form labels**

Set the English dictionary values to:

```ts
requestEyebrow: "Perfume request",
requestTitle: "Perfume Request",
productName: "Perfume Name",
brandName: "Brand Name",
size: "Size",
name: "Name",
contact: "WhatsApp Number",
```

Set the Indonesian dictionary values to:

```ts
requestEyebrow: "Permintaan parfum",
requestTitle: "Permintaan Parfum",
productName: "Nama Parfum",
brandName: "Nama Brand",
size: "Ukuran",
name: "Nama",
contact: "Nomor WhatsApp",
```

- [ ] **Step 5: Type-check and commit**

Run: `npm run typecheck`

Expected: exit code 0.

```bash
git add 'src/app/(localized)/[locale]/(storefront)/contact/page.tsx' src/lib/i18n.ts
git commit -m "feat: refresh contact page content"
```

### Task 3: Simplify Testimonials and Navigation

**Files:**
- Modify: `src/components/storefront/testimonial-grid.tsx`
- Modify: `src/components/storefront/site-header.tsx`

- [ ] **Step 1: Hide testimonial product names**

In each testimonial card, replace the nested customer text wrapper with:

```tsx
<p className="text-sm font-semibold text-ink">{testimonial.customerName}</p>
```

In the image dialog header, replace the name/product wrapper with:

```tsx
<p className="min-w-0 truncate text-sm font-semibold text-ink">
  {selected.customerName}
</p>
```

Do not change `Testimonial`, API, repository, schema, or admin files.

- [ ] **Step 2: Remove request items and request URL logic from the header**

Delete the `buildWhatsAppUrl` import. Define `perfumeItems` without `REQ PERFUME`:

```ts
const perfumeItems = [
  { label: "Discover All Fragrances", href: "/shop" },
  { label: "Brand A-Z", href: "/brands" },
  { label: "New Arrival", href: "/new-arrivals" },
  { label: "Best Seller", href: "/best-sellers" },
  { label: "Pre Order", href: "/pre-order" }
];
```

Replace `requestUrl` and the conditional link mapping with:

```ts
const perfumeLinks = perfumeItems.map((item) => ({
  ...item,
  href: localizedPath(locale, item.href)
}));
```

Render every dropdown item as a `Link`; remove the standalone `REQ FRAGRANCE` `<li>` from desktop and mobile lists.

- [ ] **Step 3: Verify obsolete navigation copy is gone and commit**

Run:

```bash
rg -n "REQ FRAGRANCE|REQ PERFUME|productName" src/components/storefront/site-header.tsx src/components/storefront/testimonial-grid.tsx
```

Expected: no matches.

Run: `npm run typecheck`

Expected: exit code 0.

```bash
git add src/components/storefront/testimonial-grid.tsx src/components/storefront/site-header.tsx
git commit -m "feat: simplify testimonials and storefront navigation"
```

### Task 4: Home and Pre-Order Bilingual Content

**Files:**
- Modify: `src/lib/i18n.ts`
- Modify: `src/app/(localized)/[locale]/(storefront)/pre-order/page.tsx`

- [ ] **Step 1: Replace the bilingual home request paragraph**

Set English `home.requestBody` to:

```ts
"Send the brand, fragrance variant, and desired size. We will confirm availability, the estimated price, and ordering options through WhatsApp."
```

Set Indonesian `home.requestBody` to:

```ts
"Kirim brand, varian parfum, dan ukuran yang diinginkan. Kami akan mengonfirmasi ketersediaan, estimasi harga, dan opsi pemesanan melalui WhatsApp."
```

- [ ] **Step 2: Define bilingual process and payment-policy arrays**

Replace the existing process/refund constants with arrays containing the approved four Indonesian steps and these English equivalents:

```ts
const process = [
  "Send the perfume name, variant, and desired size through WhatsApp.",
  "We will confirm availability, the estimated price, and payment terms before ordering.",
  "Once confirmed, the perfume will be processed and we will provide updates throughout the process.",
  "After the item arrives, the order will be prepared and shipped to you."
];

const processId = [
  "Kirim nama parfum, varian, dan ukuran yang diinginkan melalui WhatsApp.",
  "Kami akan mengonfirmasi ketersediaan, estimasi harga, dan ketentuan pembayaran sebelum pemesanan.",
  "Setelah dikonfirmasi, parfum akan diproses dan kami akan memberikan update selama proses berlangsung.",
  "Setelah barang tiba, pesanan akan disiapkan dan dikirim kepada Anda."
];

const paymentPolicy = [
  "Payment constitutes acceptance of the terms.",
  "All transactions are final and cannot be cancelled or exchanged.",
  "Deposits and payments already received are non-refundable. If an order is cancelled, the deposit or payment is forfeited.",
  "If the item is unavailable, a 100% refund will be issued."
];

const paymentPolicyId = [
  "Pembayaran merupakan tanda persetujuan.",
  "Semua transaksi bersifat final (tidak dapat dibatalkan/ditukar).",
  "DP maupun pembayaran yang sudah masuk tidak dapat dikembalikan. Jika dibatalkan maka DP/payment hangus.",
  "Jika barang tidak tersedia, akan dilakukan refund 100%."
];
```

- [ ] **Step 3: Replace the pre-order introduction and top policy card**

Use the approved Indonesian introduction and this English equivalent:

```tsx
<h1 className="mt-3 font-serif text-4xl leading-tight text-ink">
  {isId ? "Pre-order dengan proses yang jelas" : "Pre-order with a clear process"}
</h1>
<p className="mt-4 text-sm leading-7 text-ink/68">
  {isId
    ? "Untuk parfum yang belum tersedia ready stock, kami akan mengonfirmasi ketersediaan, harga, estimasi kedatangan, dan detail produk sebelum Anda melakukan pemesanan."
    : "For fragrances that are not available as ready stock, we will confirm availability, price, estimated arrival, and product details before you place an order."}
</p>
```

Rename the second card to `Kebijakan Pembayaran` / `Payment Policy`, change its ID to `payment-policy`, and render `paymentPolicyItems` as a numbered list.

- [ ] **Step 4: Replace shipping and terms content**

Render a two-column section where shipping occupies one column and the terms panel occupies the other wider column. Shipping copy must be:

```ts
const shippingBody = isId
  ? "Pesanan ready stock dikirim setelah pembayaran terkonfirmasi. Untuk pre-order, pengiriman dilakukan setelah barang tiba dan siap dikirim kepada Anda."
  : "Ready-stock orders are shipped after payment is confirmed. Pre-orders are shipped after the item arrives and is ready to be sent to you.";
```

Define localized terms groups with exact headings and bullets:

```ts
const termsGroupsId = [
  { title: "Ready Stock", items: ["Pembayaran penuh diperlukan untuk mengamankan barang.", "Tidak dapat dilakukan reservasi/hold."] },
  { title: "Pre-Order (PO)", items: ["Minimal DP 50%.", "Pengecualian untuk DP di bawah 50% hanya berlaku untuk trip tertentu (silakan konfirmasi terlebih dahulu).", "Namun, pesanan >15 juta: DP tetap wajib 50% (tanpa pengecualian)."] },
  { title: "Kebijakan Pembayaran", items: paymentPolicyId },
  { title: "Pelunasan", items: ["Pelunasan pembayaran dilakukan saat barang tiba di Indonesia dan maksimal H+7 setelah pemberitahuan."] },
  { title: "Estimasi Pre-Order", items: ["Waktu kedatangan dapat berubah mengikuti proses logistik.", "Keterlambatan di luar kendali kami (pengecualian untuk item handcarry dengan jadwal yang telah diinformasikan)."] },
  { title: "Pengiriman Pesanan", items: ["Pesanan akan dikirim setelah pembayaran lunas.", "Komplain dan klaim wajib menyertakan video unboxing tanpa jeda (no cut).", "Komplain tanpa bukti video tidak dapat diproses."] }
];
```

Create the English array with matching meanings, then render every group with an `<h3>` and `<ul>` inside the `Syarat dan Ketentuan` / `Terms and Conditions` panel.

- [ ] **Step 5: Update FAQ structured data**

Change the second question and accepted answer to use `paymentPolicyItems`:

```ts
name: isId ? "Bagaimana kebijakan pembayaran pre-order?" : "What is the pre-order payment policy?",
acceptedAnswer: {
  "@type": "Answer",
  text: paymentPolicyItems.join(" ")
}
```

- [ ] **Step 6: Type-check and commit**

Run: `npm run typecheck`

Expected: exit code 0.

```bash
git add src/lib/i18n.ts 'src/app/(localized)/[locale]/(storefront)/pre-order/page.tsx'
git commit -m "feat: update home and pre-order policies"
```

### Task 5: Independent Desktop Filter Scrolling

**Files:**
- Modify: `src/components/storefront/filter-panel.tsx`

- [ ] **Step 1: Add viewport-constrained scrolling at desktop widths**

Replace the `<aside>` classes with:

```tsx
<aside className="border border-ink/10 bg-warm/45 p-4 lg:sticky lg:top-32 lg:max-h-[calc(100dvh-9rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain">
```

This keeps normal document flow on mobile and creates an independent scroll container only on desktop.

- [ ] **Step 2: Type-check and commit**

Run: `npm run typecheck`

Expected: exit code 0.

```bash
git add src/components/storefront/filter-panel.tsx
git commit -m "fix: make desktop shop filters independently scrollable"
```

### Task 6: Full Verification

**Files:**
- Verify all modified files

- [ ] **Step 1: Run the full automated checks**

Run:

```bash
npm test
npm run typecheck
npm run lint
npm run build
git diff --check
```

Expected: every command exits with code 0. If `next lint` is unsupported by the installed Next.js version, record that limitation and rely on typecheck, tests, and build instead of changing tooling within this task.

- [ ] **Step 2: Start the storefront for browser verification**

Run: `npm run dev`

Expected: Next.js reports a local URL and the app responds successfully.

- [ ] **Step 3: Verify the approved pages in Indonesian and English**

Check these routes at desktop and mobile widths:

```text
/id
/en
/id/contact
/en/contact
/id/testimonials
/en/testimonials
/id/pre-order
/en/pre-order
/id/shop
/en/shop
```

Confirm the acceptance criteria from `docs/superpowers/specs/2026-08-26-storefront-content-and-filter-updates-design.md`, including independent desktop filter scrolling and access to the final apply button.

- [ ] **Step 4: Review the final diff and commit any verification-only correction**

Run:

```bash
git status --short
git diff --stat
git diff --check
```

Expected: no whitespace errors and only approved storefront/test files changed. If visual verification required a correction, stage only that correction and commit it with a focused message before reporting completion.
