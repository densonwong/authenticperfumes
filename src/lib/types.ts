export type ProductStatus = "ready_stock" | "pre_order" | "limited_stock" | "out_of_stock";
export type Gender = "men" | "women" | "unisex";

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  country: string;
  foundedYear: number | null;
  description: string;
  productCount: number;
  featured: boolean;
};

export type ProductVariant = {
  id: string;
  size: string;
  retailPrice: number;
  authenticPrice: number;
  stock: number;
  status: ProductStatus;
};

export type Product = {
  id: string;
  brandId: string;
  brandName: string;
  slug: string;
  name: string;
  imageUrl: string;
  galleryUrls: string[];
  gender: Gender;
  concentration: string;
  notes: string[];
  countryOfOrigin: string;
  description: string;
  status: ProductStatus;
  bestSeller: boolean;
  newArrival: boolean;
  readyStock: boolean;
  preOrder: boolean;
  variants: ProductVariant[];
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  position: "primary" | "secondary" | "tertiary";
};

export type Testimonial = {
  id: string;
  customerName: string;
  quote: string;
  productName: string;
  imageUrl: string;
};
