import { revalidatePath, revalidateTag } from "next/cache";
import { locales } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";

export const catalogCacheTags = {
  brands: "catalog:brands",
  products: "catalog:products",
  banners: "catalog:banners",
  testimonials: "catalog:testimonials"
} as const;

export type CatalogCacheKey = keyof typeof catalogCacheTags;

const pathsByKey: Record<CatalogCacheKey, { public: string[]; internal: string[] }> = {
  brands: { public: ["/", "/brands"], internal: ["/admin/brands"] },
  products: {
    public: ["/", "/shop", "/brands", "/new-arrivals", "/best-sellers", "/pre-order"],
    internal: ["/admin/products", "/sitemap.xml"]
  },
  banners: { public: ["/"], internal: ["/admin/banners"] },
  testimonials: { public: ["/testimonials"], internal: ["/admin/testimonials"] }
};

function addPublicPath(paths: Set<string>, path: string) {
  locales.forEach((locale) => paths.add(localizedPath(locale, path)));
}

export function invalidateCatalog(keys: CatalogCacheKey[], extraPaths: string[] = []) {
  const uniqueKeys = [...new Set(keys)];
  const paths = new Set<string>();

  uniqueKeys.forEach((key) => {
    revalidateTag(catalogCacheTags[key]);
    pathsByKey[key].public.forEach((path) => addPublicPath(paths, path));
    pathsByKey[key].internal.forEach((path) => paths.add(path));
  });
  extraPaths.forEach((path) => {
    if (path.startsWith("/admin") || path.startsWith("/api") || path === "/sitemap.xml") {
      paths.add(path);
    } else {
      addPublicPath(paths, path);
    }
  });

  paths.forEach((path) => revalidatePath(path));
}
