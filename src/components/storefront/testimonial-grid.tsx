"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Testimonial } from "@/lib/types";

export function TestimonialGrid({
  locale,
  testimonials
}: {
  locale: Locale;
  testimonials: Testimonial[];
}) {
  const [selected, setSelected] = useState<Testimonial | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((testimonial) => (
          <blockquote key={testimonial.id} className="border border-ink/10 bg-warm/45 p-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative h-12 w-12 shrink-0 overflow-hidden bg-clay transition focus:outline-none focus:ring-2 focus:ring-gold/60"
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
                  sizes="48px"
                  className="object-cover transition hover:scale-105"
                />
              </button>
              <p className="text-sm font-semibold text-ink">{testimonial.customerName}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink/70">&quot;{testimonial.quote}&quot;</p>
          </blockquote>
        ))}
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
