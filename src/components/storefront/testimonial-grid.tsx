"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Testimonial } from "@/lib/types";

function StarRating({ locale }: { locale: Locale }) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={locale === "id" ? "Nilai 5 dari 5 bintang" : "Rated 5 out of 5 stars"}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
      ))}
    </div>
  );
}

export function TestimonialGrid({
  locale,
  testimonials
}: {
  locale: Locale;
  testimonials: Testimonial[];
}) {
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  function scrollSlider(direction: "left" | "right") {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left: direction === "left" ? -slider.clientWidth * 0.85 : slider.clientWidth * 0.85,
      behavior: "smooth"
    });
  }

  return (
    <>
      <div className="relative">
        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollSlider("left")}
            className="inline-flex h-10 w-10 items-center justify-center border border-ink/15 bg-paper text-ink transition hover:border-gold hover:text-gold"
            aria-label={locale === "id" ? "Geser ke kiri" : "Scroll left"}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollSlider("right")}
            className="inline-flex h-10 w-10 items-center justify-center border border-ink/15 bg-paper text-ink transition hover:border-gold hover:text-gold"
            aria-label={locale === "id" ? "Geser ke kanan" : "Scroll right"}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div
          data-testimonial-slider
          ref={sliderRef}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] sm:gap-6"
        >
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex w-[85vw] shrink-0 snap-start flex-col border border-ink/10 bg-warm/45 sm:w-[62vw] md:w-[46vw] lg:w-[31%]"
            >
              <button
                type="button"
                className="relative aspect-[4/3] w-full overflow-hidden bg-clay transition focus:outline-none focus:ring-2 focus:ring-gold/60"
                aria-label={
                  locale === "id"
                    ? `Buka foto testimoni dari ${testimonial.customerName}`
                    : `Open testimonial photo from ${testimonial.customerName}`
                }
                onClick={() => setSelected(testimonial)}
              >
                <Image
                  src={testimonial.imageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 85vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </button>

              <figcaption className="flex flex-1 flex-col gap-4 p-6">
                <StarRating locale={locale} />
                <blockquote className="text-base leading-7 text-ink/75">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div className="mt-auto border-t border-ink/10 pt-4">
                  <p className="text-sm font-semibold text-ink">{testimonial.customerName}</p>
                  {testimonial.productName ? (
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-gold">
                      {testimonial.productName}
                    </p>
                  ) : null}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/82 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={
            locale === "id"
              ? `Foto testimoni dari ${selected.customerName}`
              : `Testimonial photo from ${selected.customerName}`
          }
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-3xl border border-gold/30 bg-paper p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-semibold text-ink">
                {selected.customerName}
              </p>
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-ink/15 text-ink transition hover:bg-warm focus:outline-none focus:ring-2 focus:ring-gold/60"
                aria-label={locale === "id" ? "Tutup foto testimoni" : "Close testimonial photo"}
                onClick={() => setSelected(null)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="relative h-[70vh] max-h-[760px] min-h-[320px] bg-warm">
              <Image
                src={selected.imageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 768px, 92vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
