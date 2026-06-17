import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { getBrands } from "@/lib/repositories/catalog";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const brands = await getBrands();

  return NextResponse.json(brands);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.slug) {
    return NextResponse.json({ error: "Brand name and slug are required." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ mode: "seed", status: "received" }, { status: 201 });
  }

  const { data, error } = await supabase
    .from("brands")
    .insert({
      name: body.name,
      slug: body.slug,
      logo_url: body.logoUrl || body.logo_url || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&h=800&q=80",
      country: body.country || "Unknown",
      founded_year: body.foundedYear ? Number(body.foundedYear) : null,
      description: body.description || `${body.name} fragrances available through Authentic Perfumes 8.`,
      product_count: Number(body.productCount ?? 0),
      featured: Boolean(body.featured),
      published: body.published ?? true
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/brands");
  revalidatePath("/admin/brands");

  return NextResponse.json({ id: data.id, status: "saved" }, { status: 201 });
}
