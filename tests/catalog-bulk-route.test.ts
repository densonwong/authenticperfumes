// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
const mock = vi.hoisted(() => ({ auth:vi.fn(), client:vi.fn(), rpc:vi.fn(), profile:vi.fn(), invalidate:vi.fn() }));
vi.mock("@/lib/admin-auth", () => ({ requireAdmin:mock.auth }));
vi.mock("@/lib/supabase/admin", () => ({ createSupabaseAdminClient:mock.client }));
vi.mock("@/lib/catalog-cache", () => ({ invalidateCatalog:mock.invalidate }));
import { POST } from "../src/app/api/products/bulk-actions/route";
const id = "11111111-1111-4111-8111-111111111111";
const request = (body:unknown) => new Request("http://localhost/api/products/bulk-actions", { method:"POST", body:JSON.stringify(body) });
beforeEach(() => {
  vi.resetAllMocks(); mock.auth.mockResolvedValue({id}); mock.profile.mockResolvedValue({data:{role:"admin"}});
  mock.client.mockReturnValue({ rpc:mock.rpc, from:() => ({ select:() => ({ eq:() => ({ maybeSingle:mock.profile }) }) }) });
  mock.rpc.mockResolvedValue({data:{ids:[id],slugs:["rose"],brandSlugs:["house"],emptyProducts:[],updatedCount:1}});
});
describe("catalog bulk endpoint", () => {
  it("requires authentication before reading or writing", async () => {
    mock.auth.mockRejectedValue(new Error("login required"));
    await expect(POST(request({action:"delete_products",ids:[id]}))).rejects.toThrow("login required");
    expect(mock.rpc).not.toHaveBeenCalled();
  });
  it("rejects non-admin accounts", async () => {
    mock.profile.mockResolvedValue({data:{role:"customer"}});
    expect((await POST(request({action:"delete_products",ids:[id]}))).status).toBe(403);
    expect(mock.rpc).not.toHaveBeenCalled();
  });
  it("validates IDs and handles missing database", async () => {
    expect((await POST(request({action:"delete_products",ids:["bad"]}))).status).toBe(400);
    mock.client.mockReturnValue(null);
    expect((await POST(request({action:"delete_products",ids:[id]}))).status).toBe(503);
  });
  it("previews without invalidation and forwards explicit last-size acknowledgement", async () => {
    await POST(request({action:"delete_variants",ids:[id],preview:true}));
    expect(mock.invalidate).not.toHaveBeenCalled();
    await POST(request({action:"delete_variants",ids:[id],confirmedEmptyProducts:[id]}));
    expect(mock.rpc).toHaveBeenLastCalledWith("manage_catalog_selection",expect.objectContaining({confirmed_empty_products:[id],preview:false}));
    expect(mock.invalidate).toHaveBeenCalledWith(["brands","products"],["/products/rose","/brands/house"]);
  });
  it("returns conflicts without invalidating cached records", async () => {
    mock.rpc.mockResolvedValue({error:{code:"P0001",message:"Review again"}});
    expect((await POST(request({action:"delete_variants",ids:[id]}))).status).toBe(409);
    expect(mock.invalidate).not.toHaveBeenCalled();
    mock.rpc.mockResolvedValue({error:{code:"XX000",message:"private details"}});
    const response = await POST(request({action:"delete_variants",ids:[id]}));
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("private details");
  });
});
