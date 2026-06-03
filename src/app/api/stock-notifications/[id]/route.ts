import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NotificationStatus } from "@/lib/types";

type Params = Promise<{ id: string }>;

const statuses: NotificationStatus[] = ["pending", "notified", "closed"];

export async function PATCH(request: Request, { params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!statuses.includes(body?.status)) {
    return NextResponse.json({ error: "Invalid notification status." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ mode: "local", status: "not_saved" }, { status: 503 });
  }

  const { error } = await supabase
    .from("stock_notifications")
    .update({ status: body.status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "saved" });
}
