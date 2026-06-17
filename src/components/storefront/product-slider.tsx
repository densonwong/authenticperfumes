"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "@/components/storefront/product-card";
import type { Dictionary } from "@/lib/i18n";
import type { Product } from "@/lib/types";

export function ProductSlider({
  products,
  priority = false,
  dictionary
}: {
  products: Product[];
  priority?: boolean;
  dictionary: Dictionary;
}) {
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
    <div className="relative">
      <div className="mb-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollSlider("left")}
          className="inline-flex h-9 w-9 items-center justify-center border border-ink/15 bg-paper text-ink transition hover:border-gold hover:text-gold"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollSlider("right")}
          className="inline-flex h-9 w-9 items-center justify-center border border-ink/15 bg-paper text-ink transition hover:border-gold hover:text-gold"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div
        data-product-slider
        ref={sliderRef}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:gap-4"
      >
        {products.map((product, index) => (
          <div key={product.id} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[23%]">
            <ProductCard
              product={product}
              priority={priority && index < 2}
              dictionary={dictionary}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
