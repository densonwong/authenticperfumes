import type { ProductStatus } from "@/lib/types";

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "id";

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}

export function normalizeLocale(value: string | undefined | null): Locale {
  if (isLocale(value)) return value;
  return defaultLocale;
}

export type Dictionary = {
  announcement: string;
  announcementItems: string[];
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
    | "authentic"
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
    announcementItems: [
      "100% ORIGINAL",
      "READY STOCK",
      "FREE SCENT CONSULTATION",
      "SHIPPING NATIONWIDE"
    ],
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
        "Send the brand, fragrance variant, and desired size. We will confirm availability, the estimated price, and ordering options through WhatsApp.",
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
      body: "Filter curated bottles by house, gender, size, and fulfillment status.",
      refine: "Refine",
      searchPlaceholder: "Brand or perfume name",
      brand: "Brand",
      allBrands: "All brands",
      gender: "Gender",
      size: "Size",
      anySize: "Any size",
      noTitle: "No matching bottles",
      noBody: "Try removing a status toggle or widening the brand and size filters.",
      of: "of"
    },
    forms: {
      requestEyebrow: "Perfume request",
      requestTitle: "Perfume Request",
      productName: "Perfume Name",
      brandName: "Brand Name",
      size: "Size",
      name: "Name",
      contact: "WhatsApp Number",
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
      authentic: "Authentic",
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
      "100% ASLI - BEBAS MEMINTA PARFUM DARI MEREK APA PUN",
    announcementItems: [
      "100% ASLI",
      "STOK TERSEDIA",
      "GRATIS KONSULTASI AROMA",
      "KIRIM KE SELURUH INDONESIA"
    ],
    nav: {
      home: "Beranda",
      shop: "Belanja",
      brands: "Merek A-Z",
      newArrivals: "Produk Terbaru",
      bestSellers: "Terlaris",
      preOrder: "Pre-Order",
      testimonials: "Testimoni",
      contact: "Kontak",
      search: "Cari katalog",
      open: "Buka navigasi",
      language: "Bahasa"
    },
    common: {
      viewAll: "Lihat semua",
      allBrands: "Semua merek",
      search: "Cari",
      clear: "Hapus",
      applyFilters: "Terapkan filter",
      from: "Mulai",
      fragrance: "parfum",
      fragrances: "parfum",
      listed: "terdaftar",
      bottles: "botol",
      noBrandsUnder: "Belum ada merek pada huruf",
      yet: ""
    },
    status: {
      ready_stock: "Stok tersedia",
      pre_order: "Pre-order",
      limited_stock: "Stok terbatas",
      out_of_stock: "Stok habis"
    } satisfies Record<ProductStatus, string>,
    home: {
      freshEdit: "Produk Terbaru",
      newNoteworthy: "Produk Terbaru",
      customerFavorites: "Favorit Pelanggan",
      bestSellers: "Terlaris",
      fastDispatch: "Stok Tersedia",
      readyStock: "Stok Tersedia",
      conciergeSourcing: "Temukan Aroma Pilihan Anda",
      preOrderPicks: "Temukan Aroma Pilihan Anda",
      discoverScent: "Temukan Aroma Pilihan Anda",
      consultNow: "Konsultasi sekarang",
      discoverMore: "Lihat selengkapnya",
      brandUniverse: "Jelajahi merek",
      featuredHouses: "Merek pilihan",
      requestFragrance: "Pencarian parfum",
      requestTitle: "Mencari parfum tertentu? Hubungi kami sekarang",
      requestBody:
        "Kirim merek, varian parfum, dan ukuran yang diinginkan. Kami akan mengonfirmasi ketersediaan, estimasi harga, dan opsi pemesanan melalui WhatsApp.",
      requestViaWhatsApp: "Hubungi kami sekarang"
    },
    trust: {
      authentic: "100% Asli",
      sourcing: "Jaminan keaslian",
      shipping: "Pengiriman ke seluruh Indonesia",
      dispatch: "Pengiriman nasional",
      split: "Pembayaran fleksibel",
      flexible: "Cicilan tersedia",
      consultation: "Konsultasi atau permintaan",
      guidance: "Melalui WhatsApp"
    },
    tile: {
      featured: "Pilihan utama",
      shop: "Belanja koleksi"
    },
    shop: {
      catalog: "Katalog",
      title: "Belanja parfum",
      body: "Saring parfum pilihan berdasarkan merek, kategori, ukuran, dan status ketersediaan.",
      refine: "Filter",
      searchPlaceholder: "Merek atau nama parfum",
      brand: "Merek",
      allBrands: "Semua merek",
      gender: "Kategori",
      size: "Ukuran",
      anySize: "Semua ukuran",
      noTitle: "Tidak ada botol yang cocok",
      noBody: "Coba hapus filter status atau perluas filter merek dan ukuran.",
      of: "dari"
    },
    forms: {
      requestEyebrow: "Permintaan Parfum",
      requestTitle: "Permintaan Parfum",
      productName: "Nama Parfum",
      brandName: "Nama Merek",
      size: "Ukuran",
      name: "Nama",
      contact: "Nomor WhatsApp",
      sendRequest: "Kirim melalui WhatsApp",
      submitting: "Membuka WhatsApp",
      requestSuccess: "Membuka WhatsApp.",
      requestError: "Gagal mengirim. Silakan coba lagi atau hubungi kami melalui WhatsApp.",
      notifyEyebrow: "Notifikasi stok",
      notifyTitle: "Beri tahu saya",
      saveNotification: "Simpan notifikasi",
      notifySuccess: "Notifikasi disimpan. Kami akan menghubungi Anda saat produk tersedia.",
      nameError: "Masukkan nama Anda.",
      contactError: "Masukkan kontak yang valid.",
      productError: "Masukkan nama parfum.",
      brandError: "Masukkan nama merek.",
      sizeError: "Masukkan ukuran yang diinginkan."
    },
    product: {
      selectedSize: "Ukuran dipilih",
      stock: "stok",
      authentic: "Harga Authentic",
      status: "Status",
      statusBody: "Stok akhir dan waktu pengiriman dikonfirmasi sebelum pembayaran melalui WhatsApp.",
      installment: "Pembayaran 2–3 kali tersedia untuk produk tertentu. Ketentuan dikonfirmasi melalui WhatsApp sebelum pembayaran.",
      buyWhatsapp: "Beli melalui WhatsApp",
      requestSimilar: "Cari parfum serupa",
      origin: "Asal",
      notes: "Catatan",
      sku: "SKU",
      fulfillment: "Ketersediaan",
      preOrderAvailable: "Tersedia melalui pre-order",
      readyStockFocused: "Stok tersedia",
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
