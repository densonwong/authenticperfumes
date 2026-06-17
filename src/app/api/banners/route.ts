import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { getBanners } from "@/lib/repositories/catalog";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const banners = await getBanners();

  return NextResponse.json(banners);
}

function validateBannerPayload(body: any) {
  const errors: string[] = [];

  if (!body?.title) errors.push("Title is required.");
  if (!body?.subtitle) errors.push("Subtitle is required.");
  if (!body?.imageUrl) errors.push("Banner image is required.");
  if (!body?.href) errors.push("Link is required.");
  if (!body?.position) errors.push("Position is required.");

  return errors;
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const errors = validateBannerPayload(body);

  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ mode: "local", status: "not_saved" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("banners")
    .insert({
      title: body.title,
      subtitle: body.subtitle,
      image_url: body.imageUrl,
      href: body.href,
      position: body.position,
      published: body.published ?? true
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");

  return NextResponse.json({ id: data.id, status: "saved" }, { status: 201 });
}
