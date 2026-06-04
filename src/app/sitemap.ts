import type { MetadataRoute } from "next";
import { getBrands, getProducts } from "@/lib/repositories/catalog";
import { siteUrl } from "@/lib/seo";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/shop", priority: 0.9 },
  { path: "/brands", priority: 0.85 },
  { path: "/new-arrivals", priority: 0.75 },
  { path: "/best-sellers", priority: 0.75 },
  { path: "/pre-order", priority: 0.75 },
  { path: "/sampling", priority: 0.65 },
  { path: "/testimonials", priority: 0.65 },
  { path: "/about", priority: 0.55 },
  { path: "/contact", priority: 0.55 }
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  const lastModified = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: siteUrl(route.path),
      lastModified,
      changeFrequency: route.path === "/" || route.path === "/shop" ? "daily" as const : "weekly" as const,
      priority: route.priority
    })),
    ...brands.map((brand) => ({
      url: siteUrl(`/brands/${brand.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...products.map((product) => ({
      url: siteUrl(`/products/${product.slug}`),
      lastModified,
      changeFrequency: product.readyStock || product.preOrder ? "daily" as const : "weekly" as const,
      priority: product.bestSeller || product.newArrival ? 0.85 : 0.8
    }))
  ];
}
