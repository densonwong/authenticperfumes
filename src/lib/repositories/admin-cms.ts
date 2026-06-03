import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Banner,
  FragranceRequest,
  NotificationStatus,
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
