// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Brand, Product } from "../src/lib/types";
const repository = vi.hoisted(() => ({ products:vi.fn(), brands:vi.fn() }));
vi.mock("@/lib/repositories/catalog", () => ({ getProducts:repository.products, getBrands:repository.brands }));
import { getCatalogPage, getShopInitial, getCatalogSearchOptions } from "../src/lib/catalog-listing";
import { CatalogRequestError, buildCatalogSearchOptions, catalogQueryKey, catalogQueryParams, normalizeCatalogQuery, parseCatalogQuery, selectCatalogProducts } from "../src/lib/catalog-pagination";
import { filterCatalogProducts } from "../src/lib/catalog-filters";
import { GET as pageGET } from "../src/app/api/catalog-page/route";
import { GET as searchGET } from "../src/app/api/catalog-search/route";

let products:Product[], brands:Brand[];
function makeProduct(index:number):Product {
  return {id:`p-${String(index).padStart(3,"0")}`,brandId:"brand-house",brandName:"House",slug:`perfume-${index}`,name:`Perfume ${String(index).padStart(3,"0")}`,
    imageUrl:`/product-${index}.jpg`,galleryUrls:[`/product-${index}.jpg`,`/product-${index}-hover.jpg`,`/product-${index}-extra.jpg`],gender:"unisex",concentration:"EDP",
    notes:["hidden-note"],countryOfOrigin:"France",description:"LONG_DESCRIPTION_NOT_FOR_CARDS ".repeat(200),status:"ready_stock",bestSeller:index%3===0,newArrival:index%2===0,readyStock:true,preOrder:false,
    variants:[{id:`v-${index}`,size:"100ml",retailPrice:1500000,authenticPrice:1000000+index,stock:4,status:"ready_stock"}]};
}
beforeEach(()=>{
  brands=[{id:"brand-house",name:"House",slug:"house",logoUrl:"/logo.jpg",country:"France",foundedYear:2000,description:"brand description",productCount:70,featured:true},
    {id:"brand-other",name:"Other",slug:"other",logoUrl:"/other.jpg",country:"UK",foundedYear:null,description:"other description",productCount:0,featured:false}];
  products=Array.from({length:70},(_,index)=>makeProduct(index));
  vi.clearAllMocks();repository.products.mockImplementation(async()=>products);repository.brands.mockImplementation(async()=>brands);
});

describe("bounded catalog paging",()=>{
  it("walks all products in stable order without duplicates while preserving previously returned cards",async()=>{
    const all:string[]=[];let cursor:string|null|undefined;let previous;
    do {
      const page=await getCatalogPage({collection:"shop"},cursor);
      expect(page.products.length).toBeLessThanOrEqual(24);expect(page.total).toBe(70);
      if(previous)expect(previous.products[0].id).toBe("p-000");
      all.push(...page.products.map(product=>product.id));cursor=page.nextCursor;
      previous??=page;
    }while(cursor);
    expect(all).toEqual(products.map(product=>product.id));expect(new Set(all).size).toBe(70);
    expect(previous?.products).toHaveLength(24);
  });
  it("uses lean card fields and at most one hover URL, not full product descriptions or filter data",async()=>{
    const page=await getCatalogPage({collection:"shop"});
    expect(Object.keys(page.products[0]).sort()).toEqual(["id","brandName","slug","name","imageUrl","galleryUrls","concentration","status","variants"].sort());
    expect(page.products[0].galleryUrls).toEqual(["/product-0-hover.jpg"]);
    expect(JSON.stringify(page)).not.toContain("LONG_DESCRIPTION_NOT_FOR_CARDS");
    expect(JSON.stringify(page).length).toBeLessThan(JSON.stringify(products).length/8);
    products[0].variants[0].stock=99;
    expect(page.products[0].variants[0].stock).toBe(4);
  });
  it("hides variantless rows and deduplicates overlapping upstream IDs before cursor slicing",async()=>{
    const expected=products.map(product=>product.id);
    products.splice(8,0,{...products[0]});products.push({...makeProduct(100),variants:[]});
    const all:string[]=[];let cursor:string|null|undefined;
    do {const page=await getCatalogPage({collection:"shop"},cursor);all.push(...page.products.map(product=>product.id));cursor=page.nextCursor;}while(cursor);
    expect(all).toEqual(expected);expect(new Set(all).size).toBe(70);
  });
  it("rejects invalid, cross-filter and cross-collection cursors with 409 instead of silently resetting",async()=>{
    const page=await getCatalogPage({collection:"shop"});
    for(const cursor of ["", "not-json", "***", "a".repeat(1025)])await expect(getCatalogPage({collection:"shop"},cursor)).rejects.toMatchObject({status:409,code:"CATALOG_CURSOR_STALE"});
    await expect(getCatalogPage({collection:"shop",q:"House"},page.nextCursor)).rejects.toMatchObject({status:409});
    await expect(getCatalogPage({collection:"brand",brandSlug:"house"},page.nextCursor)).rejects.toMatchObject({status:409});
    const altered=JSON.parse(Buffer.from(page.nextCursor!,"base64url").toString());altered.a="missing-id";
    await expect(getCatalogPage({collection:"shop"},Buffer.from(JSON.stringify(altered)).toString("base64url"))).rejects.toMatchObject({status:409});
    expect(page.products).toHaveLength(24);
  });
  it("detects changed catalog order, added/removed products and changed card prices",async()=>{
    for(const change of [()=>products.unshift(makeProduct(100)),()=>products.reverse(),()=>products.pop(),()=>{products[50].variants[0].authenticPrice+=10;}]){
      products=Array.from({length:70},(_,index)=>makeProduct(index));
      const first=await getCatalogPage({collection:"shop"}),oldIds=first.products.map(product=>product.id);
      change();await expect(getCatalogPage({collection:"shop"},first.nextCursor)).rejects.toMatchObject({status:409});
      expect(first.products.map(product=>product.id)).toEqual(oldIds);
    }
  });
  it("accepts equivalent variant reordering between responses without changing displayed order",async()=>{
    for(const product of products)product.variants.push({...product.variants[0],id:`alternate-${product.id}`,size:"50ml"});
    const first=await getCatalogPage({collection:"shop"});
    const originalOrder=first.products[0].variants.map(variant=>variant.id);
    expect(originalOrder).toEqual(["v-0","alternate-p-000"]);

    // A fresh repository/cache response can return related rows in another order.
    for(const product of products)product.variants.reverse();
    const next=await getCatalogPage({collection:"shop"},first.nextCursor);
    expect(next.products.map(product=>product.id)).toEqual(products.slice(24,48).map(product=>product.id));
    expect(next.products[0].variants.map(variant=>variant.id)).toEqual(["alternate-p-024","v-24"]);
    expect(first.products[0].variants.map(variant=>variant.id)).toEqual(originalOrder);
    expect(products[24].variants.map(variant=>variant.id)).toEqual(["alternate-p-024","v-24"]);
  });
  it.each(["authenticPrice","stock"] as const)("still rejects actual %s changes after equivalent variant reordering",async(key)=>{
    for(const product of products)product.variants.push({...product.variants[0],id:`alternate-${product.id}`,size:"50ml"});
    const first=await getCatalogPage({collection:"shop"});
    for(const product of products)product.variants.reverse();
    products[50].variants[0][key]+=1;
    await expect(getCatalogPage({collection:"shop"},first.nextCursor)).rejects.toMatchObject({status:409,code:"CATALOG_CURSOR_STALE"});
  });
  it("returns a useful empty page and no cursor when no rows match",async()=>{
    expect(await getCatalogPage({collection:"shop",brand:"missing-brand"})).toEqual({products:[],total:0,nextCursor:null});
    await expect(getCatalogPage({collection:"brand",brandSlug:"missing-brand"})).rejects.toMatchObject({status:404});
  });
});

describe("existing filter and metadata semantics",()=>{
  it("keeps the existing eight-filter function as the source of shop matching",()=>{
    products[0].status="pre_order";products[0].variants[0].status="limited_stock";
    products[1].readyStock=false;products[2].preOrder=true;
    products[3].variants[0].size="50ml";products[4].gender="men";
    const filters=[{q:"hidden-note"},{q:"France"},{brand:"house"},{gender:"men"},{size:"50ml"},{readyStock:"true"},{preOrder:"true"},{bestSeller:"true"},{newArrival:"true"},{q:"House Perfume",brand:"house",readyStock:"true",size:"100ml"}];
    for(const selected of filters)expect(selectCatalogProducts(products,brands,{collection:"shop",...selected})).toEqual(filterCatalogProducts(products,brands,selected));
    expect(selectCatalogProducts(products,brands,{collection:"shop",readyStock:"true"}).some(product=>product.id==="p-000")).toBe(true);
    expect(selectCatalogProducts(products,brands,{collection:"shop",readyStock:"true"}).some(product=>product.id==="p-001")).toBe(false);
  });
  it("scopes brand/new-arrival/best-seller collections using existing flags and actual brand IDs",async()=>{
    products[0].brandId="brand-other";products[0].brandName="Other";
    expect((await getCatalogPage({collection:"brand",brandSlug:"other"})).products.map(p=>p.id)).toEqual(["p-000"]);
    expect((await getCatalogPage({collection:"new-arrivals"})).total).toBe(products.filter(product=>product.newArrival).length);
    expect((await getCatalogPage({collection:"best-sellers"})).total).toBe(products.filter(product=>product.bestSeller).length);
  });
  it("keeps pre-order parity with the existing repository flag across paged results",async()=>{
    products.forEach((product,index)=>{product.preOrder=index%2===0;});
    products[0].status="ready_stock";
    products[1].status="pre_order";
    const expected=products.filter(product=>product.preOrder);
    expect(selectCatalogProducts(products,brands,{collection:"pre-order"})).toEqual(expected);
    const first=await getCatalogPage({collection:"pre-order"});
    expect(first.products).toHaveLength(24);expect(first.total).toBe(35);
    const next=await getCatalogPage({collection:"pre-order"},first.nextCursor);
    expect([...first.products,...next.products].map(product=>product.id)).toEqual(expected.map(product=>product.id));
    expect(next.nextCursor).toBeNull();
    expect(parseCatalogQuery(new URLSearchParams("collection=pre-order"))).toEqual({collection:"pre-order"});
    const route=await pageGET(new Request("http://localhost/api/catalog-page?collection=pre-order"));
    expect(route.status).toBe(200);expect((await route.json()).total).toBe(35);
  });
  it("returns all existing filter sizes and lean brands alongside only the first page",async()=>{
    products[0].variants[0].size="1l";products[1].variants[0].size="50ml";products[2].variants[0].size="10ml";
    const initial=await getShopInitial({collection:"shop",size:"50ml"});
    expect(initial.page.total).toBe(1);expect(initial.metadata.sizes).toEqual(["10ml","50ml","100ml","1l"]);
    expect(initial.metadata.totalProducts).toBe(70);expect(initial.metadata.brands[0]).toEqual({id:"brand-house",name:"House",slug:"house"});
    expect(Object.keys(initial).sort()).toEqual(["metadata","page"]);expect(initial.metadata).not.toHaveProperty("products");
    expect(repository.products).toHaveBeenCalledOnce();expect(repository.brands).toHaveBeenCalledOnce();
  });
  it("normalizes harmless blank/false flags and stable URL parameter ordering without Node dependencies",()=>{
    const a={collection:"shop" as const,q:" House ",readyStock:"false",preOrder:"true"};
    const normalized=normalizeCatalogQuery(a);
    expect(normalized).toEqual({collection:"shop",q:"House",preOrder:"true"});
    expect(catalogQueryKey(a)).toBe(catalogQueryKey({preOrder:"true",q:"House",collection:"shop"}));
    expect(parseCatalogQuery(catalogQueryParams(a))).toEqual(normalized);
    for(const params of ["collection=unknown","collection=brand","collection=shop&readyStock=yes","collection=shop&q=a&q=b","gender=invalid"])
      expect(()=>parseCatalogQuery(new URLSearchParams(params))).toThrow(CatalogRequestError);
  });
});

describe("lean search and public read routes",()=>{
  it("matches the previous combined brand/product suggestions, sort order and max 30",async()=>{
    const needle="ho";
    const old=[...brands.filter(b=>b.name.toLocaleLowerCase().startsWith(needle)).map(b=>({key:`brand-${b.id}`,label:b.name,type:"brand",value:b.slug})),
      ...products.filter(p=>`${p.brandName} ${p.name}`.toLocaleLowerCase().includes(needle)).map(p=>({key:`product-${p.id}`,label:`${p.brandName} ${p.name}`,type:"product",value:`${p.brandName} ${p.name}`}))]
      .sort((a,b)=>a.label.localeCompare(b.label)).slice(0,30);
    expect(await getCatalogSearchOptions(" HO ")).toEqual(old);
    expect(buildCatalogSearchOptions(products,brands,"hidden-note")).toEqual([]);
    const options=await getCatalogSearchOptions("house");expect(options).toHaveLength(30);
    expect(Object.keys(options[0]).sort()).toEqual(["key","label","type","value"]);
  });
  it("skips repository work for empty search and rejects oversized or repeated inputs",async()=>{
    expect(await getCatalogSearchOptions("  ")).toEqual([]);expect(repository.products).not.toHaveBeenCalled();
    expect((await searchGET(new Request("http://localhost/api/catalog-search?q="+"a".repeat(201)))).status).toBe(400);
    expect((await searchGET(new Request("http://localhost/api/catalog-search?q=a&q=b"))).status).toBe(400);
  });
  it("serves bounded GET pages and scoped errors without exposing repository details",async()=>{
    const first=await pageGET(new Request("http://localhost/api/catalog-page?collection=shop"));
    expect(first.status).toBe(200);expect(first.headers.get("cache-control")).toBe("no-store");
    const page=await first.json();expect(page.products).toHaveLength(24);
    const next=await pageGET(new Request("http://localhost/api/catalog-page?collection=shop&cursor="+page.nextCursor));expect(next.status).toBe(200);
    expect((await next.json()).products[0].id).toBe("p-024");
    expect((await pageGET(new Request("http://localhost/api/catalog-page?cursor=bad&cursor=other"))).status).toBe(409);
    expect((await pageGET(new Request("http://localhost/api/catalog-page?readyStock=oops"))).status).toBe(400);
    repository.products.mockRejectedValue(new Error("PRIVATE_SUPABASE_INTERNAL_DETAILS"));
    const failed=await pageGET(new Request("http://localhost/api/catalog-page?collection=shop"));expect(failed.status).toBe(503);
    expect(JSON.stringify(await failed.json())).not.toContain("PRIVATE_SUPABASE_INTERNAL_DETAILS");
  });
  it("returns only lean suggestions in its own response envelope",async()=>{
    const response=await searchGET(new Request("http://localhost/api/catalog-search?q=House"));expect(response.status).toBe(200);
    const body=await response.json();expect(Object.keys(body)).toEqual(["options"]);expect(body.options).toHaveLength(30);
    expect(JSON.stringify(body)).not.toContain("variants");expect(JSON.stringify(body)).not.toContain("description");
  });
});
