import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("runs the test environment", () => {
    expect("Authentic Perfumes").toContain("Perfumes");
  });
});
