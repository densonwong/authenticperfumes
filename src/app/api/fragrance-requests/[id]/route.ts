import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { RequestStatus } from "@/lib/types";

type Params = Promise<{ id: string }>;

const statuses: RequestStatus[] = ["new", "in_review", "sourced", "closed"];

export async function PATCH(request: Request, { params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!statuses.includes(body?.status)) {
    return NextResponse.json({ error: "Invalid request status." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ mode: "local", status: "not_saved" }, { status: 503 });
  }

  const { error } = await supabase
    .from("fragrance_requests")
    .update({ status: body.status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "saved" });
}
