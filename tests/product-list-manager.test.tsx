import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductListManager } from "../src/components/admin/product-list-manager";
import type { AdminProductListItem } from "../src/lib/admin-product-bulk";

const products: AdminProductListItem[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Neroli Nasimba",
    brandName: "Maison Crivelli",
    status: "ready_stock",
    readyStock: true,
    preOrder: false,
    stock: 2,
    fromPrice: 0
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Naxos",
    brandName: "Xerjoff",
    status: "pre_order",
    readyStock: false,
    preOrder: true,
    stock: 0,
    fromPrice: 0
  }
];

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("ProductListManager", () => {
  it("searches by brand without scrolling through unrelated rows", () => {
    render(<ProductListManager initialProducts={products} />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Search products" }), {
      target: { value: "Xerjoff" }
    });

    expect(screen.getByText("Naxos")).toBeTruthy();
    expect(screen.queryByText("Neroli Nasimba")).toBeNull();
  });

  it("selects all currently filtered products", () => {
    render(<ProductListManager initialProducts={products} />);

    fireEvent.change(screen.getByLabelText("Availability"), {
      target: { value: "pre_order" }
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all matching products" }));

    expect(screen.getByText("1 selected")).toBeTruthy();
  });

  it("updates selected rows only after a successful request", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ updatedCount: 1 }) })
    );
    render(<ProductListManager initialProducts={products} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Select Neroli Nasimba" }));
    fireEvent.click(screen.getByRole("button", { name: "Set Pre Order" }));

    await waitFor(() =>
      expect(screen.getByText("1 product updated to Pre Order.")).toBeTruthy()
    );
    expect(screen.getAllByText("pre order").length).toBeGreaterThan(0);
    expect(screen.getByText("0 selected")).toBeTruthy();
  });

  it("retains selection and displays the server error", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Database unavailable." })
      })
    );
    render(<ProductListManager initialProducts={products} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Select Neroli Nasimba" }));
    fireEvent.click(screen.getByRole("button", { name: "Set Pre Order" }));

    await waitFor(() => expect(screen.getByText("Database unavailable.")).toBeTruthy());
    expect(screen.getByText("1 selected")).toBeTruthy();
  });
});
