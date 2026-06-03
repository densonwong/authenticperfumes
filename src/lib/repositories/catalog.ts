import {
  seedBanners,
  seedBrands,
  seedDiscoverPosts,
  seedProducts,
  seedTestimonials,
  seedTrustMedia
} from "../seed-data";

export async function getBrands() {
  return seedBrands;
}

export async function getFeaturedBrands() {
  return seedBrands.filter((brand) => brand.featured);
}

export async function getBrandBySlug(slug: string) {
  return seedBrands.find((brand) => brand.slug === slug) ?? null;
}

export async function getProducts() {
  return seedProducts;
}

export async function getProductBySlug(slug: string) {
  return seedProducts.find((product) => product.slug === slug) ?? null;
}

export async function getNewArrivals() {
  return seedProducts.filter((product) => product.newArrival);
}

export async function getBestSellers() {
  return seedProducts.filter((product) => product.bestSeller);
}

export async function getReadyStockProducts() {
  return seedProducts.filter((product) => product.readyStock);
}

export async function getPreOrderProducts() {
  return seedProducts.filter((product) => product.preOrder);
}

export async function getBanners() {
  return seedBanners;
}

export async function getTestimonials() {
  return seedTestimonials;
}

export async function getTrustMedia() {
  return seedTrustMedia;
}

export async function getDiscoverPosts() {
  return seedDiscoverPosts;
}

export async function getDiscoverPostBySlug(slug: string) {
  return seedDiscoverPosts.find((post) => post.slug === slug) ?? null;
}
