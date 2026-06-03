import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { stockNotificationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = stockNotificationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json({ mode: "seed", status: "received" }, { status: 201 });
  }

  const supabase = await createSupabaseServerClient();
  const { productId, productSlug, customerName, contact } = parsed.data;
  const isEmail = contact.includes("@");
  const productUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId)
    ? productId
    : null;
  const { error } = await supabase!
    .from("stock_notifications")
    .insert({
      product_id: productUuid,
      product_slug: productSlug ?? productId,
      email: isEmail ? contact : null,
      phone: isEmail ? null : contact,
      status: "pending"
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "received", customerName }, { status: 201 });
}
