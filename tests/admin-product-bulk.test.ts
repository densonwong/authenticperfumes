import { describe, expect, it } from "vitest";
import {
  applyBulkAvailability,
  filterAdminProductItems,
  parseBulkProductStatusPayload,
  type AdminProductListItem
} from "../src/lib/admin-product-bulk";

const products: AdminProductListItem[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Neroli Nasimba",
    brandName: "Maison Crivelli",
    status: "ready_stock",
    readyStock: true,
    preOrder: false,
    stock: 2,
    fromPrice: 0
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Naxos",
    brandName: "Xerjoff",
    status: "pre_order",
    readyStock: false,
    preOrder: true,
    stock: 0,
    fromPrice: 0
  }
];

describe("admin bulk product helpers", () => {
  it("searches product and brand names case-insensitively", () => {
    expect(
      filterAdminProductItems(products, "crivelli", "all").map((item) => item.name)
    ).toEqual(["Neroli Nasimba"]);
    expect(filterAdminProductItems(products, "NAXOS", "all").map((item) => item.name)).toEqual([
      "Naxos"
    ]);
  });

  it("filters with storefront availability flags", () => {
    expect(filterAdminProductItems(products, "", "ready_stock")).toEqual([products[0]]);
    expect(filterAdminProductItems(products, "", "pre_order")).toEqual([products[1]]);
  });

  it("validates and deduplicates a bulk payload", () => {
    expect(
      parseBulkProductStatusPayload({
        ids: [products[0].id, products[0].id],
        target: "pre_order"
      })
    ).toEqual({ ids: [products[0].id], target: "pre_order" });
  });

  it("accepts both supported targets and rejects non-array IDs", () => {
    expect(
      parseBulkProductStatusPayload({ ids: [products[0].id], target: "ready_stock" })
    ).toEqual({ ids: [products[0].id], target: "ready_stock" });
    expect(
      parseBulkProductStatusPayload({ ids: [products[1].id], target: "pre_order" })
    ).toEqual({ ids: [products[1].id], target: "pre_order" });
    expect(
      parseBulkProductStatusPayload({ ids: products[0].id, target: "pre_order" })
    ).toEqual({ error: "Select at least one product." });
  });

  it("rejects invalid, empty, and oversized payloads", () => {
    expect(parseBulkProductStatusPayload({ ids: [], target: "pre_order" })).toEqual({
      error: "Select at least one product."
    });
    expect(
      parseBulkProductStatusPayload({ ids: ["not-a-uuid"], target: "ready_stock" })
    ).toEqual({ error: "Every product ID must be a valid UUID." });
    expect(
      parseBulkProductStatusPayload({
        ids: Array.from(
          { length: 2001 },
          (_, index) => `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`
        ),
        target: "ready_stock"
      })
    ).toEqual({ error: "You can update at most 2,000 products at once." });
    expect(
      parseBulkProductStatusPayload({ ids: [products[0].id], target: "out_of_stock" })
    ).toEqual({ error: "Target must be ready_stock or pre_order." });
  });

  it("maps successful status changes without altering stock or price", () => {
    expect(
      applyBulkAvailability(products, new Set([products[0].id]), "pre_order")[0]
    ).toMatchObject({
      status: "pre_order",
      readyStock: false,
      preOrder: true,
      stock: 2,
      fromPrice: 0
    });
  });
});
