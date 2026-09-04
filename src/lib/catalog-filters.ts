import type { Brand, Product } from "@/lib/types";
import { isReadyStockProduct } from "@/lib/product-availability";

export type CatalogFilters = Partial<Record<"q" | "brand" | "gender" | "size" | "readyStock" | "preOrder" | "bestSeller" | "newArrival", string>>;

export function filterCatalogProducts(products: Product[], brands: Brand[], selected: CatalogFilters) {
  const q = selected.q?.trim().toLowerCase();
  const brandId = selected.brand ? brands.find(brand => brand.slug === selected.brand)?.id : undefined;
  return products.filter(product => {
    const searchable = [product.name, product.brandName, product.concentration, product.description,
      product.countryOfOrigin, product.gender, ...product.notes].join(" ").toLowerCase();
    if (q && !searchable.includes(q)) return false;
    if (selected.brand && product.brandId !== brandId) return false;
    if (selected.gender && product.gender !== selected.gender) return false;
    if (selected.size && !product.variants.some(variant => variant.size === selected.size)) return false;
    if (selected.readyStock === "true" && !isReadyStockProduct(product)) return false;
    if (selected.preOrder === "true" && !product.preOrder) return false;
    if (selected.bestSeller === "true" && !product.bestSeller) return false;
    if (selected.newArrival === "true" && !product.newArrival) return false;
    return true;
  });
}
