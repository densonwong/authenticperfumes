import generatedLogos from "@/lib/brand-logos.generated.json";

/**
 * Curated brands for the homepage logo marquee, drawn from two sources.
 *
 * Brandfetch (scripts/fetch-brand-logos.mjs) is preferred: it returns real
 * horizontal wordmarks, two of them as SVG, which stay sharp at any size and
 * make the strip far more uniform. Its coverage of niche perfume houses is thin
 * though - of 25 brands tried, 5 came back usable. Everything else falls back to
 * the logo uploaded in admin, served through Cloudinary with e_trim.
 *
 * For the Cloudinary half, resolution and content both had to be checked by
 * hand. That column also holds product photography and dark-plated logos, and
 * several uploads are far too small to render sharply. Brands excluded for that
 * reason, measured after trimming: Almost Human (109x11), Altaia (142x26), Art
 * Meets Art (335x31), Nasomatto (291x36), Accendis (316x46), Bdk Parfums
 * (76x43), Alexandre J (80x71).
 *
 * `aspect` is only needed for the Cloudinary entries, where the trimmed shape
 * cannot be known at render time; it was measured once against the live assets.
 * Brandfetch entries carry their own exact aspect in the generated file. Either
 * way it is a layout hint: `object-contain` still fits a re-uploaded logo, just
 * with some slack in its slot.
 *
 * To add a brand: try `node scripts/fetch-brand-logos.mjs --slugs <slug>` first,
 * and check /_logo-review.html. If Brandfetch has nothing, upload a
 * light-background logo at 400px or wider in admin and add the slug plus its
 * trimmed aspect below.
 */
export type LogoWallEntry = {
  slug: string;
  /** Layout hint, ignored when a generated asset supplies its own. */
  aspect: number;
};

export const LOGO_WALL: LogoWallEntry[] = [
  { slug: "amouage", aspect: 2.05 },
  { slug: "xerjoff", aspect: 0.74 },
  { slug: "serge-lutens", aspect: 1.06 },
  { slug: "maison-crivelli", aspect: 8.88 },
  { slug: "zoologist", aspect: 1.93 },
  { slug: "roja-perfumes", aspect: 2.28 },
  { slug: "acampora", aspect: 1.79 },
  { slug: "imaginary-authors", aspect: 2.84 },
  { slug: "sora-dora", aspect: 7.03 },
  { slug: "eight-bob", aspect: 1.6 },
  { slug: "agarthi-scent-core", aspect: 1.07 },
  { slug: "adamo-parfum", aspect: 1.67 },
  { slug: "thomas-de-monaco-parfums", aspect: 5.57 },
  { slug: "andy-tauer", aspect: 0.97 }
];

type GeneratedLogo = {
  name: string;
  domain: string;
  file: string;
  aspect: number;
  bytes: number;
};

const generated: Record<string, GeneratedLogo> = generatedLogos;

/** The locally hosted wordmark for a brand, when the fetch script found one. */
export function generatedLogo(slug: string) {
  const logo = generated[slug];

  return logo ? { src: `/brand-logos/${logo.file}`, aspect: logo.aspect } : null;
}

/**
 * Height that gives every logo the same optical area: for a target area A and
 * aspect r, height is sqrt(A / r) and width follows from the aspect. Sizing
 * every logo to the same height instead would render a stacked mark a third as
 * wide as a long wordmark, which is what makes a wall look uneven. Clamped so a
 * very tall mark cannot stretch the strip and a very wide one stays legible.
 */
export function logoBoxHeight(aspect: number, targetArea: number) {
  return Math.round(Math.min(Math.max(Math.sqrt(targetArea / aspect), 18), 54));
}
