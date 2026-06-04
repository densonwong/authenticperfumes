import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Banner,
  Brand,
  FragranceRequest,
  NotificationStatus,
  Product,
  ProductStatus,
  ProductVariant,
  RequestStatus,
  StockNotification,
  Testimonial
} from "@/lib/types";

type BannerRow = {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  href: string;
  position: Banner["position"];
};

type TestimonialRow = {
  id: string;
  customer_name: string;
  quote: string;
  product_name: string;
  image_url: string;
};

type FragranceRequestRow = {
  id: string;
  customer_name: string;
  email: string | null;
  phone: string;
  requested_fragrance: string;
  notes: string | null;
  status: RequestStatus;
  created_at: string;
};

type StockNotificationRow = {
  id: string;
  product_id: string | null;
  product_slug: string;
  email: string | null;
  phone: string | null;
  status: NotificationStatus;
  created_at: string;
};

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

function mapBanner(row: BannerRow): Banner {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.image_url,
    href: row.href,
    position: row.position
  };
}

function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    customerName: row.customer_name,
    quote: row.quote,
    productName: row.product_name,
    imageUrl: row.image_url
  };
}

function mapFragranceRequest(row: FragranceRequestRow): FragranceRequest {
  return {
    id: row.id,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    requestedFragrance: row.requested_fragrance,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at
  };
}

function mapStockNotification(row: StockNotificationRow): StockNotification {
  return {
    id: row.id,
    productId: row.product_id,
    productSlug: row.product_slug,
    email: row.email,
    phone: row.phone,
    status: row.status,
    createdAt: row.created_at
  };
}

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

export async function getAdminBrands() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("brands")
    .select("id,name,slug,logo_url,country,founded_year,description,product_count,featured")
    .order("name");

  if (error || !data) return [];
  return (data as BrandRow[]).map(mapBrand);
}

export async function getAdminProducts() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,brand_id,brands(name),slug,name,image_url,gallery_urls,gender,concentration,notes,country_of_origin,description,status,best_seller,new_arrival,ready_stock,pre_order,product_variants(id,size,retail_price,authentic_price,stock,status)"
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function getAdminBanners() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("banners")
    .select("id,title,subtitle,image_url,href,position")
    .order("position");

  if (error || !data) return [];
  return (data as BannerRow[]).map(mapBanner);
}

export async function getAdminTestimonials() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("id,customer_name,quote,product_name,image_url")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as TestimonialRow[]).map(mapTestimonial);
}

export async function getAdminFragranceRequests() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("fragrance_requests")
    .select("id,customer_name,email,phone,requested_fragrance,notes,status,created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as FragranceRequestRow[]).map(mapFragranceRequest);
}

export async function getAdminStockNotifications() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("stock_notifications")
    .select("id,product_id,product_slug,email,phone,status,created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as StockNotificationRow[]).map(mapStockNotification);
}
