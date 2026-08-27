import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "../src/components/storefront/site-header";
import { dictionaries } from "../src/lib/i18n";

vi.mock("next/navigation", () => ({
  usePathname: () => "/id"
}));

describe("SiteHeader", () => {
  it("keeps the standalone request link and omits it from Perfumes dropdowns", () => {
    render(<SiteHeader locale="id" dictionary={dictionaries.id.nav} />);

    const requestLinks = screen.getAllByRole("link", { name: "REQ FRAGRANCE" });
    expect(requestLinks).toHaveLength(2);
    expect(requestLinks.every((link) => link.getAttribute("href")?.startsWith("https://wa.me/"))).toBe(
      true
    );
    expect(decodeURIComponent(requestLinks[0].getAttribute("href") ?? "")).toContain(
      "Halo Authentic Perfumes 8, saya ingin mencari parfum. Mohon bantu cek stok, harga, dan opsi pemesanan."
    );
    expect(screen.getAllByText("Parfum").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Lihat Semua Parfum").length).toBeGreaterThan(0);
    expect(screen.queryByText("Discover All Fragrances")).toBeNull();
    expect(screen.queryByText("New Arrival")).toBeNull();
    expect(screen.queryByText("REQ PERFUME")).toBeNull();
  });
});
