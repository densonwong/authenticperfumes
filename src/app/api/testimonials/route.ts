import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { getTestimonials } from "@/lib/repositories/catalog";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const testimonials = await getTestimonials();

  return NextResponse.json(testimonials);
}

function validateTestimonialPayload(body: any) {
  const errors: string[] = [];

  if (!body?.customerName) errors.push("Customer name is required.");
  if (!body?.productName) errors.push("Product name is required.");
  if (!body?.quote) errors.push("Quote is required.");
  if (!body?.imageUrl) errors.push("Customer image is required.");

  return errors;
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const errors = validateTestimonialPayload(body);

  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ mode: "local", status: "not_saved" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      customer_name: body.customerName,
      product_name: body.productName,
      quote: body.quote,
      image_url: body.imageUrl,
      published: body.published ?? true
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");

  return NextResponse.json({ id: data.id, status: "saved" }, { status: 201 });
}
