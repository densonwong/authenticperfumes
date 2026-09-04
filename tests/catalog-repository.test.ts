import { describe, expect, it } from "vitest";
import {
  getBestSellers,
  getBrandBySlug,
  getBrands,
  getNewArrivals,
  getProductBySlug,
  getProductsByBrandId
} from "../src/lib/repositories/catalog";
import { getProducts, getPreOrderProducts, getReadyStockProducts } from "../src/lib/repositories/catalog";
import { seedProducts } from "../src/lib/seed-data";

describe("catalog repository", () => {
  it("hides variantless products from every public collection and restores them when a size returns", async () => {
    const product = seedProducts[0];
    const variants = product.variants;
    product.variants = [];
    try {
      expect(await getProductBySlug(product.slug)).toBeNull();
      for (const collection of [await getProducts(), await getProductsByBrandId(product.brandId),
        await getNewArrivals(), await getBestSellers(), await getPreOrderProducts(), await getReadyStockProducts()]) {
        expect(collection.some(p => p.id === product.id)).toBe(false);
      }
      expect(seedProducts.find(p => p.id === product.id)).toBe(product);
    } finally { product.variants = variants; }
    expect((await getProductBySlug(product.slug))?.id).toBe(product.id);
  });
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

  it("returns products scoped to a brand", async () => {
    const products = await getProductsByBrandId("brand-xerjoff");

    expect(products.length).toBeGreaterThan(0);
    expect(products.every((product) => product.brandId === "brand-xerjoff")).toBe(true);
  });
});
