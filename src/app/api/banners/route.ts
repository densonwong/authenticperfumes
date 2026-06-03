import { NextResponse } from "next/server";
import { getBanners } from "@/lib/repositories/catalog";

export async function GET() {
  const banners = await getBanners();

  return NextResponse.json(banners);
}
