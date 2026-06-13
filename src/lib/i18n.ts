import { cookies } from "next/headers";
import type { ProductStatus } from "@/lib/types";

export type Locale = "en" | "id";

export const defaultLocale: Locale = "id";

export function normalizeLocale(value: string | undefined | null): Locale {
  if (value === "en" || value === "id") return value;
  return defaultLocale;
}

export async function getLocale() {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get("ap_locale")?.value);
}

export type Dictionary = {
  announcement: string;
  nav: Record<
    | "home"
    | "shop"
    | "brands"
    | "newArrivals"
    | "bestSellers"
    | "preOrder"
    | "testimonials"
    | "contact"
    | "search"
    | "open"
    | "language",
    string
  >;
  common: Record<
    | "viewAll"
    | "allBrands"
    | "search"
    | "clear"
    | "applyFilters"
    | "from"
    | "fragrance"
    | "fragrances"
    | "listed"
    | "bottles"
    | "noBrandsUnder"
    | "yet",
    string
  >;
  status: Record<ProductStatus, string>;
  home: Record<
    | "freshEdit"
    | "newNoteworthy"
    | "customerFavorites"
    | "bestSellers"
    | "fastDispatch"
    | "readyStock"
    | "conciergeSourcing"
    | "preOrderPicks"
    | "discoverScent"
    | "consultNow"
    | "discoverMore"
    | "brandUniverse"
    | "featuredHouses"
    | "requestFragrance"
    | "requestTitle"
    | "requestBody"
    | "requestViaWhatsApp",
    string
  >;
  trust: Record<"authentic" | "sourcing" | "shipping" | "dispatch" | "split" | "flexible" | "consultation" | "guidance", string>;
  tile: Record<"featured" | "shop", string>;
  shop: Record<
    | "catalog"
    | "title"
    | "body"
    | "refine"
    | "searchPlaceholder"
    | "brand"
    | "allBrands"
    | "gender"
    | "note"
    | "anyNote"
    | "price"
    | "anyPrice"
    | "size"
    | "anySize"
    | "noTitle"
    | "noBody"
    | "of",
    string
  >;
  forms: Record<
    | "requestEyebrow"
    | "requestTitle"
    | "productName"
    | "brandName"
    | "size"
    | "name"
    | "contact"
    | "sendRequest"
    | "submitting"
    | "requestSuccess"
    | "requestError"
    | "notifyEyebrow"
    | "notifyTitle"
    | "saveNotification"
    | "notifySuccess"
    | "nameError"
    | "contactError"
    | "productError"
    | "brandError"
    | "sizeError",
    string
  >;
  product: Record<
    | "selectedSize"
    | "stock"
    | "retail"
    | "authentic"
    | "savings"
    | "status"
    | "statusBody"
    | "installment"
    | "buyWhatsapp"
    | "requestSimilar"
    | "origin"
    | "notes"
    | "sku"
    | "fulfillment"
    | "preOrderAvailable"
    | "readyStockFocused"
    | "previousImage"
    | "nextImage"
    | "imageThumbnails"
    | "viewImage",
    string
  >;
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    announcement:
      "100% ORIGINAL - BEBAS REQUEST BRAND PARFUM",
    nav: {
      home: "Home",
      shop: "Shop",
      brands: "Brands A-Z",
      newArrivals: "New Arrivals",
      bestSellers: "Best Sellers",
      preOrder: "Pre Order",
      testimonials: "Testimonials",
      contact: "Contact",
      search: "Search catalog",
      open: "Open navigation",
      language: "Language"
    },
    common: {
      viewAll: "View all",
      allBrands: "All brands",
      search: "Search",
      clear: "Clear",
      applyFilters: "Apply filters",
      from: "From",
      fragrance: "fragrance",
      fragrances: "fragrances",
      listed: "listed",
      bottles: "bottles",
      noBrandsUnder: "No brands listed under",
      yet: "yet"
    },
    status: {
      ready_stock: "Ready stock",
      pre_order: "Pre order",
      limited_stock: "Limited stock",
      out_of_stock: "Out of stock"
    } satisfies Record<ProductStatus, string>,
    home: {
      freshEdit: "New Arrivals",
      newNoteworthy: "New Arrivals",
      customerFavorites: "Best Seller",
      bestSellers: "Best Sellers",
      fastDispatch: "Ready Stock",
      readyStock: "Ready Stock",
      conciergeSourcing: "Discover Your Scent",
      preOrderPicks: "Discover Your Scent",
      discoverScent: "Discover Your Scent",
      consultNow: "Consult now",
      discoverMore: "Discover more",
      brandUniverse: "Click to Explore Brand",
      featuredHouses: "Click to Explore Brand",
      requestFragrance: "Request fragrance",
      requestTitle: "Looking for something specific? Contact us now",
      requestBody:
        "Share the house, size, and preferred timeline. We will confirm availability, estimated landed price, and ordering options through WhatsApp.",
      requestViaWhatsApp: "Contact us now"
    },
    trust: {
      authentic: "100% Original",
      sourcing: "Original guarantee",
      shipping: "Ship to All Indonesia",
      dispatch: "Nationwide delivery",
      split: "Flexible Payment",
      flexible: "Split payment available",
      consultation: "Consult or Request",
      guidance: "Via WhatsApp"
    },
    tile: {
      featured: "Featured edit",
      shop: "Shop collection"
    },
    shop: {
      catalog: "Catalog",
      title: "Shop fragrances",
      body: "Filter curated bottles by house, note, price, size, and fulfillment status.",
      refine: "Refine",
      searchPlaceholder: "Brand, note, perfume",
      brand: "Brand",
      allBrands: "All brands",
      gender: "Gender",
      note: "Note",
      anyNote: "Any note",
      price: "Price",
      anyPrice: "Any price",
      size: "Size",
      anySize: "Any size",
      noTitle: "No matching bottles",
      noBody: "Try removing a status toggle or broadening the note and price filters.",
      of: "of"
    },
    forms: {
      requestEyebrow: "Fragrance request",
      requestTitle: "Request a perfume",
      productName: "Product name",
      brandName: "Brand name",
      size: "Size",
      name: "Name",
      contact: "WhatsApp number",
      sendRequest: "Request via WhatsApp",
      submitting: "Opening WhatsApp",
      requestSuccess: "Opening WhatsApp.",
      requestError: "Submission failed. Please try again or contact us via WhatsApp.",
      notifyEyebrow: "Stock notification",
      notifyTitle: "Notify me",
      saveNotification: "Save notification",
      notifySuccess: "Notification saved. We will contact you when this item is available.",
      nameError: "Enter your name.",
      contactError: "Enter a valid contact.",
      productError: "Enter a product name.",
      brandError: "Enter a brand name.",
      sizeError: "Enter a preferred size."
    },
    product: {
      selectedSize: "Selected size",
      stock: "stock",
      retail: "Retail",
      authentic: "Authentic",
      savings: "Savings",
      status: "Status",
      statusBody: "Final stock and dispatch timing are confirmed before payment through WhatsApp.",
      installment: "Split payment is available in 2-3 installments for selected bottles. Terms are confirmed through WhatsApp before payment.",
      buyWhatsapp: "Buy via WhatsApp",
      requestSimilar: "Request similar fragrance",
      origin: "Origin",
      notes: "Notes",
      sku: "SKU",
      fulfillment: "Fulfillment",
      preOrderAvailable: "Pre order available",
      readyStockFocused: "Ready stock focused",
      previousImage: "Previous product image",
      nextImage: "Next product image",
      imageThumbnails: "Product image thumbnails",
      viewImage: "View product image"
    }
  },
  id: {
    announcement:
      "100% ORIGINAL - BEBAS REQUEST BRAND PARFUM",
    nav: {
      home: "Home",
      shop: "Belanja",
      brands: "Brand A-Z",
      newArrivals: "Terbaru",
      bestSellers: "Terlaris",
      preOrder: "Pre Order",
      testimonials: "Testimoni",
      contact: "Kontak",
      search: "Cari katalog",
      open: "Buka navigasi",
      language: "Bahasa"
    },
    common: {
      viewAll: "Lihat semua",
      allBrands: "Semua brand",
      search: "Cari",
      clear: "Hapus",
      applyFilters: "Terapkan filter",
      from: "Mulai",
      fragrance: "parfum",
      fragrances: "parfum",
      listed: "terdaftar",
      bottles: "botol",
      noBrandsUnder: "Belum ada brand di huruf",
      yet: ""
    },
    status: {
      ready_stock: "Ready stock",
      pre_order: "Pre order",
      limited_stock: "Stok terbatas",
      out_of_stock: "Stok habis"
    } satisfies Record<ProductStatus, string>,
    home: {
      freshEdit: "New Arrivals",
      newNoteworthy: "New Arrivals",
      customerFavorites: "Best Seller",
      bestSellers: "Best Seller",
      fastDispatch: "Ready Stock",
      readyStock: "Ready Stock",
      conciergeSourcing: "Discover Your Scent",
      preOrderPicks: "Discover Your Scent",
      discoverScent: "Discover Your Scent",
      consultNow: "Consult now",
      discoverMore: "Discover more",
      brandUniverse: "Click to Explore Brand",
      featuredHouses: "Click to Explore Brand",
      requestFragrance: "Request parfum",
      requestTitle: "Looking for something specific? Contact us now",
      requestBody:
        "Kirim brand, ukuran, dan timeline yang diinginkan. Kami akan konfirmasi ketersediaan, estimasi harga landed, dan opsi order via WhatsApp.",
      requestViaWhatsApp: "Contact us now"
    },
    trust: {
      authentic: "100% Original",
      sourcing: "Jaminan original",
      shipping: "Pengiriman ke seluruh Indonesia",
      dispatch: "Pengiriman nasional",
      split: "Pembayaran Fleksibel",
      flexible: "Cicilan tersedia",
      consultation: "Konsultasi atau Request",
      guidance: "Via WhatsApp"
    },
    tile: {
      featured: "Pilihan utama",
      shop: "Belanja koleksi"
    },
    shop: {
      catalog: "Katalog",
      title: "Belanja parfum",
      body: "Filter botol pilihan berdasarkan brand, notes, harga, ukuran, dan status pemenuhan.",
      refine: "Filter",
      searchPlaceholder: "Brand, notes, parfum",
      brand: "Brand",
      allBrands: "Semua brand",
      gender: "Gender",
      note: "Notes",
      anyNote: "Semua notes",
      price: "Harga",
      anyPrice: "Semua harga",
      size: "Ukuran",
      anySize: "Semua ukuran",
      noTitle: "Tidak ada botol yang cocok",
      noBody: "Coba hapus filter status atau perluas filter notes dan harga.",
      of: "dari"
    },
    forms: {
      requestEyebrow: "Request parfum",
      requestTitle: "Request parfum",
      productName: "Nama parfum",
      brandName: "Nama brand",
      size: "Ukuran",
      name: "Nama",
      contact: "Nomor WhatsApp",
      sendRequest: "Request via WhatsApp",
      submitting: "Membuka WhatsApp",
      requestSuccess: "Membuka WhatsApp.",
      requestError: "Gagal mengirim. Silakan coba lagi atau hubungi kami via WhatsApp.",
      notifyEyebrow: "Notifikasi stok",
      notifyTitle: "Beri tahu saya",
      saveNotification: "Simpan notifikasi",
      notifySuccess: "Notifikasi disimpan. Kami akan menghubungi saat item tersedia.",
      nameError: "Masukkan nama Anda.",
      contactError: "Masukkan kontak yang valid.",
      productError: "Masukkan nama parfum.",
      brandError: "Masukkan nama brand.",
      sizeError: "Masukkan ukuran yang diinginkan."
    },
    product: {
      selectedSize: "Ukuran dipilih",
      stock: "stok",
      retail: "Retail",
      authentic: "Harga Authentic",
      savings: "Hemat",
      status: "Status",
      statusBody: "Stok final dan waktu pengiriman dikonfirmasi sebelum pembayaran via WhatsApp.",
      installment: "Cicilan 2-3x tersedia untuk botol tertentu. Ketentuan dikonfirmasi via WhatsApp sebelum pembayaran.",
      buyWhatsapp: "Beli via WhatsApp",
      requestSimilar: "Request parfum serupa",
      origin: "Asal",
      notes: "Notes",
      sku: "SKU",
      fulfillment: "Fulfillment",
      preOrderAvailable: "Pre order tersedia",
      readyStockFocused: "Fokus ready stock",
      previousImage: "Gambar produk sebelumnya",
      nextImage: "Gambar produk berikutnya",
      imageThumbnails: "Thumbnail gambar produk",
      viewImage: "Lihat gambar produk"
    }
  }
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
