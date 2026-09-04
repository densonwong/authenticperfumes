import { describe, expect, it } from "vitest";
import { parseCatalogSelection, productSizeKey } from "../src/lib/catalog-management";

const id = "11111111-1111-4111-8111-111111111111";
describe("catalog management", () => {
  it("normalizes volume formats without conflating non-volume labels", () => {
    expect(productSizeKey("1,5 ml")).toBe(productSizeKey("1.5ml"));
    expect(productSizeKey("1 L")).toBe(productSizeKey("1000ml"));
    expect(productSizeKey("2ml")).not.toBe(productSizeKey("12ml"));
    expect(productSizeKey(" Gift Set ")).toBe(productSizeKey("gift set"));
  });
  it("deduplicates a valid action selection", () => {
    expect(parseCatalogSelection({ action: "set_best_seller", ids: [id, id] })).toEqual({
      action: "set_best_seller", ids: [id], preview: false, confirmedEmptyProducts: []
    });
  });
  it("rejects unsafe and oversized input", () => {
    for (const body of [null, {}, { action: "delete_products", ids: [] },
      { action: "other", ids: [id] }, { action: "delete_products", ids: ["bad"] },
      { action: "delete_variants", ids: Array(2001).fill(id) },
      { action: "delete_variants", ids: [id], preview: "false" },
      { action: "delete_variants", ids: [id], confirmedEmptyProducts: ["bad"] }]) {
      expect(parseCatalogSelection(body)).toHaveProperty("error");
    }
  });
});
