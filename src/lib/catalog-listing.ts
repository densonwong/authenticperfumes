import { createHash } from "node:crypto";
import { getBrands, getProducts } from "@/lib/repositories/catalog";
import { uniqueSortedProductSizes } from "@/lib/product-sizes";
import {
  CATALOG_PAGE_SIZE, CatalogRequestError, buildCatalogSearchOptions, catalogQueryKey,
  normalizeCatalogQuery, selectCatalogProducts, toCatalogCardProduct, uniqueCatalogProducts,
  type CatalogMetadata, type CatalogPage, type CatalogQuery
} from "@/lib/catalog-pagination";
import type { Brand, Product } from "@/lib/types";

type Cursor = { v: 1; q: string; s: string; a: string };
const signature = (value: string) => createHash("sha256").update(value).digest("hex");
const stale = () => new CatalogRequestError("CATALOG_CURSOR_STALE", "Halaman berikutnya tidak lagi sesuai dengan katalog ini. Produk yang sudah tampil tetap dapat dilihat.", 409);

function decodeCursor(cursor: string): Cursor {
  try {
    if (typeof cursor !== "string" || !cursor || cursor.length > 1024 || !/^[A-Za-z0-9_-]+$/.test(cursor)) throw stale();
    const buffer = Buffer.from(cursor, "base64url");
    if (buffer.toString("base64url") !== cursor) throw stale();
    const value = JSON.parse(buffer.toString("utf8")) as Cursor;
    if (!value || typeof value !== "object" || Array.isArray(value) || value.v !== 1 ||
        !/^[a-f0-9]{64}$/.test(value.q) || !/^[a-f0-9]{64}$/.test(value.s) ||
        typeof value.a !== "string" || !value.a || value.a.length > 200 || /[\u0000-\u001f\u007f]/.test(value.a)) throw stale();
    return value;
  } catch { throw stale(); }
}

function pageFrom(products: Product[], brands: Brand[], query: CatalogQuery, cursor?: string | null): CatalogPage {
  const cards = selectCatalogProducts(products, brands, query).map(toCatalogCardProduct);
  const queryHash = signature(catalogQueryKey(query));
  // Related variants can arrive in a different database order across cached
  // responses. Only the signature uses canonical ordering; cards retain the
  // original variant order and every price/stock value still affects the hash.
  const snapshotHash = signature(JSON.stringify(cards.map(card => ({
    ...card,
    variants: [...card.variants].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
  }))));
  let start = 0;
  if (cursor !== undefined && cursor !== null) {
    const decoded = decodeCursor(cursor);
    if (decoded.q !== queryHash || decoded.s !== snapshotHash) throw stale();
    const after = cards.findIndex(product => product.id === decoded.a);
    if (after < 0) throw stale();
    start = after + 1;
  }
  const page = cards.slice(start, start + CATALOG_PAGE_SIZE);
  const nextCursor = start + page.length < cards.length && page.length
    ? Buffer.from(JSON.stringify({ v: 1, q: queryHash, s: snapshotHash, a: page[page.length - 1].id } satisfies Cursor)).toString("base64url")
    : null;
  return { products: page, total: cards.length, nextCursor };
}

async function readCatalog() {
  // Preserve the repository's published/variant filtering and tagged data cache.
  // Only the bounded card result and lean metadata cross the client boundary.
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);
  return { products, brands };
}

export async function getCatalogPage(input: CatalogQuery, cursor?: string | null): Promise<CatalogPage> {
  const query = normalizeCatalogQuery(input);
  // Malformed cursors fail before loading the catalog.
  if (cursor !== undefined && cursor !== null) decodeCursor(cursor);
  const { products, brands } = await readCatalog();
  return pageFrom(products, brands, query, cursor);
}

export async function getShopInitial(input: CatalogQuery): Promise<{ page: CatalogPage; metadata: CatalogMetadata }> {
  const query = normalizeCatalogQuery(input);
  const { products, brands } = await readCatalog();
  return {
    page: pageFrom(products, brands, query),
    metadata: {
      brands: brands.map(({ id, name, slug }) => ({ id, name, slug })),
      sizes: uniqueSortedProductSizes(uniqueCatalogProducts(products).flatMap(product => product.variants.map(variant => variant.size))),
      totalProducts: uniqueCatalogProducts(products).length
    }
  };
}

export async function getCatalogSearchOptions(query: string) {
  if (typeof query !== "string" || query.length > 200 || /[\u0000-\u001f\u007f]/.test(query)) throw new CatalogRequestError("INVALID_CATALOG_QUERY", "Kata pencarian belum sesuai.");
  if (!query.trim()) return [];
  const { products, brands } = await readCatalog();
  return buildCatalogSearchOptions(products, brands, query);
}
