import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BrandSearchInput } from "../src/components/storefront/brand-search-input";
import { FilterPanel } from "../src/components/storefront/filter-panel";
import { getDictionary } from "../src/lib/i18n";
import type { Brand } from "../src/lib/types";
const brands = ["Creed","Chanel","Amouage"].map((name,i) => ({id:String(i),name,slug:name.toLowerCase(),logoUrl:"",country:"",foundedYear:null,description:"",productCount:1,featured:false})) as Brand[];
afterEach(() => vi.restoreAllMocks());
describe("brand search suggestions", () => {
  it("shows alphabetical prefix matches without matching unrelated brands", () => {
    render(<BrandSearchInput brands={brands} label="Cari" placeholder="Cari" locale="id" onSelectBrand={vi.fn()} />);
    fireEvent.change(screen.getByRole("combobox"),{target:{value:"C"}});
    expect(screen.getAllByRole("option").map(e => e.textContent)).toEqual(["Chanel","Creed"]);
    expect(screen.queryByText("Amouage")).toBeNull();
  });
  it("supports arrows, Enter, Escape and free text", () => {
    const select = vi.fn();
    render(<BrandSearchInput brands={brands} label="Search" placeholder="Search" locale="en" onSelectBrand={select} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input,{target:{value:"c"}});
    fireEvent.keyDown(input,{key:"Enter"}); expect(select).not.toHaveBeenCalled();
    fireEvent.keyDown(input,{key:"ArrowDown"}); fireEvent.keyDown(input,{key:"ArrowDown"}); fireEvent.keyDown(input,{key:"Enter"});
    expect(select).toHaveBeenCalledWith("creed",null);
    expect((input as HTMLInputElement).value).toBe("");
    fireEvent.change(input,{target:{value:"c"}}); fireEvent.keyDown(input,{key:"Escape"});
    expect(screen.queryByRole("listbox")).toBeNull();
    fireEvent.change(input,{target:{value:"not-a-brand"}});
    expect(screen.getByRole("status").textContent).toContain("Press Enter to search perfumes");
  });
  it("submits selected brand with a blank query and preserves other form filters", () => {
    let submitted: FormData | undefined;
    vi.spyOn(HTMLFormElement.prototype,"requestSubmit").mockImplementation(function (this: HTMLFormElement) {submitted = new FormData(this);});
    const dictionary = getDictionary("id");
    render(<FilterPanel brands={brands} products={[]} selected={{size:"2ml",gender:"women",readyStock:"true"}}
      dictionary={{...dictionary.shop,...dictionary.common}} locale="id" />);
    fireEvent.change(screen.getByRole("combobox",{name:"Cari"}),{target:{value:"c"}});
    fireEvent.click(screen.getByRole("option",{name:"Chanel"}));
    expect(submitted?.get("brand")).toBe("chanel");
    expect(submitted?.get("q")).toBe("");
    expect(submitted?.get("size")).toBe("2ml");
    expect(submitted?.get("gender")).toBe("women");
    expect(submitted?.get("readyStock")).toBe("true");
  });
});
