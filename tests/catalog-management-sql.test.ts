// @vitest-environment node
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

const db = new PGlite();
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const [brand, p1, p2, v1, v2, v3] = [1, 2, 3, 4, 5, 6].map(id);
async function action(name: string, ids: string[], preview = false, ack: string[] = []) {
  return (await db.query<{ result: { emptyProducts: { id: string }[]; updatedCount: number } }>(
    "select manage_catalog_selection($1, $2::uuid[], $3, $4::uuid[]) as result", [name, ids, preview, ack])).rows[0].result;
}
const count = async (table: string) => Number((await db.query<{ count: string }>(`select count(*) from ${table}`)).rows[0].count);
beforeAll(async () => {
  await db.exec(`create schema auth; create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql as 'select null::uuid';
    create role anon; create role authenticated; create role service_role;`);
  await db.exec(readFileSync("supabase/schema.sql", "utf8").replace('create extension if not exists "pgcrypto";', ''));
  await db.exec(readFileSync("supabase/migrations/20260904090000_catalog_management.sql", "utf8"));
}, 30000);
beforeEach(async () => {
  await db.exec("truncate brands cascade");
  await db.query(`insert into brands(id,name,slug,logo_url,country,description) values($1,'Test','test','image','ID','Test')`, [brand]);
  for (const p of [p1,p2]) await db.query(`insert into products(id,brand_id,slug,name,image_url,gender,concentration,country_of_origin,description)
    values($1::uuid,$2::uuid,$1::text,$1::text,'image','unisex','EDP','ID','test')`, [p, brand]);
  for (const [v,p,size] of [[v1,p1,'1,5ml'],[v2,p1,'60ml'],[v3,p2,'2ml']]) {
    await db.query(`insert into product_variants(id,product_id,size,retail_price,authentic_price) values($1,$2,$3,0,0)`, [v,p,size]);
  }
});
afterAll(async () => { await db.close(); });

describe("atomic catalog SQL", () => {
  it("previews without mutation and protects only the last sizes", async () => {
    const preview = await action("delete_variants", [v1,v3], true);
    expect(preview.emptyProducts).toEqual([{ id:p2, name:p2 }]);
    expect(await count("product_variants")).toBe(3);
    await expect(action("delete_variants", [v1,v3])).rejects.toThrow("Last-size selection changed");
    expect(await count("product_variants")).toBe(3);
    await action("delete_variants", [v1,v3], false, [p2]);
    expect(await count("products")).toBe(2);
    expect((await db.query("select id from product_variants")).rows).toEqual([{id:v2}]);
    expect((await db.query("select product_count from brands")).rows[0]).toEqual({product_count:1});
  });
  it("restores counts after adding a size without publishing hidden products", async () => {
    await action("delete_variants", [v3], false, [p2]);
    expect((await db.query("select published from products where id=$1", [p2])).rows[0]).toEqual({published:true});
    await db.query("insert into product_variants(id,product_id,size,retail_price,authentic_price) values($1,$2,'5ml',0,0)",[id(7),p2]);
    expect((await db.query("select product_count from brands")).rows[0]).toEqual({product_count:2});
    await db.query("update products set published=false where id=$1",[p2]);
    await action("delete_variants", [id(7)], false, [p2]);
    await db.query("insert into product_variants(id,product_id,size,retail_price,authentic_price) values($1,$2,'5ml',0,0)",[id(7),p2]);
    expect((await db.query("select published from products where id=$1",[p2])).rows[0]).toEqual({published:false});
    expect((await db.query("select product_count from brands")).rows[0]).toEqual({product_count:1});
  });
  it("detects a changed last-size warning after preview", async () => {
    await action("delete_variants", [v1], true);
    await db.query("delete from product_variants where id=$1",[v2]);
    await expect(action("delete_variants", [v1])).rejects.toThrow("Last-size selection changed");
    expect(await count("product_variants")).toBe(2);
  });
  it("handles deleting all sizes of one product as last-size deletion", async () => {
    await expect(action("delete_variants", [v1,v2])).rejects.toThrow();
    await action("delete_variants", [v1,v2], false, [p1]);
    expect(await count("products")).toBe(2);
    expect(await count("product_variants")).toBe(1);
  });
  it("updates only the requested merchandising flag and products", async () => {
    await action("set_best_seller", [p1]);
    await action("set_new_product", [p2]);
    expect((await db.query("select best_seller,new_arrival,status from products order by id")).rows).toEqual([
      {best_seller:true,new_arrival:false,status:"ready_stock"}, {best_seller:false,new_arrival:true,status:"ready_stock"}
    ]);
    expect(await count("product_variants")).toBe(3);
  });
  it("rejects missing targets without partial mutation and cascades selected products only", async () => {
    await expect(action("delete_products", [p1,id(99)])).rejects.toThrow("Selection changed");
    expect(await count("products")).toBe(2);
    await action("delete_products", [p1]);
    expect(await count("products")).toBe(1);
    expect((await db.query("select id from product_variants")).rows).toEqual([{id:v3}]);
    expect((await db.query("select product_count from brands")).rows[0]).toEqual({product_count:1});
  });
  it("rolls the whole mutation back on a database error", async () => {
    await db.exec(`create function test_reject_delete() returns trigger language plpgsql as $$ begin raise exception 'test failure'; end; $$;
      create trigger test_reject_delete before delete on product_variants for each row execute function test_reject_delete();`);
    try {
      await expect(action("delete_products", [p1,p2])).rejects.toThrow("test failure");
      expect(await count("products")).toBe(2);
      expect(await count("product_variants")).toBe(3);
    } finally { await db.exec("drop trigger test_reject_delete on product_variants; drop function test_reject_delete();"); }
  });
  it("never allows public or authenticated-role RPC execution", async () => {
    for (const role of ["anon","authenticated","service_role"]) {
      const result = await db.query<{allowed:boolean}>("select has_function_privilege($1, 'manage_catalog_selection(text,uuid[],boolean,uuid[])', 'execute') as allowed",[role]);
      expect(result.rows[0].allowed).toBe(role === "service_role");
    }
  });
});
