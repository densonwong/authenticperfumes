import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { getProducts } from "@/lib/repositories/catalog";
import { isUuid } from "@/lib/ids";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const products = await getProducts();

  return NextResponse.json(products);
}

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

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const errors = validateProductPayload(body);

  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ mode: "seed", status: "received" }, { status: 201 });
  }

  if (!isUuid(body.brandId)) {
    return NextResponse.json(
      { error: "Selected brand is demo/seed data. Create or select a Supabase brand before saving products." },
      { status: 400 }
    );
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
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
      pre_order: Boolean(body.preOrder),
      published: true
    })
    .select("id")
    .single();

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  const variants = body.variants.map((variant: any) => ({
    product_id: product.id,
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
  revalidatePath("/admin/products");

  return NextResponse.json({ id: product.id, status: "saved" }, { status: 201 });
}
