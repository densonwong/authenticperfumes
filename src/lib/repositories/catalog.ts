import {
  seedBanners,
  seedBrands,
  seedProducts,
  seedTestimonials
} from "../seed-data";
import { unstable_cache } from "next/cache";
import { generatedLogo, LOGO_WALL } from "@/lib/brand-logo-wall";
import { catalogCacheTags } from "@/lib/catalog-cache";
import { hasSupabaseConfig } from "@/lib/env";
import { isReadyStockProduct } from "@/lib/product-availability";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type {
  Banner,
  Brand,
  Product,
  ProductStatus,
  ProductVariant,
  Testimonial
} from "@/lib/types";

type BrandRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  country: string;
  founded_year: number | null;
  description: string;
  product_count: number;
  featured: boolean;
};

type VariantRow = {
  id: string;
  size: string;
  retail_price: number;
  authentic_price: number;
  stock: number;
  status: ProductStatus;
};

type ProductRow = {
  id: string;
  brand_id: string;
  brands: { name: string } | null;
  slug: string;
  name: string;
  image_url: string;
  gallery_urls: string[];
  gender: Product["gender"];
  concentration: string;
  notes: string[];
  country_of_origin: string;
  description: string;
  status: ProductStatus;
  best_seller: boolean;
  new_arrival: boolean;
  ready_stock: boolean;
  pre_order: boolean;
  product_variants: VariantRow[];
};

const productSelect =
  "id,brand_id,brands(name),slug,name,image_url,gallery_urls,gender,concentration,notes,country_of_origin,description,status,best_seller,new_arrival,ready_stock,pre_order,product_variants(id,size,retail_price,authentic_price,stock,status)";
const productPageSize = 500;
const brandPageSize = 500;

function mapBrand(row: BrandRow): Brand {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url,
    country: row.country,
    foundedYear: row.founded_year,
    description: row.description,
    productCount: row.product_count,
    featured: row.featured
  };
}

function mapVariant(row: VariantRow): ProductVariant {
  return {
    id: row.id,
    size: row.size,
    retailPrice: row.retail_price,
    authenticPrice: row.authentic_price,
    stock: row.stock,
    status: row.status
  };
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    brandId: row.brand_id,
    brandName: row.brands?.name ?? "Unknown Brand",
    slug: row.slug,
    name: row.name,
    imageUrl: row.image_url,
    galleryUrls: row.gallery_urls?.length ? row.gallery_urls : [row.image_url],
    gender: row.gender,
    concentration: row.concentration,
    notes: row.notes ?? [],
    countryOfOrigin: row.country_of_origin,
    description: row.description,
    status: row.status,
    bestSeller: row.best_seller,
    newArrival: row.new_arrival,
    readyStock: row.ready_stock,
    preOrder: row.pre_order,
    variants: (row.product_variants ?? []).map(mapVariant)
  };
}

async function readLiveBrands() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const rows: BrandRow[] = [];
  for (let from = 0; ; from += brandPageSize) {
    const { data, error } = await supabase
      .from("brands")
      .select("id,name,slug,logo_url,country,founded_year,description,product_count,featured")
      .eq("published", true)
      .order("name")
      .range(from, from + brandPageSize - 1);

    if (error) throw new Error(`Unable to load brands: ${error.message}`);
    const page = (data ?? []) as BrandRow[];
    rows.push(...page);
    if (page.length < brandPageSize) break;
  }

  return rows.map(mapBrand);
}

async function readLiveProducts() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const rows: ProductRow[] = [];
  for (let from = 0; ; from += productPageSize) {
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .range(from, from + productPageSize - 1);

    if (error) throw new Error(`Unable to load products: ${error.message}`);
    const page = (data ?? []) as unknown as ProductRow[];
    rows.push(...page);
    if (page.length < productPageSize) break;
  }

  return rows.map(mapProduct);
}

async function readLiveProductBySlug(slug: string) {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Unable to load product ${slug}: ${error.message}`);
  return data ? mapProduct(data as unknown as ProductRow) : undefined;
}

async function readLiveProductsByBrandId(brandId: string) {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const rows: ProductRow[] = [];
  for (let from = 0; ; from += productPageSize) {
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("published", true)
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false })
      .range(from, from + productPageSize - 1);

    if (error) throw new Error(`Unable to load brand products: ${error.message}`);
    const page = (data ?? []) as unknown as ProductRow[];
    rows.push(...page);
    if (page.length < productPageSize) break;
  }

  return rows.map(mapProduct);
}

async function readLiveBanners() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("banners")
    .select("id,title,subtitle,image_url,href,position")
    .eq("published", true)
    .order("position");

  if (error || !data?.length) return null;
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.image_url,
    href: row.href,
    position: row.position
  })) as Banner[];
}

async function readLiveTestimonials() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("testimonials")
    .select("id,customer_name,quote,product_name,image_url")
    .eq("published", true);

  if (error || !data?.length) return null;
  return data.map((row) => ({
    id: row.id,
    customerName: row.customer_name,
    quote: row.quote,
    productName: row.product_name,
    imageUrl: row.image_url
  })) as Testimonial[];
}

const readCachedBrands = unstable_cache(readLiveBrands, ["public-brands"], {
  tags: [catalogCacheTags.brands]
});
const readCachedProducts = unstable_cache(readLiveProducts, ["public-products"], {
  tags: [catalogCacheTags.products]
});
const readCachedProductBySlug = unstable_cache(readLiveProductBySlug, ["public-product-by-slug"], {
  tags: [catalogCacheTags.products]
});
const readCachedProductsByBrandId = unstable_cache(
  readLiveProductsByBrandId,
  ["public-products-by-brand"],
  { tags: [catalogCacheTags.products] }
);
const readCachedBanners = unstable_cache(readLiveBanners, ["public-banners"], {
  tags: [catalogCacheTags.banners]
});
const readCachedTestimonials = unstable_cache(readLiveTestimonials, ["public-testimonials"], {
  tags: [catalogCacheTags.testimonials]
});

export async function getBrands() {
  if (!hasSupabaseConfig()) return seedBrands;
  return (await readCachedBrands()) ?? seedBrands;
}

export async function getFeaturedBrands() {
  return (await getBrands()).filter((brand) => brand.featured);
}

/**
 * Brands for the homepage logo marquee, in the curated order of LOGO_WALL,
 * paired with the layout aspect for each. Missing slugs are skipped.
 */
export async function getLogoWallBrands() {
  const brands = await getBrands();
  const bySlug = new Map(brands.map((brand) => [brand.slug, brand]));

  return LOGO_WALL.flatMap((entry) => {
    const brand = bySlug.get(entry.slug);
    if (!brand) return [];

    const local = generatedLogo(entry.slug);
    if (local) return [{ brand, logoUrl: local.src, aspect: local.aspect, vector: true }];

    return brand.logoUrl
      ? [{ brand, logoUrl: brand.logoUrl, aspect: entry.aspect, vector: false }]
      : [];
  });
}

export async function getBrandBySlug(slug: string) {
  return (await getBrands()).find((brand) => brand.slug === slug) ?? null;
}

export async function getProducts() {
  if (!hasSupabaseConfig()) return seedProducts;
  return (await readCachedProducts()) ?? seedProducts;
}

export async function getProductBySlug(slug: string) {
  if (!hasSupabaseConfig()) {
    return seedProducts.find((product) => product.slug === slug) ?? null;
  }
  const liveProduct = await readCachedProductBySlug(slug);
  if (liveProduct !== null) return liveProduct ?? null;
  return seedProducts.find((product) => product.slug === slug) ?? null;
}

export async function getProductsByBrandId(brandId: string) {
  if (!hasSupabaseConfig()) {
    return seedProducts.filter((product) => product.brandId === brandId);
  }
  const liveProducts = await readCachedProductsByBrandId(brandId);
  if (liveProducts !== null) return liveProducts;
  return seedProducts.filter((product) => product.brandId === brandId);
}

export async function getNewArrivals() {
  return (await getProducts()).filter((product) => product.newArrival);
}

export async function getBestSellers() {
  return (await getProducts()).filter((product) => product.bestSeller);
}

export async function getReadyStockProducts() {
  return (await getProducts()).filter(isReadyStockProduct);
}

export async function getPreOrderProducts() {
  return (await getProducts()).filter((product) => product.preOrder);
}

export async function getBanners() {
  if (!hasSupabaseConfig()) return seedBanners;
  return (await readCachedBanners()) ?? seedBanners;
}

export async function getTestimonials() {
  if (!hasSupabaseConfig()) return seedTestimonials;
  return (await readCachedTestimonials()) ?? seedTestimonials;
}
