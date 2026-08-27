import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompleteCollectionCta } from "../src/components/storefront/complete-collection-cta";

describe("CompleteCollectionCta", () => {
  it("renders Indonesian copy and destination", () => {
    render(<CompleteCollectionCta locale="id" />);

    expect(screen.getByText("KOLEKSI LENGKAP KAMI")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Jelajahi Seluruh Koleksi Parfum Kami" })
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "LIHAT SEMUA PARFUM" }).getAttribute("href")).toBe(
      "/id/shop"
    );
  });

  it("renders English copy and destination", () => {
    render(<CompleteCollectionCta locale="en" />);

    expect(screen.getByText("OUR COMPLETE COLLECTION")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Explore Our Complete Fragrance Collection" })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "DISCOVER ALL FRAGRANCES" }).getAttribute("href")
    ).toBe("/en/shop");
  });
});
