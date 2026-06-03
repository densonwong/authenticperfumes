import { NextResponse } from "next/server";
import { getDiscoverPosts } from "@/lib/repositories/catalog";

export async function GET() {
  const posts = await getDiscoverPosts();

  return NextResponse.json(posts);
}
