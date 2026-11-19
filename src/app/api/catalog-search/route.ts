import { getCatalogSearchOptions } from "@/lib/catalog-listing";
import { CatalogRequestError } from "@/lib/catalog-pagination";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    if (params.getAll("q").length > 1) throw new CatalogRequestError("INVALID_CATALOG_QUERY", "Kata pencarian tidak boleh berulang.");
    const options = await getCatalogSearchOptions(params.get("q") ?? "");
    return Response.json({ options }, { headers });
  } catch (error) {
    if (error instanceof CatalogRequestError) return Response.json({ error: { code: error.code, message: error.message } }, { status: error.status, headers });
    return Response.json({ error: { code: "CATALOG_SEARCH_UNAVAILABLE", message: "Saran pencarian belum dapat dimuat." } }, { status: 503, headers });
  }
}
