import { describe, expect, it } from "vitest";
import { calculateSavings, formatRupiah } from "../src/lib/format";
import {
  seedBanners,
  seedBrands,
  seedProducts,
  seedTestimonials
} from "../src/lib/seed-data";
import { slugify } from "../src/lib/slugs";
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from "../src/lib/whatsapp";

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
