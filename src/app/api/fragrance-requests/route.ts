import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { fragranceRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = fragranceRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json({ mode: "seed", status: "received" }, { status: 201 });
  }

  const supabase = createSupabaseAdminClient();
  const { productName, brandName, size, customerName, contact } = parsed.data;
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin key is not configured." }, { status: 503 });
  }

  const { error } = await supabase
    .from("fragrance_requests")
    .insert({
      customer_name: customerName,
      phone: contact,
      requested_fragrance: `${brandName} ${productName} ${size}`.trim(),
      notes: `Brand: ${brandName}; Product: ${productName}; Size: ${size}`,
      status: "new"
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "received" }, { status: 201 });
}
