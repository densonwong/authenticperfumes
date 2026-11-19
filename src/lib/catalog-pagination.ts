import type { Brand, Product } from "@/lib/types";
import { filterCatalogProducts, type CatalogFilters } from "@/lib/catalog-filters";

export const CATALOG_PAGE_SIZE = 24;
export const CATALOG_FILTER_KEYS = ["q", "brand", "gender", "size", "readyStock", "preOrder", "bestSeller", "newArrival"] as const;
export type CatalogCollection = "shop" | "brand" | "new-arrivals" | "best-sellers" | "pre-order";
export type CatalogQuery = CatalogFilters & { collection: CatalogCollection; brandSlug?: string };
export type CatalogCardProduct = Pick<Product, "id" | "brandName" | "slug" | "name" | "imageUrl" | "galleryUrls" | "concentration" | "status" | "variants">;
export type CatalogPage = { products: CatalogCardProduct[]; total: number; nextCursor: string | null };
export type CatalogMetadata = { brands: Pick<Brand, "id" | "name" | "slug">[]; sizes: string[]; totalProducts: number };
export type CatalogSearchOption = { key: string; label: string; type: "brand" | "product"; value: string };

export class CatalogRequestError extends Error {
  constructor(public readonly code: string, message: string, public readonly status: 400 | 404 | 409 = 400) {
    super(message);
    this.name = "CatalogRequestError";
  }
}

function text(value: unknown, maxLength: number): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || value.length > maxLength || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new CatalogRequestError("INVALID_CATALOG_QUERY", "Parameter katalog belum sesuai.");
  }
  return value.trim() || undefined;
}

export function normalizeCatalogQuery(input: CatalogQuery): CatalogQuery {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new CatalogRequestError("INVALID_CATALOG_QUERY", "Parameter katalog belum sesuai.");
  }
  const collection = input.collection ?? "shop";
  if (!["shop", "brand", "new-arrivals", "best-sellers", "pre-order"].includes(collection)) {
    throw new CatalogRequestError("INVALID_CATALOG_QUERY", "Koleksi katalog tidak dikenal.");
  }
  const result: CatalogQuery = { collection };
  const brandSlug = text(input.brandSlug, 160);
  if (collection === "brand") {
    if (!brandSlug) throw new CatalogRequestError("INVALID_CATALOG_QUERY", "Merek perlu dipilih.");
    result.brandSlug = brandSlug;
  } else if (brandSlug) {
    throw new CatalogRequestError("INVALID_CATALOG_QUERY", "Merek koleksi tidak sesuai.");
  }
  for (const key of CATALOG_FILTER_KEYS) {
    const value = text(input[key], key === "q" ? 200 : key === "size" ? 64 : 160);
    if (!value) continue;
    if (["readyStock", "preOrder", "bestSeller", "newArrival"].includes(key)) {
      if (value !== "true" && value !== "false") throw new CatalogRequestError("INVALID_CATALOG_QUERY", "Pilihan filter belum sesuai.");
      if (value === "true") result[key] = value;
    } else {
      if (key === "gender" && !["men", "women", "unisex"].includes(value)) throw new CatalogRequestError("INVALID_CATALOG_QUERY", "Pilihan gender belum sesuai.");
      result[key] = value;
    }
  }
  return result;
}

export function parseCatalogQuery(params: URLSearchParams): CatalogQuery {
  const allowed = ["collection", "brandSlug", ...CATALOG_FILTER_KEYS];
  const input: Record<string, string> = {};
  for (const key of allowed) {
    const values = params.getAll(key);
    if (values.length > 1) throw new CatalogRequestError("INVALID_CATALOG_QUERY", "Parameter katalog tidak boleh berulang.");
    if (values.length) input[key] = values[0];
  }
  return normalizeCatalogQuery(input as CatalogQuery);
}

/** Stable query identity shared by server and client; contains no Node imports. */
export function catalogQueryKey(input: CatalogQuery): string {
  const query = normalizeCatalogQuery(input);
  return JSON.stringify([query.collection, query.brandSlug ?? "", ...CATALOG_FILTER_KEYS.map(key => query[key] ?? "")]);
}

export function catalogQueryParams(input: CatalogQuery): URLSearchParams {
  const query = normalizeCatalogQuery(input);
  const params = new URLSearchParams({ collection: query.collection });
  if (query.brandSlug) params.set("brandSlug", query.brandSlug);
  for (const key of CATALOG_FILTER_KEYS) if (query[key]) params.set(key, query[key]!);
  return params;
}

/** Stable first occurrence protects pagination even if upstream ranges overlap. */
export function uniqueCatalogProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter(product => {
    if (!product.variants.length || seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

export function selectCatalogProducts(products: Product[], brands: Brand[], input: CatalogQuery): Product[] {
  const query = normalizeCatalogQuery(input);
  let collection = uniqueCatalogProducts(products);
  if (query.collection === "brand") {
    const brand = brands.find(item => item.slug === query.brandSlug);
    if (!brand) throw new CatalogRequestError("CATALOG_BRAND_NOT_FOUND", "Merek tidak ditemukan.", 404);
    collection = collection.filter(product => product.brandId === brand.id);
  } else if (query.collection === "new-arrivals") {
    collection = collection.filter(product => product.newArrival);
  } else if (query.collection === "best-sellers") {
    collection = collection.filter(product => product.bestSeller);
  } else if (query.collection === "pre-order") {
    collection = collection.filter(product => product.preOrder);
  }
  return filterCatalogProducts(collection, brands, query);
}

export function toCatalogCardProduct(product: Product): CatalogCardProduct {
  const hover = product.galleryUrls.find(url => Boolean(url) && url !== product.imageUrl);
  return {
    id: product.id, brandName: product.brandName, slug: product.slug, name: product.name,
    imageUrl: product.imageUrl, galleryUrls: hover ? [hover] : [], concentration: product.concentration,
    status: product.status, variants: product.variants.map(variant => ({ ...variant }))
  };
}

/** Matches the former BrandSearchInput matching, alphabetical order and cap. */
export function buildCatalogSearchOptions(products: Product[], brands: Brand[], input: string): CatalogSearchOption[] {
  const query = text(input, 200) ?? "";
  const needle = query.toLocaleLowerCase();
  if (!needle) return [];
  return [
    ...brands.filter(brand => brand.name.toLocaleLowerCase().startsWith(needle))
      .map(brand => ({ key: `brand-${brand.id}`, label: brand.name, type: "brand" as const, value: brand.slug })),
    ...uniqueCatalogProducts(products).filter(product => `${product.brandName} ${product.name}`.toLocaleLowerCase().includes(needle))
      .map(product => ({ key: `product-${product.id}`, label: `${product.brandName} ${product.name}`, type: "product" as const, value: `${product.brandName} ${product.name}` }))
  ].sort((a, b) => a.label.localeCompare(b.label)).slice(0, 30);
}
