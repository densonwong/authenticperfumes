import { NextResponse } from "next/server";
import { getProducts } from "@/lib/repositories/catalog";

export async function GET() {
  const products = await getProducts();

  return NextResponse.json(products);
}
