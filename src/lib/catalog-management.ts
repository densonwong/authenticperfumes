import { isUuid } from "@/lib/ids";

export const catalogActions = ["delete_products", "set_best_seller", "set_new_product", "delete_variants"] as const;
export type CatalogAction = (typeof catalogActions)[number];
export type CatalogSelection = {
  action: CatalogAction;
  ids: string[];
  preview: boolean;
  confirmedEmptyProducts: string[];
};
export type CatalogMutationResult = {
  ids: string[];
  slugs: string[];
  brandSlugs: string[];
  emptyProducts: Array<{ id: string; name: string }>;
  updatedCount: number;
};

export function parseCatalogSelection(body: unknown): CatalogSelection | { error: string } {
  if (!body || typeof body !== "object") return { error: "Invalid request body." };
  const input = body as Record<string, unknown>;
  const validIds = (value: unknown): value is string[] => Array.isArray(value) &&
    value.length <= 2000 && value.every(id => typeof id === "string" && isUuid(id));
  if (!catalogActions.includes(input.action as CatalogAction)) return { error: "Unsupported action." };
  if (!validIds(input.ids) || !input.ids.length) return { error: "Select between 1 and 2,000 valid targets." };
  if (input.preview !== undefined && typeof input.preview !== "boolean") return { error: "Invalid preview flag." };
  if (input.confirmedEmptyProducts !== undefined && !validIds(input.confirmedEmptyProducts)) {
    return { error: "Invalid last-size confirmation." };
  }
  return {
    action: input.action as CatalogAction,
    ids: [...new Set(input.ids)],
    preview: input.preview === true,
    confirmedEmptyProducts: [...new Set((input.confirmedEmptyProducts ?? []) as string[])]
  };
}

export function productSizeKey(size: string) {
  const normalized = size.trim().toLowerCase().replace(/\s+/g, " ");
  const match = normalized.match(/^(\d+(?:[.,]\d+)?)\s*(ml|l)$/);
  return match ? `ml:${Number(match[1].replace(",", ".")) * (match[2] === "l" ? 1000 : 1)}` : normalized;
}

export async function mutateCatalog(input: CatalogSelection): Promise<CatalogMutationResult> {
  const response = await fetch("/api/products/bulk-actions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Unable to update catalog. Refresh and try again.");
  return result;
}
