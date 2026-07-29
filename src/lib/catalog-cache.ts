import { revalidatePath, revalidateTag } from "next/cache";

export const catalogCacheTags = {
  brands: "catalog:brands",
  products: "catalog:products",
  banners: "catalog:banners",
  testimonials: "catalog:testimonials"
} as const;

export type CatalogCacheKey = keyof typeof catalogCacheTags;

const pathsByKey: Record<CatalogCacheKey, string[]> = {
  brands: ["/", "/brands", "/admin/brands"],
  products: ["/", "/shop", "/brands", "/new-arrivals", "/best-sellers", "/pre-order", "/admin/products", "/sitemap.xml"],
  banners: ["/", "/admin/banners"],
  testimonials: ["/testimonials", "/admin/testimonials"]
};

export function invalidateCatalog(keys: CatalogCacheKey[], extraPaths: string[] = []) {
  const uniqueKeys = [...new Set(keys)];
  const paths = new Set<string>();

  uniqueKeys.forEach((key) => {
    revalidateTag(catalogCacheTags[key]);
    pathsByKey[key].forEach((path) => paths.add(path));
  });
  extraPaths.forEach((path) => paths.add(path));

  paths.forEach((path) => revalidatePath(path));
}
