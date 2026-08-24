import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Marquee } from "@/components/motion/marquee";
import { logoBoxHeight } from "@/lib/brand-logo-wall";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import type { Brand } from "@/lib/types";

export type LogoWallBrand = {
  brand: Brand;
  logoUrl: string;
  aspect: number;
  /** A locally hosted asset from the fetch script, already tightly cropped. */
  vector: boolean;
};

// A short list would leave a visible gap in the loop, so the curated order is
// repeated until the track is comfortably wider than a desktop viewport.
const MIN_ITEMS = 14;

// Optical area each logo is scaled to fill, in CSS pixels squared. Mobile gets
// a smaller target so the strip stays a thin band on a narrow screen.
const AREA_MOBILE = 1500;
const AREA_DESKTOP = 2600;

/**
 * Logos uploaded in admin are flattened onto a white background - most are
 * JPEG, which has no alpha channel at all - so they read as pale rectangles on
 * the paper background. They also carry wildly different amounts of built-in
 * whitespace, which makes them render at unrelated sizes side by side.
 *
 * e_trim crops the border, e_make_transparent turns the remaining flat white
 * into alpha, and the image loader keeps both ahead of its own resize so they
 * see the original pixels. The tolerance is deliberately low: a wider one
 * starts eating the light strokes inside a mark.
 *
 * Assets from the fetch script are already tight and already transparent, so
 * they skip this entirely.
 */
function cleanBackground(url: string) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;

  return url.replace("/upload/", "/upload/e_trim/e_make_transparent:20/");
}

function fillTrack(items: LogoWallBrand[]) {
  if (items.length === 0) return [];

  const filled: LogoWallBrand[] = [];
  while (filled.length < MIN_ITEMS) {
    filled.push(...items);
  }

  return filled;
}

export function BrandMarquee({
  brands,
  label,
  locale
}: {
  brands: LogoWallBrand[];
  label: string;
  locale: Locale;
}) {
  const items = fillTrack(brands);

  if (items.length === 0) return null;

  return (
    <section className="border-b border-ink/10 bg-paper" aria-label={label}>
      <Marquee speed="slow" className="py-4 sm:py-6">
        {items.map(({ brand, logoUrl, aspect, vector }, index) => {
          const isFirstPass = index < brands.length;

          return (
            <Link
              key={`${brand.id}-${index}`}
              href={localizedPath(locale, `/brands/${brand.slug}`)}
              className="group flex h-12 shrink-0 items-center justify-center px-6 sm:h-16 sm:px-8"
              tabIndex={isFirstPass ? undefined : -1}
              aria-hidden={isFirstPass ? undefined : true}
            >
              <Image
                src={vector ? logoUrl : cleanBackground(logoUrl)}
                alt={brand.name}
                width={400}
                height={Math.round(400 / aspect)}
                // Local assets are already sized for the strip, and an SVG has
                // nothing to optimise.
                unoptimized={vector}
                // The whole set is well under 100KB; eager keeps blank slots out
                // of the loop as the track scrolls.
                loading="eager"
                className="logo-wall-mark w-auto object-contain opacity-70 grayscale transition duration-500 ease-out group-hover:opacity-100 group-hover:grayscale-0"
                style={
                  {
                    "--logo-h": `${logoBoxHeight(aspect, AREA_MOBILE)}px`,
                    "--logo-h-lg": `${logoBoxHeight(aspect, AREA_DESKTOP)}px`
                  } as CSSProperties
                }
              />
            </Link>
          );
        })}
      </Marquee>
    </section>
  );
}
