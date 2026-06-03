import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = Promise<{ id: string }>;

function validateBannerPayload(body: any) {
  const errors: string[] = [];

  if (!body?.title) errors.push("Title is required.");
  if (!body?.subtitle) errors.push("Subtitle is required.");
  if (!body?.imageUrl) errors.push("Banner image is required.");
  if (!body?.href) errors.push("Link is required.");
  if (!body?.position) errors.push("Position is required.");

  return errors;
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const errors = validateBannerPayload(body);

  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ mode: "local", status: "not_saved" }, { status: 503 });
  }

  const { error } = await supabase
    .from("banners")
    .update({
      title: body.title,
      subtitle: body.subtitle,
      image_url: body.imageUrl,
      href: body.href,
      position: body.position,
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

  const { error } = await supabase.from("banners").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "deleted" });
}
