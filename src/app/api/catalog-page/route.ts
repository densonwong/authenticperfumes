import { getCatalogPage } from "@/lib/catalog-listing";
import { CatalogRequestError, parseCatalogQuery } from "@/lib/catalog-pagination";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const cursorValues = params.getAll("cursor");
    if (cursorValues.length > 1) throw new CatalogRequestError("CATALOG_CURSOR_STALE", "Tautan halaman katalog tidak sesuai.", 409);
    const page = await getCatalogPage(parseCatalogQuery(params), cursorValues.length ? cursorValues[0] : undefined);
    return Response.json(page, { headers });
  } catch (error) {
    if (error instanceof CatalogRequestError) return Response.json({ error: { code: error.code, message: error.message } }, { status: error.status, headers });
    return Response.json({ error: { code: "CATALOG_UNAVAILABLE", message: "Katalog belum dapat dimuat. Silakan coba lagi." } }, { status: 503, headers });
  }
}
