import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/env";
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

  return NextResponse.json({ mode: "seed", status: "received" }, { status: 201 });
}
