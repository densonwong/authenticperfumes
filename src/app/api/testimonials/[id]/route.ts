import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = Promise<{ id: string }>;

function validateTestimonialPayload(body: any) {
  const errors: string[] = [];

  if (!body?.customerName) errors.push("Customer name is required.");
  if (!body?.productName) errors.push("Product name is required.");
  if (!body?.quote) errors.push("Quote is required.");
  if (!body?.imageUrl) errors.push("Customer image is required.");

  return errors;
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const errors = validateTestimonialPayload(body);

  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ mode: "local", status: "not_saved" }, { status: 503 });
  }

  const { error } = await supabase
    .from("testimonials")
    .update({
      customer_name: body.customerName,
      product_name: body.productName,
      quote: body.quote,
      image_url: body.imageUrl,
      published: body.published ?? true
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "saved" });
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ mode: "local", status: "not_deleted" }, { status: 503 });
  }

  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "deleted" });
}
