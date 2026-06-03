"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type ProductGalleryCarouselProps = {
  images: string[];
  productName: string;
  labels: {
    previousImage: string;
    nextImage: string;
    imageThumbnails: string;
    viewImage: string;
  };
};

export function ProductGalleryCarousel({ images, productName, labels }: ProductGalleryCarouselProps) {
  const reducedMotion = useReducedMotion();
  const galleryImages = useMemo(() => [...new Set(images)].filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];
  const canNavigate = galleryImages.length > 1;

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1));
  }

  if (!activeImage) return null;

  return (
    <div className="space-y-3">
      <div className="group relative aspect-[4/5] overflow-hidden border border-ink/10 bg-warm">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeImage}
            className="absolute inset-0"
            initial={reducedMotion ? false : { opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={activeImage}
              alt={`${productName} image ${activeIndex + 1}`}
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {canNavigate ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-paper/70 bg-paper/85 text-ink opacity-100 shadow-sm transition hover:bg-ink hover:text-paper lg:opacity-0 lg:group-hover:opacity-100"
              aria-label={labels.previousImage}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-paper/70 bg-paper/85 text-ink opacity-100 shadow-sm transition hover:bg-ink hover:text-paper lg:opacity-0 lg:group-hover:opacity-100"
              aria-label={labels.nextImage}
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        ) : null}

        <div className="absolute bottom-3 right-3 bg-paper/90 px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-ink">
          {activeIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {canNavigate ? (
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label={labels.imageThumbnails}>
          {galleryImages.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden border bg-warm transition ${
                index === activeIndex
                  ? "border-ink ring-1 ring-ink"
                  : "border-ink/10 opacity-70 hover:border-ink/35 hover:opacity-100"
              }`}
              aria-label={`${labels.viewImage} ${index + 1}`}
              aria-current={index === activeIndex}
            >
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
