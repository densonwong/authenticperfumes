import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const home = readFileSync("src/app/(localized)/[locale]/(storefront)/page.tsx", "utf8");
const about = readFileSync("src/app/(localized)/[locale]/(storefront)/about/page.tsx", "utf8");
const bestSellers = readFileSync("src/app/(localized)/[locale]/(storefront)/best-sellers/page.tsx", "utf8");
const newArrivals = readFileSync("src/app/(localized)/[locale]/(storefront)/new-arrivals/page.tsx", "utf8");
const brands = readFileSync("src/app/(localized)/[locale]/(storefront)/brands/page.tsx", "utf8");
const brandDetail = readFileSync("src/app/(localized)/[locale]/(storefront)/brands/[slug]/page.tsx", "utf8");
const contact = readFileSync("src/app/(localized)/[locale]/(storefront)/contact/page.tsx", "utf8");
const preOrder = readFileSync("src/app/(localized)/[locale]/(storefront)/pre-order/page.tsx", "utf8");
const productDetail = readFileSync("src/app/(localized)/[locale]/(storefront)/products/[slug]/page.tsx", "utf8");
const shop = readFileSync("src/app/(localized)/[locale]/(storefront)/shop/page.tsx", "utf8");
const testimonials = readFileSync("src/app/(localized)/[locale]/(storefront)/testimonials/page.tsx", "utf8");

describe("Indonesian page-owned copy", () => {
  it("contains localized homepage banner copy", () => {
    expect(home).toContain('title: "Temukan aroma pilihan Anda"');
    expect(home).toContain('title: "Temukan aroma khas Anda"');
    expect(home).toContain('if (banner.position === "primary")');
    expect(home).not.toContain('title: "Discover your scent"');
  });

  it("uses Indonesian Instagram update wording", () => {
    expect(contact).toContain("produk terbaru, stok kembali, dan promosi");
    expect(contact).not.toContain("new arrivals, restock, dan promotion");
  });

  it("provides Indonesian metadata for static storefront pages", () => {
    expect(home).toContain('title: "Parfum Asli Niche dan Desainer"');
    expect(about).toContain('title: "Tentang Kami"');
    expect(bestSellers).toContain('title: "Parfum Terlaris"');
    expect(newArrivals).toContain('title: "Produk Parfum Terbaru"');
    expect(brands).toContain('title: "Daftar Merek Parfum"');
    expect(contact).toContain('title: "Kontak Kami"');
    expect(preOrder).toContain('title: "Pre-Order Parfum"');
    expect(shop).toContain('title: "Belanja Parfum"');
    expect(testimonials).toContain('title: "Testimoni Pelanggan"');
  });

  it("localizes product labels and structured navigation", () => {
    expect(productDetail).toContain('unisex: "Uniseks", women: "Wanita", men: "Pria"');
    expect(productDetail).toContain('locale === "id" ? "Beranda" : "Home"');
    expect(productDetail).toContain('locale === "id" ? "Belanja" : "Shop"');
    expect(brandDetail).toContain('locale === "id" ? "Merek" : "Brands"');
  });

  it("keeps catalog and customer content sourced without translation", () => {
    expect(brandDetail).toContain("description: brand?.description");
    expect(brandDetail).toContain("{brand.description}");
    expect(productDetail).toContain("description: product?.description");
    expect(productDetail).toContain("{product.concentration}");
    expect(testimonials).toContain("testimonials={testimonials}");
  });

  it("keeps the English pre-order policy copy", () => {
    expect(preOrder).toContain('const termsGroups = [\n  {\n    title: "Ready Stock"');
    expect(preOrder).toContain('const termsGroupsId = [\n  {\n    title: "Stok Tersedia"');
  });
});
