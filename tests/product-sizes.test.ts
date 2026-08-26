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
    expect(
      uniqueSortedProductSizes(["12 perfume blotters", "10ml", "10ml", "Gift set"])
    ).toEqual(["10ml", "12 perfume blotters", "Gift set"]);
  });
});
