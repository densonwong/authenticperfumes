import { describe, expect, it } from "vitest";
import { fragranceRequestSchema, stockNotificationSchema } from "../src/lib/validation";

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
