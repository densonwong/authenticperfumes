import type { ImageLoaderProps } from "next/image";

function cloudinaryLoader(src: string, width: number, quality?: number) {
  const [prefix, rest] = src.split("/upload/");
  const transform = `f_auto,q_${quality ?? "auto"},w_${width}`;

  return `${prefix}/upload/${transform}/${rest}`;
}

function unsplashLoader(src: string, width: number, quality?: number) {
  const url = new URL(src);

  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");

  return url.toString();
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  if (src.includes("res.cloudinary.com")) {
    return cloudinaryLoader(src, width, quality);
  }

  if (src.includes("images.unsplash.com")) {
    return unsplashLoader(src, width, quality);
  }

  return `${src}?w=${width}&q=${quality ?? 75}`;
}
