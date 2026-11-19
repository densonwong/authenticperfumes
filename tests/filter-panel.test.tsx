import type { AnchorHTMLAttributes } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FilterPanel } from "../src/components/storefront/filter-panel";
import { dictionaries } from "../src/lib/i18n";

vi.mock("next/link", () => ({ default: ({ onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) =>
  <a {...props} onClick={event => { event.preventDefault(); onClick?.(event); }} />
}));
vi.mock("../src/components/storefront/brand-search-input", () => ({
  BrandSearchInput: ({ initialQuery }: { initialQuery?: string }) => <input aria-label="Pencarian" name="q" defaultValue={initialQuery} />
}));

afterEach(cleanup);
const dictionary = { ...dictionaries.id.shop, ...dictionaries.id.common };
const labels = ["Stok tersedia", "Pre-order", "Terlaris", "Produk terbaru"];
const checkboxes = () => labels.map(label => screen.getByRole("checkbox", { name: label }) as HTMLInputElement);
const renderPanel = (selected: Parameters<typeof FilterPanel>[0]["selected"]) =>
  <FilterPanel brands={[]} sizes={["50ml"]} selected={selected} dictionary={dictionary} locale="id" />;

describe("catalog filter navigation", () => {
  it("resynchronizes all four flags on applied query changes while preserving ordinary edits", () => {
    const { rerender } = render(renderPanel({ readyStock: "true", preOrder: "true" }));
    expect(checkboxes().map(input => input.checked)).toEqual([true, true, false, false]);
    fireEvent.click(checkboxes()[2]);
    const edited = checkboxes()[2];
    rerender(renderPanel({ preOrder: "true", readyStock: "true" }));
    expect(checkboxes()[2]).toBe(edited);
    expect(checkboxes().map(input => input.checked)).toEqual([true, true, true, false]);

    // Clear/navigation can change only another filter, not the flag values.
    rerender(renderPanel({ brand: "dior" }));
    expect(checkboxes().map(input => input.checked)).toEqual([false, false, false, false]);
    rerender(renderPanel({ preOrder: "true", bestSeller: "true", newArrival: "true" }));
    expect(checkboxes().map(input => input.checked)).toEqual([false, true, true, true]);
    // Returning to an earlier applied query restores that query's flag state.
    rerender(renderPanel({ readyStock: "true", preOrder: "true" }));
    expect(checkboxes().map(input => input.checked)).toEqual([true, true, false, false]);
  });

  it("clears unapplied checkboxes and search even when the URL is already unfiltered", () => {
    const { rerender } = render(renderPanel({}));
    for (const input of checkboxes()) fireEvent.click(input);
    fireEvent.change(screen.getByRole("textbox", { name: "Pencarian" }), { target: { value: "unfinished search" } });
    expect(checkboxes().every(input => input.checked)).toBe(true);
    const clear = screen.getByRole("link", { name: dictionary.clear });
    expect(clear.getAttribute("href")).toBe("/id/shop");
    fireEvent.click(clear);
    rerender(renderPanel({}));
    expect(checkboxes().map(input => input.checked)).toEqual([false, false, false, false]);
    expect((screen.getByRole("textbox", { name: "Pencarian" }) as HTMLInputElement).value).toBe("");
  });
});
