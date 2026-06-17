import {
  seedBanners,
  seedBrands,
  seedProducts,
  seedTestimonials
} from "../seed-data";
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

  const [{ data, error }, { data: products, error: productsError }] = await Promise.all([
    supabase
    .from("brands")
    .select("id,name,slug,logo_url,country,founded_year,description,product_count,featured")
    .eq("published", true)
    .order("name"),
    supabase
      .from("products")
      .select("brand_id")
      .eq("published", true)
  ]);

  if (error || !data?.length) return null;

  const productCounts = new Map<string, number>();
  if (!productsError && products) {
    products.forEach((product) => {
      productCounts.set(product.brand_id, (productCounts.get(product.brand_id) ?? 0) + 1);
    });
  }

  return (data as BrandRow[]).map((row) => ({
    ...mapBrand(row),
    productCount: productCounts.get(row.id) ?? 0
  }));
}

async function readLiveProducts() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,brand_id,brands(name),slug,name,image_url,gallery_urls,gender,concentration,notes,country_of_origin,description,status,best_seller,new_arrival,ready_stock,pre_order,product_variants(id,size,retail_price,authentic_price,stock,status)"
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return null;
  return (data as unknown as ProductRow[]).map(mapProduct);
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

export async function getBrands() {
  return (await readLiveBrands()) ?? seedBrands;
}

export async function getFeaturedBrands() {
  return (await getBrands()).filter((brand) => brand.featured);
}

export async function getBrandBySlug(slug: string) {
  return (await getBrands()).find((brand) => brand.slug === slug) ?? null;
}

export async function getProducts() {
  return (await readLiveProducts()) ?? seedProducts;
}

export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((product) => product.slug === slug) ?? null;
}

export async function getNewArrivals() {
  return (await getProducts()).filter((product) => product.newArrival);
}

export async function getBestSellers() {
  return (await getProducts()).filter((product) => product.bestSeller);
}

export async function getReadyStockProducts() {
  return (await getProducts()).filter((product) => product.readyStock);
}

export async function getPreOrderProducts() {
  return (await getProducts()).filter((product) => product.preOrder);
}

export async function getBanners() {
  return (await readLiveBanners()) ?? seedBanners;
}

export async function getTestimonials() {
  return (await readLiveTestimonials()) ?? seedTestimonials;
}
