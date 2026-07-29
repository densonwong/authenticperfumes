export function changedDetailPaths(
  collection: "brands" | "products",
  previousSlug: string,
  nextSlug: string
) {
  return [...new Set([previousSlug, nextSlug])].map((slug) => `/${collection}/${slug}`);
}
