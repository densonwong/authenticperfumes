import { describe, expect, it } from "vitest";
import { calculateSavings, formatRupiah } from "../src/lib/format";
import {
  seedBanners,
  seedBrands,
  seedProducts,
  seedTestimonials
} from "../src/lib/seed-data";
import { slugify } from "../src/lib/slugs";
import { isLocale } from "../src/lib/i18n";
import { localizedPath, switchLocalePath } from "../src/lib/localized-paths";
import { changedDetailPaths } from "../src/lib/cache-paths";
import { isReadyStockProduct } from "../src/lib/product-availability";
import { buildProductWhatsAppMessage, buildWhatsAppUrl, normalizeWhatsAppPhone } from "../src/lib/whatsapp";

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
    const message = buildProductWhatsAppMessage(
      "Xerjoff Naxos",
      "https://example.com/products/xerjoff-naxos",
      "100ml"
    );

    expect(message).toContain("Xerjoff Naxos");
    expect(message).toContain("100ml");
    expect(buildWhatsAppUrl(message, "628111111111")).toContain("https://wa.me/628111111111");
  });

  it("normalizes WhatsApp phone numbers for wa.me links", () => {
    expect(normalizeWhatsAppPhone("+62 812-2899-9598")).toBe("6281228999598");
    expect(buildWhatsAppUrl("Halo", "+62 812-2899-9598")).toContain(
      "https://wa.me/6281228999598"
    );
  });

  it("validates supported storefront locales", () => {
    expect(isLocale("id")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("localizes internal paths without changing external links", () => {
    expect(localizedPath("en", "/products/test?variant=1#buy")).toBe(
      "/en/products/test?variant=1#buy"
    );
    expect(localizedPath("id", "/")).toBe("/id");
    expect(localizedPath("id", "https://wa.me/1")).toBe("https://wa.me/1");
    expect(localizedPath("en", "#details")).toBe("#details");
    expect(localizedPath("id", "/shop?readyStock=true")).toBe(
      "/id/shop?readyStock=true"
    );
    expect(localizedPath("en", "/shop?readyStock=true")).toBe(
      "/en/shop?readyStock=true"
    );
  });

  it("switches locale prefixes while preserving the rest of the URL", () => {
    expect(switchLocalePath("/id/brands/test?q=x#top", "en")).toBe(
      "/en/brands/test?q=x#top"
    );
    expect(switchLocalePath("/brands/test", "id")).toBe("/id/brands/test");
  });
});

describe("catalog detail invalidation paths", () => {
  it("keeps both old and new URLs when a slug changes", () => {
    expect(changedDetailPaths("brands", "old-brand", "new-brand")).toEqual([
      "/brands/old-brand",
      "/brands/new-brand"
    ]);
  });

  it("deduplicates an unchanged slug", () => {
    expect(changedDetailPaths("products", "same-product", "same-product")).toEqual([
      "/products/same-product"
    ]);
  });
});

describe("product availability", () => {
  it("requires a ready flag and a ready-compatible status", () => {
    expect(isReadyStockProduct({ readyStock: true, status: "ready_stock" })).toBe(true);
    expect(isReadyStockProduct({ readyStock: true, status: "limited_stock" })).toBe(true);
    expect(isReadyStockProduct({ readyStock: true, status: "pre_order" })).toBe(false);
    expect(isReadyStockProduct({ readyStock: true, status: "out_of_stock" })).toBe(false);
    expect(isReadyStockProduct({ readyStock: false, status: "ready_stock" })).toBe(false);
  });
});

describe("seed data", () => {
  it("contains the required fallback record counts", () => {
    expect(seedBrands).toHaveLength(12);
    expect(seedProducts).toHaveLength(12);
    expect(seedBanners).toHaveLength(3);
    expect(seedTestimonials).toHaveLength(4);
  });

  it("includes required Xerjoff catalog records", () => {
    expect(seedBrands.find((brand) => brand.slug === "xerjoff")?.name).toBe("Xerjoff");
    expect(seedProducts.find((product) => product.slug === "xerjoff-naxos-100ml")?.name).toBe("Naxos");
  });

  it("uses Unsplash URLs for visual fallback media", () => {
    const urls = [
      ...seedBrands.map((brand) => brand.logoUrl),
      ...seedProducts.flatMap((product) => [product.imageUrl, ...product.galleryUrls]),
      ...seedBanners.map((banner) => banner.imageUrl),
      ...seedTestimonials.map((testimonial) => testimonial.imageUrl)
    ];

    expect(urls.every((url) => url.startsWith("https://images.unsplash.com/"))).toBe(true);
  });
});
