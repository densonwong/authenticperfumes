import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BrandSearchInput } from "../src/components/storefront/brand-search-input";
import { FilterPanel } from "../src/components/storefront/filter-panel";
import { getDictionary } from "../src/lib/i18n";
const brands = ["Creed","Chanel","Amouage"].map((name,i) => ({id:String(i),name,slug:name.toLowerCase()}));
const response = (options: unknown[]) => ({ ok: true, json: async () => ({ options }) }) as Response;
const settleSuggestions = async () => { await act(async () => { await vi.advanceTimersByTimeAsync(220); }); };
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response([])));
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
describe("brand search suggestions", () => {
  it("shows alphabetical prefix matches without matching unrelated brands", () => {
    render(<BrandSearchInput brands={brands} label="Cari" placeholder="Cari" locale="id" onSelectBrand={vi.fn()} onSelectProduct={vi.fn()} />);
    fireEvent.change(screen.getByRole("combobox"),{target:{value:"C"}});
    expect(screen.getAllByRole("option").map(e => e.textContent)).toEqual(["ChanelMerek","CreedMerek"]);
    expect(screen.queryByText("Amouage")).toBeNull();
  });
  it("supports arrows, Enter, Escape and free text", async () => {
    const select = vi.fn();
    render(<BrandSearchInput brands={brands} label="Search" placeholder="Search" locale="en" onSelectBrand={select} onSelectProduct={vi.fn()} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input,{target:{value:"c"}});
    fireEvent.keyDown(input,{key:"Enter"}); expect(select).not.toHaveBeenCalled();
    fireEvent.keyDown(input,{key:"ArrowDown"}); fireEvent.keyDown(input,{key:"ArrowDown"}); fireEvent.keyDown(input,{key:"Enter"});
    expect(select).toHaveBeenCalledWith("creed",null);
    expect((input as HTMLInputElement).value).toBe("");
    fireEvent.change(input,{target:{value:"c"}}); fireEvent.keyDown(input,{key:"Escape"});
    expect(screen.queryByRole("listbox")).toBeNull();
    fireEvent.change(input,{target:{value:"not-a-brand"}});
    await settleSuggestions();
    expect(screen.getByRole("status").textContent).toContain("Press Enter to search perfumes");
  });
  it("suggests full product names from the API and selects the product search", async () => {
    vi.mocked(fetch).mockResolvedValue(response([{key:"product-p1",label:"Dior Sauvage",type:"product",value:"Dior Sauvage"}]));
    const selectProduct = vi.fn();
    render(<BrandSearchInput brands={brands} label="Cari" placeholder="Cari" locale="id"
      onSelectBrand={vi.fn()} onSelectProduct={selectProduct} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "dior sau" } });
    expect(fetch).not.toHaveBeenCalled();
    await settleSuggestions();
    expect(fetch).toHaveBeenCalledWith("/api/catalog-search?q=dior+sau", expect.objectContaining({signal:expect.any(AbortSignal)}));
    expect(screen.getByRole("option", { name: "Dior Sauvage" })).toBeTruthy();
    fireEvent.click(screen.getByRole("option", { name: "Dior Sauvage" }));
    expect(selectProduct).toHaveBeenCalledWith("Dior Sauvage", null);
  });
  it("submits selected brand with a blank query and preserves other form filters", () => {
    let submitted: FormData | undefined;
    vi.spyOn(HTMLFormElement.prototype,"requestSubmit").mockImplementation(function (this: HTMLFormElement) {submitted = new FormData(this);});
    const dictionary = getDictionary("id");
    render(<FilterPanel brands={brands} sizes={["2ml"]} selected={{size:"2ml",readyStock:"true"}}
      dictionary={{...dictionary.shop,...dictionary.common}} locale="id" />);
    fireEvent.change(screen.getByRole("combobox",{name:"Cari"}),{target:{value:"c"}});
    fireEvent.click(screen.getByRole("option",{name:"Chanel"}));
    expect(submitted?.get("brand")).toBe("chanel");
    expect(submitted?.get("q")).toBe("");
    expect(submitted?.get("size")).toBe("2ml");
    expect(submitted?.get("readyStock")).toBe("true");
  });
  it("debounces typing and rejects stale suggestions even if the aborted request finishes", async () => {
    let resolveOld!: (value: Response) => void;
    vi.mocked(fetch).mockReturnValueOnce(new Promise(resolve => { resolveOld = resolve; }))
      .mockResolvedValueOnce(response([{key:"product-new",label:"New result",type:"product",value:"New result"}]));
    render(<BrandSearchInput brands={brands} label="Search" placeholder="Search" locale="en" onSelectBrand={vi.fn()} onSelectProduct={vi.fn()} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input,{target:{value:"old"}});
    await settleSuggestions();
    const oldSignal = vi.mocked(fetch).mock.calls[0][1]?.signal;
    fireEvent.change(input,{target:{value:"ne"}});
    await act(async () => { await vi.advanceTimersByTimeAsync(190); });
    fireEvent.change(input,{target:{value:"new"}});
    await act(async () => { await vi.advanceTimersByTimeAsync(219); });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(oldSignal?.aborted).toBe(true);
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(screen.getByRole("option",{name:"New result"})).toBeTruthy();
    await act(async () => { resolveOld(response([{key:"product-old",label:"Old result",type:"product",value:"Old result"}])); });
    expect(screen.queryByRole("option",{name:"Old result"})).toBeNull();
    expect(screen.getByRole("option",{name:"New result"})).toBeTruthy();
  });
  it("keeps Enter available for normal form search when suggestions fail", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Offline"));
    const selectProduct = vi.fn();
    render(<BrandSearchInput brands={brands} label="Search" placeholder="Search" locale="en" onSelectBrand={vi.fn()} onSelectProduct={selectProduct} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input,{target:{value:"free text"}});
    await settleSuggestions();
    expect(screen.getByRole("status").textContent).toContain("Press Enter to search perfumes");
    expect(fireEvent.keyDown(input,{key:"Enter"})).toBe(true);
    expect(selectProduct).not.toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe("free text");
  });
  it("keeps suggestion order, limit and combobox active descendant accessible", async () => {
    const options = Array.from({length:35},(_,i) => ({key:`p${i}`,label:`Perfume ${String(i).padStart(2,"0")}`,type:"product",value:`Perfume ${i}`})).reverse();
    vi.mocked(fetch).mockResolvedValue(response([...options,options[0]]));
    render(<BrandSearchInput brands={brands} label="Search" placeholder="Search" locale="en" onSelectBrand={vi.fn()} onSelectProduct={vi.fn()} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input,{target:{value:"perfume"}});
    await settleSuggestions();
    expect(screen.getAllByRole("option")).toHaveLength(30);
    const first = screen.getAllByRole("option")[0];
    expect(first.textContent).toContain("Perfume 00");
    fireEvent.keyDown(input,{key:"ArrowDown"});
    expect(input.getAttribute("aria-activedescendant")).toBe(first.id);
    expect(first.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(input,{key:"Escape"});
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
