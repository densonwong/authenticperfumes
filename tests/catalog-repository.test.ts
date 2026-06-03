import { describe, expect, it } from "vitest";
import {
  getBestSellers,
  getBrandBySlug,
  getBrands,
  getNewArrivals,
  getProductBySlug
} from "../src/lib/repositories/catalog";

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
