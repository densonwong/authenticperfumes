import type { ProductStatus } from "@/lib/types";

const readyStatuses: ProductStatus[] = ["ready_stock", "limited_stock"];

export function isReadyStockProduct(product: {
  readyStock: boolean;
  status: ProductStatus;
  variants?: { status: ProductStatus }[];
}) {
  if (!product.readyStock) return false;
  // A product can mix sizes (e.g. 100ml pre-order, 50ml ready), so any
  // ready-compatible variant qualifies it even when the headline status is pre_order.
  return (
    readyStatuses.includes(product.status) ||
    (product.variants ?? []).some((variant) => readyStatuses.includes(variant.status))
  );
}
