import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { isUuid } from "@/lib/ids";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Params = Promise<{ id: string }>;

export async function PATCH(request: Request, { params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json().catch(() => null);

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ mode: "seed", status: "received" });
  }

  if (!isUuid(id)) {
    return NextResponse.json(
      { error: "This brand is demo/seed data and cannot be edited. Create it in Supabase first." },
      { status: 400 }
    );
  }

  if (!body?.name || !body?.slug) {
    return NextResponse.json({ error: "Brand name and slug are required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("brands")
    .update({
      name: body.name,
      slug: body.slug,
      logo_url: body.logoUrl || body.logo_url || "",
      country: body.country || "Unknown",
      founded_year: body.foundedYear ? Number(body.foundedYear) : null,
      description: body.description || `${body.name} fragrances available through Authentic Perfumes 8.`,
      featured: Boolean(body.featured)
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
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ mode: "seed", status: "deleted" });
  }

  if (!isUuid(id)) {
    return NextResponse.json(
      { error: "This brand is demo/seed data and cannot be deleted. Create it in Supabase first." },
      { status: 400 }
    );
  }

  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", id);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if (count && count > 0) {
    return NextResponse.json(
      { error: `This brand has ${count} product${count === 1 ? "" : "s"}. Delete or reassign them first.` },
      { status: 409 }
    );
  }

  const { error } = await supabase.from("brands").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "deleted" });
}
