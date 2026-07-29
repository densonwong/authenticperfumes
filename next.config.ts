import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/id", permanent: true },
      { source: "/products/:slug", destination: "/id/products/:slug", permanent: true },
      { source: "/brands/:slug", destination: "/id/brands/:slug", permanent: true },
      { source: "/shop", destination: "/id/shop", permanent: true },
      { source: "/brands", destination: "/id/brands", permanent: true },
      { source: "/new-arrivals", destination: "/id/new-arrivals", permanent: true },
      { source: "/best-sellers", destination: "/id/best-sellers", permanent: true },
      { source: "/pre-order", destination: "/id/pre-order", permanent: true },
      { source: "/testimonials", destination: "/id/testimonials", permanent: true },
      { source: "/about", destination: "/id/about", permanent: true },
      { source: "/contact", destination: "/id/contact", permanent: true }
    ];
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  }
};

export default nextConfig;
