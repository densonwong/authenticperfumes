import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = Promise<{ id: string }>;

export async function PATCH(request: Request, { params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.slug) {
    return NextResponse.json({ error: "Brand name and slug are required." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ mode: "seed", status: "received" });
  }

  const { error } = await supabase
    .from("brands")
    .update({
      name: body.name,
      slug: body.slug,
      logo_url: body.logoUrl || body.logo_url || "",
      country: body.country || "Unknown",
      founded_year: body.foundedYear ? Number(body.foundedYear) : null,
      description: body.description || `${body.name} fragrances available through Authentic Perfumes.`,
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
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ mode: "seed", status: "deleted" });
  }

  const { error } = await supabase.from("brands").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "deleted" });
}
