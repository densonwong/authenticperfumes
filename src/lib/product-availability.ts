import type { ProductStatus } from "@/lib/types";

export function isReadyStockProduct(product: {
  readyStock: boolean;
  status: ProductStatus;
}) {
  return (
    product.readyStock &&
    (product.status === "ready_stock" || product.status === "limited_stock")
  );
}
