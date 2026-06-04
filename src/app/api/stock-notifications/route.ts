import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/env";
import { isUuid } from "@/lib/ids";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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

  const supabase = createSupabaseAdminClient();
  const { productId, productSlug, customerName, contact } = parsed.data;
  const isEmail = contact.includes("@");
  const productUuid = isUuid(productId) ? productId : null;
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin key is not configured." }, { status: 503 });
  }

  const { error } = await supabase
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
