import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FilterPanel } from "../src/components/storefront/filter-panel";
import { ProductCard } from "../src/components/storefront/product-card";
import { ProductSlider } from "../src/components/storefront/product-slider";
import { RequestFragranceCta } from "../src/components/storefront/request-fragrance-cta";
import { SiteFooter } from "../src/components/storefront/site-footer";
import { TestimonialGrid } from "../src/components/storefront/testimonial-grid";
import { TrustStrip } from "../src/components/storefront/trust-strip";
import { dictionaries } from "../src/lib/i18n";
import type { Product } from "../src/lib/types";

const product: Product = {
  id: "product-1",
  brandId: "brand-1",
  brandName: "Maison Test",
  slug: "original-name",
  name: "Original Name",
  imageUrl: "/product.jpg",
  galleryUrls: [],
  gender: "unisex",
  concentration: "Eau de Parfum",
  notes: ["Rose"],
  countryOfOrigin: "France",
  description: "Original catalog description",
  status: "ready_stock",
  bestSeller: true,
  newArrival: false,
  readyStock: true,
  preOrder: false,
  variants: [
    {
      id: "variant-1",
      size: "50ml",
      retailPrice: 0,
      authenticPrice: 0,
      stock: 1,
      status: "ready_stock"
    }
  ]
};

describe("localized storefront components", () => {
  it("renders the Indonesian fragrance request CTA", () => {
    render(<RequestFragranceCta locale="id" />);
    const requestLink = screen.getByRole("link", { name: "Minta Bantuan Mencari Parfum" });
    expect(requestLink.getAttribute("href")).toContain("wa.me");
    expect(decodeURIComponent(requestLink.getAttribute("href") ?? "")).toContain(
      "Halo Authentic Perfumes 8, saya ingin mencari parfum. Mohon bantu cek stok, harga, dan opsi pemesanan."
    );
    expect(screen.queryByText("Request Fragrance")).toBeNull();
  });

  it("keeps the English fragrance request CTA", () => {
    render(<RequestFragranceCta locale="en" />);
    expect(screen.getByRole("link", { name: "Request Fragrance" })).toBeTruthy();
  });

  it("includes the selected brand naturally in an Indonesian fragrance request", () => {
    render(<RequestFragranceCta locale="id" brandName="Maison Test" />);
    const requestLink = screen.getByRole("link", { name: "Minta Bantuan Mencari Parfum" });
    expect(decodeURIComponent(requestLink.getAttribute("href") ?? "")).toContain(
      "saya ingin mencari parfum dari Maison Test"
    );
  });

  it("renders Indonesian catalog filters", () => {
    render(
      <FilterPanel
        brands={[]}
        products={[product]}
        selected={{}}
        dictionary={{ ...dictionaries.id.shop, ...dictionaries.id.common }}
        locale="id"
      />
    );
    expect(screen.getByText("Uniseks")).toBeTruthy();
    expect(screen.getByText("Wanita")).toBeTruthy();
    expect(screen.getByText("Pria")).toBeTruthy();
    expect(screen.getByText("Stok tersedia")).toBeTruthy();
    expect(screen.getByText("Pre-order")).toBeTruthy();
    expect(screen.getByText("Terlaris")).toBeTruthy();
    expect(screen.getByText("Produk terbaru")).toBeTruthy();
    expect(screen.queryByText("Ready stock")).toBeNull();
  });

  it("localizes footer headings and links without changing the English footer", () => {
    const { rerender } = render(
      <SiteFooter locale="id" dictionary={dictionaries.id} />
    );
    expect(screen.getByRole("heading", { name: "Jelajahi" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Bantuan" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Ikuti Kami" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Beranda" })).toBeTruthy();
    expect(
      screen.getByText(
        "Parfum niche dan desainer asli dengan layanan pencarian merek, pre-order, dan konsultasi melalui WhatsApp."
      )
    ).toBeTruthy();
    expect(screen.queryByText(/via WhatsApp/i)).toBeNull();

    rerender(<SiteFooter locale="en" dictionary={dictionaries.en} />);
    expect(screen.getByRole("heading", { name: "Explore" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
  });

  it("localizes price fallback, slider controls, testimonials, and store guarantees", () => {
    const { unmount } = render(
      <ProductCard product={product} dictionary={dictionaries.id} locale="id" />
    );
    expect(screen.getByText("Tanya")).toBeTruthy();
    expect(screen.getByText("Original Name")).toBeTruthy();
    unmount();

    const slider = render(
      <ProductSlider products={[product]} dictionary={dictionaries.id} locale="id" />
    );
    expect(screen.getByRole("button", { name: "Geser ke kiri" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Geser ke kanan" })).toBeTruthy();
    slider.unmount();

    const testimonial = render(
      <TestimonialGrid
        locale="id"
        testimonials={[
          {
            id: "testimonial-1",
            customerName: "Customer Original",
            quote: "Original customer quote",
            productName: "Original Product",
            imageUrl: "/testimonial.jpg"
          }
        ]}
      />
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Buka foto testimoni dari Customer Original" })
    );
    expect(screen.getByRole("dialog", { name: "Foto testimoni dari Customer Original" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Tutup foto testimoni" })).toBeTruthy();
    expect(screen.getByText(/Original customer quote/)).toBeTruthy();
    testimonial.unmount();

    render(<TrustStrip dictionary={dictionaries.id.trust} locale="id" />);
    expect(screen.getByRole("region", { name: "Jaminan toko" })).toBeTruthy();
  });
});
