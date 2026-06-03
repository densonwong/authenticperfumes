import { NextResponse } from "next/server";
import { getTrustMedia } from "@/lib/repositories/catalog";

export async function GET() {
  const media = await getTrustMedia();

  return NextResponse.json(media);
}
