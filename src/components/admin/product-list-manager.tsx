"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { formatRupiah } from "@/lib/format";
import {
  applyBulkAvailability,
  filterAdminProductItems,
  type AdminProductListItem,
  type AvailabilityFilter,
  type BulkAvailabilityTarget
} from "@/lib/admin-product-bulk";

function formatAdminPrice(price: number) {
  return price > 0 ? formatRupiah(price) : "Ask";
}

export function ProductListManager({
  initialProducts
}: {
  initialProducts: AdminProductListItem[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(
    () => filterAdminProductItems(products, query, availability),
    [availability, products, query]
  );
  const allMatchingSelected =
    filteredProducts.length > 0 && filteredProducts.every((product) => selectedIds.has(product.id));
  const someMatchingSelected = filteredProducts.some((product) => selectedIds.has(product.id));

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someMatchingSelected && !allMatchingSelected;
    }
  }, [allMatchingSelected, someMatchingSelected]);

  function toggleProduct(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllMatching() {
    const matchingIds = filteredProducts.map((product) => product.id);
    const areAllSelected =
      matchingIds.length > 0 && matchingIds.every((id) => selectedIds.has(id));

    setSelectedIds((current) => {
      const next = new Set(current);
      matchingIds.forEach((id) => {
        if (areAllSelected) next.delete(id);
        else next.add(id);
      });
      return next;
    });
  }

  async function updateAvailability(target: BulkAvailabilityTarget) {
    const ids = [...selectedIds];
    const label = target === "ready_stock" ? "Ready Stock" : "Pre Order";

    if (
      !ids.length ||
      !window.confirm(
        `Set ${ids.length} selected product${ids.length === 1 ? "" : "s"} to ${label}?`
      )
    ) {
      return;
    }

    setIsUpdating(true);
    setNotice(null);
    const updatedIds = new Set(ids);

    try {
      const response = await fetch("/api/products/bulk-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, target })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to update products.");
      }

      setProducts((current) => applyBulkAvailability(current, updatedIds, target));
      setSelectedIds(new Set());
      setNotice({
        type: "success",
        text: `${result.updatedCount} product${result.updatedCount === 1 ? "" : "s"} updated to ${label}.`
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to update products."
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 border border-stone/30 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_220px_auto] lg:items-end">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">
              Search
            </span>
            <input
              type="search"
              aria-label="Search products"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Product or brand name"
              className="mt-2 h-10 w-full border-stone/40 bg-paper text-sm focus:border-ink focus:ring-ink"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">
              Availability
            </span>
            <select
              aria-label="Availability"
              value={availability}
              onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)}
              className="mt-2 h-10 w-full border-stone/40 bg-paper text-sm focus:border-ink focus:ring-ink"
            >
              <option value="all">All Products</option>
              <option value="ready_stock">Ready Stock</option>
              <option value="pre_order">Pre Order</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              disabled={selectedIds.size === 0 || isUpdating}
              onClick={() => updateAvailability("ready_stock")}
              className="h-10 border border-ink bg-white px-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition hover:bg-warm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Set Ready Stock
            </button>
            <button
              type="button"
              disabled={selectedIds.size === 0 || isUpdating}
              onClick={() => updateAvailability("pre_order")}
              className="h-10 border border-ink bg-ink px-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Set Pre Order
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-stone/20 pt-3 text-sm">
          <p className="text-stone">
            {filteredProducts.length} matching · <span className="font-semibold text-ink">{selectedIds.size} selected</span>
          </p>
          <button
            type="button"
            disabled={selectedIds.size === 0 || isUpdating}
            onClick={() => setSelectedIds(new Set())}
            className="text-xs font-semibold uppercase tracking-[0.1em] text-ink underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear Selection
          </button>
        </div>

        {notice ? (
          <p
            role={notice.type === "error" ? "alert" : "status"}
            className={`mt-3 border px-3 py-2 text-sm ${
              notice.type === "error"
                ? "border-red-300 bg-red-50 text-red-800"
                : "border-green-300 bg-green-50 text-green-800"
            }`}
          >
            {notice.text}
          </p>
        ) : null}
      </div>

      <div className="max-h-[calc(100vh-17rem)] min-h-80 overflow-auto border border-stone/30 bg-white">
        <table className="min-w-full divide-y divide-stone/20 text-sm">
          <thead className="sticky top-0 z-10 bg-warm text-left text-xs font-semibold uppercase tracking-[0.12em] text-stone shadow-sm">
            <tr>
              <th className="w-12 px-3 py-3">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  aria-label="Select all matching products"
                  checked={allMatchingSelected}
                  disabled={filteredProducts.length === 0 || isUpdating}
                  onChange={toggleAllMatching}
                  className="border-stone/40 text-ink focus:ring-ink"
                />
              </th>
              <th className="px-3 py-3">Product</th>
              <th className="px-3 py-3">Brand</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">From</th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone/20">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="align-top">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${product.name}`}
                      checked={selectedIds.has(product.id)}
                      disabled={isUpdating}
                      onChange={() => toggleProduct(product.id)}
                      className="border-stone/40 text-ink focus:ring-ink"
                    />
                  </td>
                  <td className="px-3 py-3 font-semibold">{product.name}</td>
                  <td className="px-3 py-3 text-stone">{product.brandName}</td>
                  <td className="px-3 py-3">{product.status.replaceAll("_", " ")}</td>
                  <td className="px-3 py-3">{product.stock}</td>
                  <td className="px-3 py-3">{formatAdminPrice(product.fromPrice)}</td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-semibold text-ink underline underline-offset-4"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-stone">
                  No products match the current search and availability filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
