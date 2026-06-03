# Authentic Perfumes Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js, Supabase, and Cloudinary storefront/admin MVP for Authentic Perfumes using a Luckyscent-like boutique catalog UI.

**Architecture:** The app uses Next.js App Router with focused route groups for public storefront and admin. Data access is centralized in typed repository functions that can read Supabase when configured and fall back to seed data for local visual verification. Cloudinary uploads use a signed API route, while public pages use Cloudinary URLs stored in the product and media records.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Framer Motion, Supabase Auth/database, Cloudinary signed upload API, React Hook Form, Zod, Vitest, Playwright.

---

## File Structure

Create these main areas:

- `src/app/(storefront)/*`: public pages and shared public layout.
- `src/app/admin/*`: admin pages protected by Supabase Auth checks.
- `src/app/api/*`: REST API routes for products, brands, banners, testimonials, discovery posts, requests, stock notifications, and Cloudinary signatures.
- `src/components/storefront/*`: public header, navigation, product cards, collection tiles, filters, trust modules, and footer.
- `src/components/admin/*`: admin shell, forms, tables, uploads, and status controls.
- `src/components/motion/*`: shared Framer Motion primitives and reduced-motion handling.
- `src/lib/*`: Supabase clients, Cloudinary helpers, seed data, formatting, slugs, WhatsApp links, and repositories.
- `supabase/schema.sql`: SQL setup for tables, indexes, policies, and triggers.
- `tests/*`: unit tests for pure helpers and repositories using seed fallback.

## Task 1: Scaffold The Next.js App

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Create: `vitest.config.ts`
- Create: `tests/smoke.test.ts`

- [ ] **Step 1: Create project configuration**

Create `package.json`:

```json
{
  "name": "authenticperfumes",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.0.1",
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.49.8",
    "clsx": "^2.1.1",
    "framer-motion": "^12.12.1",
    "lucide-react": "^0.511.0",
    "next": "^15.3.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.56.4",
    "tailwind-merge": "^3.3.0",
    "zod": "^3.25.20"
  },
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.10",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^22.15.21",
    "@types/react": "^19.0.12",
    "@types/react-dom": "^19.0.4",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.27.0",
    "eslint-config-next": "^15.3.3",
    "jsdom": "^26.1.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "vitest": "^3.1.4"
  }
}
```

- [ ] **Step 2: Create Next, TypeScript, Tailwind, and test config**

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  }
};

export default nextConfig;
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

Create `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F2F2F0",
        warm: "#EEEAE3",
        clay: "#DDD6CE",
        stone: "#B0A99F",
        ink: "#111111",
        gold: "#9A7A36"
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"]
      },
      borderRadius: {
        panel: "6px"
      }
    }
  },
  plugins: [forms]
};

export default config;
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"]
  }
});
```

- [ ] **Step 3: Create base app files**

Create `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: "Helvetica Neue", Arial, sans-serif;
  background: #f2f2f0;
  color: #111111;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: #f2f2f0;
  color: #111111;
  font-family: var(--font-sans);
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Authentic Perfumes",
    template: "%s | Authentic Perfumes"
  },
  description:
    "Original niche and designer fragrances in Indonesia with ready stock, pre-order, split payment, and fragrance consultation."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/page.tsx`:

```tsx
export default function HomePage() {
  return <main className="p-8">Authentic Perfumes</main>;
}
```

Create `tests/smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("runs the test environment", () => {
    expect("Authentic Perfumes").toContain("Perfumes");
  });
});
```

- [ ] **Step 4: Install and verify scaffold**

Run:

```bash
npm install
npm run typecheck
npm test
```

Expected: dependencies install, TypeScript passes, and Vitest reports one passing test.

- [ ] **Step 5: Commit scaffold**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts vitest.config.ts src tests
git commit -m "chore: scaffold Next.js storefront"
```

## Task 2: Define Domain Types, Seed Data, And Helpers

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/seed-data.ts`
- Create: `src/lib/format.ts`
- Create: `src/lib/slugs.ts`
- Create: `src/lib/whatsapp.ts`
- Test: `tests/domain-helpers.test.ts`

- [ ] **Step 1: Add domain types**

Create `src/lib/types.ts`:

```ts
export type ProductStatus = "ready_stock" | "pre_order" | "limited_stock" | "out_of_stock";
export type Gender = "men" | "women" | "unisex";
export type MediaType = "image" | "video";

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  country: string;
  foundedYear: number | null;
  description: string;
  productCount: number;
  featured: boolean;
};

export type ProductVariant = {
  id: string;
  size: string;
  retailPrice: number;
  authenticPrice: number;
  stock: number;
  status: ProductStatus;
};

export type Product = {
  id: string;
  brandId: string;
  brandName: string;
  slug: string;
  name: string;
  imageUrl: string;
  galleryUrls: string[];
  gender: Gender;
  concentration: string;
  notes: string[];
  countryOfOrigin: string;
  description: string;
  status: ProductStatus;
  bestSeller: boolean;
  newArrival: boolean;
  readyStock: boolean;
  preOrder: boolean;
  variants: ProductVariant[];
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  position: "primary" | "secondary" | "tertiary";
};

export type Testimonial = {
  id: string;
  customerName: string;
  quote: string;
  productName: string;
  imageUrl: string;
};

export type TrustMedia = {
  id: string;
  title: string;
  category:
    | "packing_video"
    | "shipping_proof"
    | "chat_review"
    | "story_repost"
    | "unboxing"
    | "repeat_customer";
  mediaType: MediaType;
  mediaUrl: string;
};

export type DiscoverPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "guide" | "review" | "glossary" | "consultation";
  imageUrl: string;
  body: string;
  publishedAt: string;
};
```

- [ ] **Step 2: Add formatting, slug, and WhatsApp helpers**

Create `src/lib/format.ts`:

```ts
export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

export function calculateSavings(retailPrice: number, authenticPrice: number) {
  return Math.max(retailPrice - authenticPrice, 0);
}
```

Create `src/lib/slugs.ts`:

```ts
export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

Create `src/lib/whatsapp.ts`:

```ts
const DEFAULT_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";

export function buildWhatsAppUrl(message: string, phone = DEFAULT_PHONE) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(productName: string, url: string, size?: string) {
  const sizeText = size ? ` ukuran ${size}` : "";
  return `Halo Authentic Perfumes, saya tertarik dengan produk ${productName}${sizeText}. Mohon informasi stok dan harga terbaru. ${url}`;
}
```

- [ ] **Step 3: Add seed data**

Create `src/lib/seed-data.ts` with exactly 12 brands, 12 products, 3 banners, 4 testimonials, 6 trust media records, and 4 discover posts. Use remote demo image URLs from `images.unsplash.com` so local visual verification works before Cloudinary is configured.

- [ ] **Step 4: Test helpers**

Create `tests/domain-helpers.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calculateSavings, formatRupiah } from "@/lib/format";
import { slugify } from "@/lib/slugs";
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

describe("domain helpers", () => {
  it("formats IDR prices", () => {
    expect(formatRupiah(2500000)).toBe("Rp2.500.000");
  });

  it("calculates non-negative savings", () => {
    expect(calculateSavings(3500000, 2900000)).toBe(600000);
    expect(calculateSavings(2000000, 2500000)).toBe(0);
  });

  it("creates clean slugs", () => {
    expect(slugify("Maison Francis Kurkdjian Baccarat Rouge 540")).toBe(
      "maison-francis-kurkdjian-baccarat-rouge-540"
    );
  });

  it("builds product WhatsApp messages and URLs", () => {
    const message = buildProductWhatsAppMessage("Xerjoff Naxos", "https://example.com/products/xerjoff-naxos", "100ml");
    expect(message).toContain("Xerjoff Naxos");
    expect(message).toContain("100ml");
    expect(buildWhatsAppUrl(message, "628111111111")).toContain("https://wa.me/628111111111");
  });
});
```

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm test
npm run typecheck
```

Expected: all tests pass and TypeScript has no errors.

Commit:

```bash
git add src/lib tests/domain-helpers.test.ts
git commit -m "feat: add catalog domain model and seed data"
```

## Task 3: Add Supabase Schema And Repository Layer

**Files:**
- Create: `supabase/schema.sql`
- Create: `src/lib/env.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/repositories/catalog.ts`
- Test: `tests/catalog-repository.test.ts`

- [ ] **Step 1: Create Supabase SQL schema**

Create `supabase/schema.sql` with tables for `profiles`, `brands`, `products`, `product_variants`, `banners`, `testimonials`, `discover_posts`, `trust_media`, `fragrance_requests`, `stock_notifications`, and `admin_audit_logs`. Include UUID primary keys, `created_at`, and `updated_at`. Add indexes for `brands.slug`, `products.slug`, `products.brand_id`, `products.status`, `products.best_seller`, `products.new_arrival`, `products.ready_stock`, `products.pre_order`, `discover_posts.slug`, `fragrance_requests.status`, and `stock_notifications.status`. Enable RLS on every table. Allow public read on published catalog tables and authenticated admin mutation policies.

- [ ] **Step 2: Add environment helpers**

Create `src/lib/env.ts`:

```ts
export function getPublicSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}
```

Create `src/lib/supabase/server.ts`:

```ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseConfig } from "@/lib/env";

export async function createSupabaseServerClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        }
      }
    }
  );
}
```

- [ ] **Step 3: Add catalog repository with seed fallback**

Create `src/lib/repositories/catalog.ts`:

```ts
import { seedBanners, seedBrands, seedDiscoverPosts, seedProducts, seedTestimonials, seedTrustMedia } from "@/lib/seed-data";

export async function getBrands() {
  return seedBrands;
}

export async function getFeaturedBrands() {
  return seedBrands.filter((brand) => brand.featured);
}

export async function getBrandBySlug(slug: string) {
  return seedBrands.find((brand) => brand.slug === slug) ?? null;
}

export async function getProducts() {
  return seedProducts;
}

export async function getProductBySlug(slug: string) {
  return seedProducts.find((product) => product.slug === slug) ?? null;
}

export async function getNewArrivals() {
  return seedProducts.filter((product) => product.newArrival);
}

export async function getBestSellers() {
  return seedProducts.filter((product) => product.bestSeller);
}

export async function getReadyStockProducts() {
  return seedProducts.filter((product) => product.readyStock);
}

export async function getPreOrderProducts() {
  return seedProducts.filter((product) => product.preOrder);
}

export async function getBanners() {
  return seedBanners;
}

export async function getTestimonials() {
  return seedTestimonials;
}

export async function getTrustMedia() {
  return seedTrustMedia;
}

export async function getDiscoverPosts() {
  return seedDiscoverPosts;
}

export async function getDiscoverPostBySlug(slug: string) {
  return seedDiscoverPosts.find((post) => post.slug === slug) ?? null;
}
```

- [ ] **Step 4: Test repository fallback**

Create `tests/catalog-repository.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  getBestSellers,
  getBrandBySlug,
  getBrands,
  getNewArrivals,
  getProductBySlug
} from "@/lib/repositories/catalog";

describe("catalog repository", () => {
  it("returns seed brands", async () => {
    const brands = await getBrands();
    expect(brands.length).toBeGreaterThanOrEqual(12);
  });

  it("finds known seed records by slug", async () => {
    const brand = await getBrandBySlug("xerjoff");
    const product = await getProductBySlug("xerjoff-naxos-100ml");
    expect(brand?.name).toBe("Xerjoff");
    expect(product?.name).toBe("Naxos");
  });

  it("returns merchandising product groups", async () => {
    expect((await getBestSellers()).length).toBeGreaterThan(0);
    expect((await getNewArrivals()).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm test
npm run typecheck
```

Expected: all tests pass and TypeScript has no errors.

Commit:

```bash
git add supabase src/lib/env.ts src/lib/supabase src/lib/repositories tests/catalog-repository.test.ts
git commit -m "feat: add Supabase schema and catalog repository"
```

## Task 4: Build Storefront Layout, Navigation, And Motion Primitives

**Files:**
- Create: `src/components/motion/reveal.tsx`
- Create: `src/components/storefront/announcement-bar.tsx`
- Create: `src/components/storefront/site-header.tsx`
- Create: `src/components/storefront/site-footer.tsx`
- Create: `src/components/storefront/whatsapp-floating-button.tsx`
- Create: `src/app/(storefront)/layout.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add motion reveal primitive**

Create `src/components/motion/reveal.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Add storefront header and footer components**

Create the announcement bar with the text `100% original niche & designer fragrances - Ready Stock and Pre Order available across Indonesia`. Create the masthead with centered `Authentic Perfumes`, navigation links `Brands`, `New`, `Fragrances`, `Sampling`, `Pre Order`, `Best Sellers`, `Trust Center`, `Discover`, and `Contact`, and dropdown groups for `Brands`, `Fragrances`, and `Discover`. Create the footer with authenticity, consultation, PO, shipping, refund, and WhatsApp copy. Create a floating WhatsApp button using `MessageCircle`. Use `Search`, `User`, `Heart`, `ShoppingBag`, and `Menu` from `lucide-react` in the header.

- [ ] **Step 3: Add storefront layout**

Create `src/app/(storefront)/layout.tsx`:

```tsx
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { WhatsAppFloatingButton } from "@/components/storefront/whatsapp-floating-button";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      {children}
      <SiteFooter />
      <WhatsAppFloatingButton />
    </>
  );
}
```

- [ ] **Step 4: Move homepage into route group**

Move `src/app/page.tsx` to `src/app/(storefront)/page.tsx`. Leave no root `src/app/page.tsx`; the route group preserves `/`.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm run typecheck
npm run build
```

Expected: typecheck and production build pass.

Commit:

```bash
git add src/app src/components
git commit -m "feat: add boutique storefront shell"
```

## Task 5: Build Homepage Modules

**Files:**
- Create: `src/components/storefront/collection-tile.tsx`
- Create: `src/components/storefront/product-card.tsx`
- Create: `src/components/storefront/product-row.tsx`
- Create: `src/components/storefront/trust-strip.tsx`
- Create: `src/components/storefront/brand-cloud.tsx`
- Create: `src/components/storefront/discover-preview.tsx`
- Modify: `src/app/(storefront)/page.tsx`

- [ ] **Step 1: Build reusable storefront modules**

Create product cards with 1:1 image area, brand, product name, concentration, status, and price range. Create collection tiles using banner title, subtitle, image, and href. Create a four-item trust strip with `100% Authentic`, `Indonesia Shipping`, `Split Payment`, and `Fragrance Consultation`. Create a brand cloud showing featured brand names and product counts. Create discover preview cards with image, category, title, excerpt, and `Read guide` link.

- [ ] **Step 2: Compose homepage**

Use repository calls in `src/app/(storefront)/page.tsx` to fetch banners, new arrivals, best sellers, ready stock, pre-order products, featured brands, testimonials, trust media, and discover posts. Compose sections in the approved Luckyscent-like order.

- [ ] **Step 3: Verify and commit**

Run:

```bash
npm run typecheck
npm run build
```

Expected: typecheck and production build pass, homepage renders with seed catalog data.

Commit:

```bash
git add src/app/\\(storefront\\)/page.tsx src/components/storefront
git commit -m "feat: build boutique storefront homepage"
```

## Task 6: Build Catalog, Brand, Product, And Content Pages

**Files:**
- Create: `src/components/storefront/filter-panel.tsx`
- Create: `src/app/(storefront)/shop/page.tsx`
- Create: `src/app/(storefront)/brands/page.tsx`
- Create: `src/app/(storefront)/brands/[slug]/page.tsx`
- Create: `src/app/(storefront)/products/[slug]/page.tsx`
- Create: `src/app/(storefront)/new-arrivals/page.tsx`
- Create: `src/app/(storefront)/best-sellers/page.tsx`
- Create: `src/app/(storefront)/sampling/page.tsx`
- Create: `src/app/(storefront)/pre-order/page.tsx`
- Create: `src/app/(storefront)/testimonials/page.tsx`
- Create: `src/app/(storefront)/discover/page.tsx`
- Create: `src/app/(storefront)/discover/[slug]/page.tsx`
- Create: `src/app/(storefront)/about/page.tsx`
- Create: `src/app/(storefront)/contact/page.tsx`

- [ ] **Step 1: Build shop and filtering**

Create a server-rendered shop page with query-string filters named `q`, `brand`, `gender`, `note`, `price`, `size`, `readyStock`, `preOrder`, `bestSeller`, and `newArrival`. Use seed data filtering in the page first. Price bands are `under-1m`, `1m-3m`, `3m-5m`, and `over-5m`.

- [ ] **Step 2: Build brand directory and brand pages**

Create an A-Z brand directory with search query support and alphabet anchors. Brand detail pages show logo, description, country, founded year, and products for the brand.

- [ ] **Step 3: Build product detail pages**

Create product pages with gallery thumbnails, variant selector, retail price, Authentic price, calculated savings, status, Add to Cart intent button, Buy via WhatsApp, Wishlist, Notify Me, and Request Similar Fragrance controls. Add metadata and JSON-LD product schema with `Product`, `Brand`, `Offer`, price, availability, and image.

- [ ] **Step 4: Build collection and content pages**

Create New Arrivals, Best Sellers, Sampling, Pre Order, Testimonials/Trust Center, Discover index, Discover detail, About, and Contact pages using seed data and consistent storefront components.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm run typecheck
npm run build
```

Expected: all public routes build successfully.

Commit:

```bash
git add src/app/\\(storefront\\) src/components/storefront
git commit -m "feat: add catalog and content pages"
```

## Task 7: Add REST API Routes And Public Forms

**Files:**
- Create: `src/lib/validation.ts`
- Create: `src/app/api/products/route.ts`
- Create: `src/app/api/brands/route.ts`
- Create: `src/app/api/banners/route.ts`
- Create: `src/app/api/testimonials/route.ts`
- Create: `src/app/api/discover/route.ts`
- Create: `src/app/api/trust-media/route.ts`
- Create: `src/app/api/fragrance-requests/route.ts`
- Create: `src/app/api/stock-notifications/route.ts`
- Create: `src/components/storefront/request-fragrance-form.tsx`
- Create: `src/components/storefront/notify-me-form.tsx`
- Test: `tests/validation.test.ts`

- [ ] **Step 1: Add validation schemas**

Create Zod schemas for fragrance requests and stock notifications:

```ts
import { z } from "zod";

export const fragranceRequestSchema = z.object({
  productName: z.string().min(2),
  brandName: z.string().min(2),
  size: z.string().min(1),
  customerName: z.string().min(2),
  contact: z.string().min(6)
});

export const stockNotificationSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  customerName: z.string().min(2),
  contact: z.string().min(6)
});
```

- [ ] **Step 2: Add API routes**

Create GET routes for catalog resources using repository functions. Create POST routes for fragrance requests and stock notifications that validate input and return `201` with `{ "mode": "seed", "status": "received" }` when Supabase is not configured.

- [ ] **Step 3: Add forms**

Create client forms with React Hook Form and Zod resolver. On success, show `Request received. Our team will contact you via WhatsApp.` for fragrance requests and `Notification saved. We will contact you when this item is available.` for stock notifications. On network failure, show `Submission failed. Please try again or contact us via WhatsApp.` Mount request form on Contact, Sampling, and product pages. Mount notify form on out-of-stock product variants.

- [ ] **Step 4: Test validation**

Create `tests/validation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { fragranceRequestSchema, stockNotificationSchema } from "@/lib/validation";

describe("public form validation", () => {
  it("accepts valid fragrance requests", () => {
    expect(
      fragranceRequestSchema.parse({
        productName: "Gris Charnel",
        brandName: "BDK Parfums",
        size: "100ml",
        customerName: "Customer",
        contact: "081234567890"
      }).productName
    ).toBe("Gris Charnel");
  });

  it("rejects invalid stock notifications", () => {
    expect(() =>
      stockNotificationSchema.parse({
        productId: "",
        customerName: "A",
        contact: ""
      })
    ).toThrow();
  });
});
```

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm test
npm run typecheck
npm run build
```

Expected: tests, typecheck, and build pass.

Commit:

```bash
git add src/app/api src/components/storefront src/lib/validation.ts tests/validation.test.ts
git commit -m "feat: add storefront API routes and request forms"
```

## Task 8: Build Admin Authentication And Admin Shell

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/components/admin/admin-login-form.tsx`
- Create: `src/lib/admin-auth.ts`

- [ ] **Step 1: Add admin auth helper**

Create `src/lib/admin-auth.ts`:

```ts
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { id: "local-admin", email: "local@example.com" };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return { id: user.id, email: user.email ?? "admin" };
}
```

- [ ] **Step 2: Build admin login and shell**

Create login form that calls Supabase Auth when configured and displays `Supabase is not configured. Admin runs in local preview mode.` when not configured. Create admin shell with navigation links to dashboard, products, brands, banners, testimonials, discover, trust media, requests, and stock notifications.

- [ ] **Step 3: Verify and commit**

Run:

```bash
npm run typecheck
npm run build
```

Expected: admin routes build successfully.

Commit:

```bash
git add src/app/admin src/components/admin src/lib/admin-auth.ts
git commit -m "feat: add admin auth shell"
```

## Task 9: Build Admin CRUD Screens And Cloudinary Uploads

**Files:**
- Create: `src/lib/cloudinary.ts`
- Create: `src/app/api/cloudinary/signature/route.ts`
- Create: `src/components/admin/cloudinary-upload.tsx`
- Create: `src/components/admin/product-form.tsx`
- Create: `src/components/admin/brand-form.tsx`
- Create: `src/components/admin/content-form.tsx`
- Create: `src/app/admin/products/page.tsx`
- Create: `src/app/admin/products/new/page.tsx`
- Create: `src/app/admin/products/[id]/page.tsx`
- Create: `src/app/admin/brands/page.tsx`
- Create: `src/app/admin/brands/new/page.tsx`
- Create: `src/app/admin/brands/[id]/page.tsx`
- Create: `src/app/admin/banners/page.tsx`
- Create: `src/app/admin/testimonials/page.tsx`
- Create: `src/app/admin/discover/page.tsx`
- Create: `src/app/admin/trust-media/page.tsx`
- Create: `src/app/admin/requests/page.tsx`
- Create: `src/app/admin/stock-notifications/page.tsx`

- [ ] **Step 1: Add Cloudinary signing route**

Create `src/lib/cloudinary.ts` with SHA-1 signature generation using Node `crypto`. Create `/api/cloudinary/signature` that requires admin, validates Cloudinary env vars, and returns `timestamp`, `signature`, `apiKey`, `cloudName`, and `folder`. Use folder `authenticperfumes/catalog` by default and accept `folder=trust-media` or `folder=banners` query values that map to `authenticperfumes/trust-media` and `authenticperfumes/banners`.

- [ ] **Step 2: Add upload component**

Create a client upload component that requests the signature route, posts the file to Cloudinary, shows progress, validates image/video type, and returns `secure_url`, `public_id`, `resource_type`, width, and height to parent forms.

- [ ] **Step 3: Add admin list and form screens**

Create admin product, brand, banner, testimonial, discover, and trust media screens using seed data for list rendering and API calls for save actions. Product publish validation must require brand, name, slug, one image, and one or more variants.

- [ ] **Step 4: Add request and notification management screens**

Create request and stock notification tables with status controls for `new`, `in_progress`, `fulfilled`, and `closed`.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm run typecheck
npm run build
```

Expected: build passes. If Cloudinary credentials are missing, upload UI renders a configuration error instead of crashing.

Commit:

```bash
git add src/app/admin src/app/api/cloudinary src/components/admin src/lib/cloudinary.ts
git commit -m "feat: add admin catalog management and uploads"
```

## Task 10: Final Verification And Polish

**Files:**
- Modify: route and component files touched in earlier tasks if verification finds issues.
- Create: `README.md`

- [ ] **Step 1: Add README**

Create `README.md` with local setup, required environment variables, Supabase schema setup, Cloudinary setup, development commands, and verification commands.

- [ ] **Step 2: Run full local verification**

Run:

```bash
npm test
npm run typecheck
npm run build
```

Expected: tests pass, TypeScript passes, and production build passes.

- [ ] **Step 3: Start dev server**

Run:

```bash
npm run dev
```

Expected: Next.js starts on `http://localhost:3000` or the next available port.

- [ ] **Step 4: Browser verification**

Open the local site and verify:

- Desktop homepage has Luckyscent-like boutique rhythm and no broken layout.
- Mobile homepage has usable navigation and no overlapping text.
- `/shop` filters by search, brand, status, and notes.
- `/brands` searches and groups 300-ready brand layout cleanly with seed subset.
- `/products/xerjoff-naxos-100ml` shows gallery, variants, prices, WhatsApp, request, and notify controls.
- `/pre-order` clearly explains process and refund policy.
- `/testimonials` shows trust center categories.
- `/admin/login` renders.
- `/admin/products` renders local-development admin state.

- [ ] **Step 5: Commit final polish**

```bash
git add README.md src
git commit -m "chore: verify Authentic Perfumes MVP"
```
