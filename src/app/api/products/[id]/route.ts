import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { isUuid } from "@/lib/ids";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Params = Promise<{ id: string }>;

function validateProductPayload(body: any) {
  const errors: string[] = [];

  if (!body?.brandId) errors.push("Brand is required.");
  if (!body?.name) errors.push("Name is required.");
  if (!body?.slug) errors.push("Slug is required.");
  if (!body?.imageUrl) errors.push("At least one image is required.");
  if (!Array.isArray(body?.variants) || body.variants.length === 0) {
    errors.push("Add one or more variants.");
  }

  return errors;
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const errors = validateProductPayload(body);

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ mode: "seed", status: "received" });
  }

  if (!isUuid(id)) {
    return NextResponse.json(
      { error: "This product is demo/seed data and cannot be edited. Create it in Supabase first." },
      { status: 400 }
    );
  }

  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const { error: productError } = await supabase
    .from("products")
    .update({
      brand_id: body.brandId,
      slug: body.slug,
      name: body.name,
      image_url: body.imageUrl,
      gallery_urls: body.galleryUrls ?? [body.imageUrl],
      gender: body.gender,
      concentration: body.concentration,
      notes: body.notes ?? [],
      country_of_origin: body.countryOfOrigin,
      description: body.description,
      status: body.status,
      best_seller: Boolean(body.bestSeller),
      new_arrival: Boolean(body.newArrival),
      ready_stock: Boolean(body.readyStock),
      pre_order: Boolean(body.preOrder)
    })
    .eq("id", id);

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  const { error: deleteError } = await supabase.from("product_variants").delete().eq("product_id", id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const variants = body.variants.map((variant: any) => ({
    product_id: id,
    size: variant.size,
    retail_price: Number(variant.retailPrice ?? 0),
    authentic_price: Number(variant.authenticPrice ?? 0),
    stock: Number(variant.stock ?? 0),
    status: variant.status
  }));
  const { error: variantsError } = await supabase.from("product_variants").insert(variants);

  if (variantsError) {
    return NextResponse.json({ error: variantsError.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/brands");
  revalidatePath(`/products/${body.slug}`);
  revalidatePath("/admin/products");

  return NextResponse.json({ status: "saved" });
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ mode: "seed", status: "deleted" });
  }

  if (!isUuid(id)) {
    return NextResponse.json(
      { error: "This product is demo/seed data and cannot be deleted. Create it in Supabase first." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/brands");
  revalidatePath("/admin/products");

  return NextResponse.json({ status: "deleted" });
}
