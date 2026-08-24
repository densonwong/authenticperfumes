import type { ImageLoaderProps } from "next/image";

/**
 * Transforms that have to run BEFORE the resize are passed as leading
 * components of the src, and are kept in front of the generated resize here.
 *
 * e_trim crops the uniform border: trimming after the resize would crop an
 * already-downscaled image, so the browser has to upscale the result and it
 * looks blurry. e_make_transparent drops the flat background to alpha, which
 * likewise has to see the original pixels.
 */
const PRE_RESIZE_TRANSFORMS = ["e_trim", "e_make_transparent"];

function isPreResize(component: string) {
  return PRE_RESIZE_TRANSFORMS.includes(component.split(":")[0]);
}

function cloudinaryLoader(src: string, width: number, quality?: number) {
  const [prefix, rest] = src.split("/upload/");
  const transform = `f_auto,q_${quality ?? "auto"},w_${width}`;
  const parts = rest.split("/");
  const preResize: string[] = [];

  while (parts.length > 0 && isPreResize(parts[0])) {
    preResize.push(parts.shift() as string);
  }

  return `${prefix}/upload/${[...preResize, transform, parts.join("/")].join("/")}`;
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
