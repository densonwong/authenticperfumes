import { describe, expect, it } from "vitest";
import { dictionaries } from "../src/lib/i18n";

describe("Indonesian storefront dictionary", () => {
  it("uses Indonesian interface and promotional copy", () => {
    expect(dictionaries.id.announcement).toBe(
      "100% ASLI - BEBAS MEMINTA PARFUM DARI MEREK APA PUN"
    );
    expect(dictionaries.id.nav.home).toBe("Beranda");
    expect(dictionaries.id.common.allBrands).toBe("Semua merek");
    expect(dictionaries.id.common.noBrandsUnder).toBe("Belum ada merek pada huruf");
    expect(dictionaries.id.home.discoverMore).toBe("Lihat selengkapnya");
    expect(dictionaries.id.home.brandUniverse).toBe("Jelajahi merek");
    expect(dictionaries.id.home.requestTitle).toBe("Mencari parfum tertentu? Hubungi kami sekarang");
    expect(dictionaries.id.home.requestBody).toContain("Kirim merek, varian parfum");
    expect(dictionaries.id.home.requestViaWhatsApp).toBe("Hubungi kami sekarang");
    expect(dictionaries.id.trust.authentic).toBe("100% Asli");
    expect(dictionaries.id.trust.sourcing).toBe("Jaminan keaslian");
    expect(dictionaries.id.trust.split).toBe("Pembayaran fleksibel");
    expect(dictionaries.id.trust.consultation).toBe("Konsultasi atau permintaan");
    expect(dictionaries.id.trust.guidance).toBe("Melalui WhatsApp");
    expect(dictionaries.id.shop.body).toBe(
      "Saring parfum pilihan berdasarkan merek, kategori, ukuran, dan status ketersediaan."
    );
    expect(dictionaries.id.shop.searchPlaceholder).toBe("Merek atau nama parfum");
    expect(dictionaries.id.shop.brand).toBe("Merek");
    expect(dictionaries.id.shop.allBrands).toBe("Semua merek");
    expect(dictionaries.id.shop.gender).toBe("Kategori");
    expect(dictionaries.id.shop.noBody).toBe(
      "Coba hapus filter status atau perluas filter merek dan ukuran."
    );
    expect(dictionaries.id.forms.sendRequest).toBe("Kirim melalui WhatsApp");
    expect(dictionaries.id.product.fulfillment).toBe("Ketersediaan");
  });

  it("does not contain known English or mixed-language leaks", () => {
    const serializedDictionary = JSON.stringify(dictionaries.id);
    const bannedPhrases = [
      "via WhatsApp",
      "Semua brand",
      "Nama Brand",
      "Click to Explore Brand",
      "Contact us now"
    ];

    for (const phrase of bannedPhrases) {
      expect(serializedDictionary).not.toContain(phrase);
    }
  });

  it("keeps approved brand and navigation wording", () => {
    expect(dictionaries.id.nav.shop).toBe("Belanja");
    expect(dictionaries.id.product.authentic).toBe("Harga Authentic");
  });

  it("does not change English dictionary values", () => {
    expect(dictionaries.en.nav.home).toBe("Home");
    expect(dictionaries.en.home.discoverMore).toBe("Discover more");
  });
});
