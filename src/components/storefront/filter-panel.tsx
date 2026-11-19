"use client";

import Link from "next/link";
import { useState } from "react";
import { flushSync } from "react-dom";
import { BrandSearchInput } from "@/components/storefront/brand-search-input";
import { CustomSelect } from "@/components/admin/custom-select";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localized-paths";
import type { Brand } from "@/lib/types";

type FilterPanelProps = {
  brands: Pick<Brand, "id" | "name" | "slug">[];
  sizes: string[];
  selected: {
    q?: string;
    brand?: string;
    gender?: string;
    size?: string;
    readyStock?: string;
    preOrder?: string;
    bestSeller?: string;
    newArrival?: string;
  };
  dictionary: Dictionary["shop"] & Dictionary["common"];
  locale: Locale;
};

export function FilterPanel(props: FilterPanelProps) {
  const [clearCount, setClearCount] = useState(0);
  const selectedKey = JSON.stringify([
    props.selected.q ?? "", props.selected.brand ?? "", props.selected.gender ?? "", props.selected.size ?? "",
    props.selected.readyStock ?? "", props.selected.preOrder ?? "", props.selected.bestSeller ?? "", props.selected.newArrival ?? ""
  ]);
  // Recreate the form only when the applied query changes or Clear is chosen.
  // An ordinary parent render must preserve selections not yet applied.
  return <FilterPanelForm key={`${selectedKey}:${clearCount}`} {...props} onClear={() => setClearCount(count => count + 1)} />;
}

function FilterPanelForm({ brands, sizes, selected, dictionary, locale, onClear }: FilterPanelProps & { onClear: () => void }) {
  const [brand, setBrand] = useState(selected.brand ?? "");
  const [size, setSize] = useState(selected.size ?? "");
  const toggles = locale === "id"
    ? [
        { name: "readyStock", label: "Stok tersedia" },
        { name: "preOrder", label: "Pre-order" },
        { name: "bestSeller", label: "Terlaris" },
        { name: "newArrival", label: "Produk terbaru" }
      ] as const
    : [
        { name: "readyStock", label: "Ready stock" },
        { name: "preOrder", label: "Pre order" },
        { name: "bestSeller", label: "Best seller" },
        { name: "newArrival", label: "New arrival" }
      ] as const;

  return (
    <aside className="border border-ink/10 bg-warm/45 p-4 lg:sticky lg:top-32 lg:max-h-[calc(100dvh-9rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">{dictionary.refine}</h2>
        <Link href={localizedPath(locale, "/shop")} onClick={onClear} className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
          {dictionary.clear}
        </Link>
      </div>

      <form action={localizedPath(locale, "/shop")} className="space-y-5">
        <BrandSearchInput brands={brands} initialQuery={selected.q} placeholder={dictionary.searchPlaceholder}
          label={dictionary.search} locale={locale} onSelectBrand={(slug, form) => {
            flushSync(() => setBrand(slug));
            if (form) {
              const queryInput = form.elements.namedItem("q") as HTMLInputElement;
              queryInput.value = "";
              form.requestSubmit();
            }
          }} onSelectProduct={(name, form) => {
            flushSync(() => setBrand(""));
            if (form) {
              const queryInput = form.elements.namedItem("q") as HTMLInputElement;
              queryInput.value = name;
              form.requestSubmit();
            }
          }} />

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/60">
            {dictionary.brand}
          </span>
          <input type="hidden" name="brand" value={brand} />
          <div className="mt-2">
            <CustomSelect
              value={brand}
              onChange={setBrand}
              placeholder={dictionary.allBrands}
              options={[
                { value: "", label: dictionary.allBrands },
                ...brands.map((item) => ({ value: item.slug, label: item.name }))
              ]}
              searchable
              searchPlaceholder={locale === "id" ? "Cari merek" : "Search brands"}
              ariaLabel={dictionary.brand}
            />
          </div>
        </label>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/60">
            {dictionary.size}
          </span>
          <input type="hidden" name="size" value={size} />
          <div className="mt-2">
            <CustomSelect
              value={size}
              onChange={setSize}
              placeholder={dictionary.anySize}
              options={[
                { value: "", label: dictionary.anySize },
                ...sizes.map((item) => ({ value: item, label: item }))
              ]}
              ariaLabel={dictionary.size}
            />
          </div>
        </label>

        <div className="space-y-3 border-t border-ink/10 pt-4">
          {toggles.map((toggle) => (
            <label key={toggle.name} className="flex items-center gap-3 text-sm text-ink/75">
              <input
                type="checkbox"
                name={toggle.name}
                value="true"
                defaultChecked={selected[toggle.name] === "true"}
                className="border-ink/25 text-gold focus:ring-gold"
              />
              {toggle.label}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="w-full border border-ink bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink"
        >
          {dictionary.applyFilters}
        </button>
      </form>
    </aside>
  );
}
