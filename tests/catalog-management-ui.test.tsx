import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ProductListManager } from "../src/components/admin/product-list-manager";
import { VariantListManager, type VariantListItem } from "../src/components/admin/variant-list-manager";
const p1 = "11111111-1111-4111-8111-111111111111";
const p2 = "22222222-2222-4222-8222-222222222222";
const variants: VariantListItem[] = [
  {id:"v1",productId:p1,name:"Lovebird",brandName:"Zoologist",size:"1,5ml",stock:2,status:"pre_order"},
  {id:"v2",productId:p1,name:"Lovebird",brandName:"Zoologist",size:"60ml",stock:2,status:"pre_order"},
  {id:"v3",productId:p2,name:"Rose",brandName:"Musicology",size:"1.5 ml",stock:2,status:"pre_order"}
];
const products = [{id:p1,name:"Lovebird",brandName:"Zoologist",status:"pre_order" as const,readyStock:false,preOrder:true,stock:4,fromPrice:0,variantCount:2}];
const response = (ids:string[], emptyProducts:{id:string;name:string}[] = []) => ({
  ok:true,json:async () => ({ids,slugs:[],brandSlugs:[],emptyProducts,updatedCount:ids.length})
});
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe("catalog management UI", () => {
  it("filters equivalent sizes across brands and resets selections", () => {
    render(<VariantListManager initialVariants={variants} />);
    fireEvent.change(screen.getByLabelText("Ukuran produk"),{target:{value:"ml:1.5"}});
    expect(screen.queryByLabelText("Select Lovebird 60ml")).toBeNull();
    expect(screen.getByText("Zoologist")).toBeTruthy();
    expect(screen.getByText("Musicology")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Select all matching sizes"));
    expect(screen.getByText("2 ukuran ditemukan · 2 dipilih")).toBeTruthy();
    fireEvent.change(screen.getByRole("searchbox"),{target:{value:"Rose"}});
    expect(screen.getByText("1 ukuran ditemukan · 0 dipilih")).toBeTruthy();
  });
  it("cancels deletion without mutation and initially focuses Cancel", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(["v1"])); vi.stubGlobal("fetch",fetchMock);
    render(<VariantListManager initialVariants={variants} />);
    fireEvent.click(screen.getByLabelText("Select Lovebird 1,5ml"));
    fireEvent.click(screen.getByText("Delete Selected Sizes"));
    await screen.findByRole("dialog");
    expect(document.activeElement).toBe(screen.getByText("Batal"));
    fireEvent.click(screen.getByText("Batal"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).preview).toBe(true);
    expect(screen.getByLabelText("Select Lovebird 1,5ml")).toBeTruthy();
  });
  it("confirms the exact last-size warning and preserves other rows", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(["v3"],[{id:p2,name:"Rose"}])); vi.stubGlobal("fetch",fetchMock);
    render(<VariantListManager initialVariants={variants} />);
    fireEvent.click(screen.getByLabelText("Select Rose 1.5 ml"));
    fireEvent.click(screen.getByText("Delete Selected Sizes"));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/Ini adalah ukuran terakhir/)).toBeTruthy();
    expect(within(dialog).getByText(/Produk tetap tersimpan/)).toBeTruthy();
    fireEvent.click(screen.getByText("Ya, hapus"));
    await waitFor(() => expect(screen.queryByLabelText("Select Rose 1.5 ml")).toBeNull());
    expect(screen.getByLabelText("Select Lovebird 60ml")).toBeTruthy();
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ids:["v3"],preview:false,confirmedEmptyProducts:[p2]});
  });
  it("keeps selected rows when deletion fails and requires a fresh confirmation", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(response(["v1"]))
      .mockResolvedValueOnce({ok:false,json:async () => ({error:"Selection changed"})}));
    render(<VariantListManager initialVariants={variants} />);
    fireEvent.click(screen.getByLabelText("Select Lovebird 1,5ml"));
    fireEvent.click(screen.getByText("Delete Selected Sizes"));
    fireEvent.click(await screen.findByText("Ya, hapus"));
    await screen.findByRole("alert");
    expect(screen.getByLabelText("Select Lovebird 1,5ml")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it.each([['Set Best Seller','Best Seller'],['Set New Product','New Product']])("applies %s to selected products", async (button,badge) => {
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue(response([p1])));
    render(<ProductListManager initialProducts={products} />);
    fireEvent.click(screen.getByLabelText("Select Lovebird"));
    fireEvent.click(screen.getByText(button));
    fireEvent.click(await screen.findByText("Ya, terapkan"));
    await screen.findByText(badge);
    expect(screen.getByText("0 selected")).toBeTruthy();
  });
  it("removes selected products after confirming full product deletion", async () => {
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue(response([p1])));
    render(<ProductListManager initialProducts={products} />);
    fireEvent.click(screen.getByLabelText("Select Lovebird"));
    fireEvent.click(screen.getByText("Delete Selected"));
    await screen.findByText(/Seluruh ukuran produk ini juga/);
    fireEvent.click(screen.getByText("Ya, hapus"));
    await waitFor(() => expect(screen.queryByLabelText("Select Lovebird")).toBeNull());
  });
  it("clears product selection on search and shows variantless indicator", () => {
    render(<ProductListManager initialProducts={[{...products[0],variantCount:0}]} />);
    expect(screen.getByText("Tanpa ukuran — tersembunyi dari katalog")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Select Lovebird"));
    fireEvent.change(screen.getByRole("searchbox"),{target:{value:"Love"}});
    expect(screen.getByText("0 selected")).toBeTruthy();
  });
});
