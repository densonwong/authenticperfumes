import { isUuid } from "@/lib/ids";
import type { ProductStatus } from "@/lib/types";

export type BulkAvailabilityTarget = "ready_stock" | "pre_order";
export type AvailabilityFilter = "all" | BulkAvailabilityTarget;

export type AdminProductListItem = {
  id: string;
  name: string;
  brandName: string;
  status: ProductStatus;
  readyStock: boolean;
  preOrder: boolean;
  stock: number;
  fromPrice: number;
  bestSeller?: boolean;
  newArrival?: boolean;
  variantCount?: number;
};

export function filterAdminProductItems(
  items: AdminProductListItem[],
  query: string,
  availability: AvailabilityFilter
) {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesQuery =
      !normalizedQuery ||
      `${item.name} ${item.brandName}`.toLowerCase().includes(normalizedQuery);
    const matchesAvailability =
      availability === "all" ||
      (availability === "ready_stock" ? item.readyStock : item.preOrder);

    return matchesQuery && matchesAvailability;
  });
}

export function applyBulkAvailability(
  items: AdminProductListItem[],
  ids: Set<string>,
  target: BulkAvailabilityTarget
) {
  return items.map((item) =>
    ids.has(item.id)
      ? {
          ...item,
          status: target,
          readyStock: target === "ready_stock",
          preOrder: target === "pre_order"
        }
      : item
  );
}

export function parseBulkProductStatusPayload(
  body: unknown
): { ids: string[]; target: BulkAvailabilityTarget } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." };
  }

  const input = body as { ids?: unknown; target?: unknown };

  if (!Array.isArray(input.ids) || input.ids.length === 0) {
    return { error: "Select at least one product." };
  }

  if (input.ids.length > 2000) {
    return { error: "You can update at most 2,000 products at once." };
  }

  if (input.target !== "ready_stock" && input.target !== "pre_order") {
    return { error: "Target must be ready_stock or pre_order." };
  }

  if (!input.ids.every((id): id is string => typeof id === "string" && isUuid(id))) {
    return { error: "Every product ID must be a valid UUID." };
  }

  return { ids: [...new Set(input.ids)], target: input.target };
}
