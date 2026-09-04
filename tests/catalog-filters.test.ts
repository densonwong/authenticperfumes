import { describe, expect, it } from "vitest";
import { seedBrands, seedProducts } from "../src/lib/seed-data";
import { filterCatalogProducts } from "../src/lib/catalog-filters";
describe("catalog brand matching", () => {
  it("uses the actual brand ID rather than guessing from a name or slug", () => {
    const brand = {...seedBrands[0],id:"live-brand-uuid",slug:"different-slug",name:"A name with punctuation!"};
    const product = {...seedProducts[0],brandId:brand.id,brandName:brand.name};
    expect(filterCatalogProducts([product],[brand],{brand:brand.slug})).toEqual([product]);
    expect(filterCatalogProducts([product],[brand],{brand:"unknown"})).toEqual([]);
  });
  it("preserves other selected filters", () => {
    const brand = seedBrands.find(b=>b.id===seedProducts[0].brandId)!;
    const product = seedProducts[0];
    expect(filterCatalogProducts([product],[brand],{brand:brand.slug,q:product.name,size:"nonexistent"})).toEqual([]);
    expect(filterCatalogProducts([product],[brand],{brand:brand.slug,q:product.name,size:product.variants[0].size})).toEqual([product]);
  });
});
