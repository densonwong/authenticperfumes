"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CustomSelect } from "@/components/admin/custom-select";
import type { Dictionary } from "@/lib/i18n";
import type { Brand, Gender, Product } from "@/lib/types";

type FilterPanelProps = {
  brands: Brand[];
  products: Product[];
  selected: {
    q?: string;
    brand?: string;
    gender?: string;
    note?: string;
    price?: string;
    size?: string;
    readyStock?: string;
    preOrder?: string;
    bestSeller?: string;
    newArrival?: string;
  };
  dictionary: Dictionary["shop"] & Dictionary["common"];
};

const priceBands = [
  { value: "under-1m", label: "Under Rp1m" },
  { value: "1m-3m", label: "Rp1m - Rp3m" },
  { value: "3m-5m", label: "Rp3m - Rp5m" },
  { value: "over-5m", label: "Over Rp5m" }
];

const genders: Array<{ value: Gender; label: string }> = [
  { value: "unisex", label: "Unisex" },
  { value: "women", label: "Women" },
  { value: "men", label: "Men" }
];

const toggles = [
  { name: "readyStock", label: "Ready stock" },
  { name: "preOrder", label: "Pre order" },
  { name: "bestSeller", label: "Best seller" },
  { name: "newArrival", label: "New arrival" }
] as const;

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function FilterPanel({ brands, products, selected, dictionary }: FilterPanelProps) {
  const [brand, setBrand] = useState(selected.brand ?? "");
  const [note, setNote] = useState(selected.note ?? "");
  const [price, setPrice] = useState(selected.price ?? "");
  const [size, setSize] = useState(selected.size ?? "");
  const notes = uniqueSorted(products.flatMap((product) => product.notes));
  const sizes = uniqueSorted(products.flatMap((product) => product.variants.map((variant) => variant.size)));

  useEffect(() => {
    setBrand(selected.brand ?? "");
    setNote(selected.note ?? "");
    setPrice(selected.price ?? "");
    setSize(selected.size ?? "");
  }, [selected.brand, selected.note, selected.price, selected.size]);

  return (
    <aside className="border border-ink/10 bg-warm/45 p-4 lg:sticky lg:top-32 lg:self-start">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">{dictionary.refine}</h2>
        <Link href="/shop" className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
          {dictionary.clear}
        </Link>
      </div>

      <form action="/shop" className="space-y-5">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/60">
            {dictionary.search}
          </span>
          <input
            type="search"
            name="q"
            defaultValue={selected.q}
            placeholder={dictionary.searchPlaceholder}
            className="mt-2 w-full border-ink/15 bg-paper text-sm focus:border-gold focus:ring-gold"
          />
        </label>

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
              searchPlaceholder="Cari brand"
              ariaLabel={dictionary.brand}
            />
          </div>
        </label>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/60">
            {dictionary.gender}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {genders.map((gender) => (
              <label
                key={gender.value}
                className="flex items-center justify-center border border-ink/10 bg-paper px-2 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-ink"
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender.value}
                  defaultChecked={selected.gender === gender.value}
                  className="sr-only"
                />
                {gender.label}
              </label>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/60">
            {dictionary.note}
          </span>
          <input type="hidden" name="note" value={note} />
          <div className="mt-2">
            <CustomSelect
              value={note}
              onChange={setNote}
              placeholder={dictionary.anyNote}
              options={[
                { value: "", label: dictionary.anyNote },
                ...notes.map((item) => ({ value: item, label: item }))
              ]}
              ariaLabel={dictionary.note}
            />
          </div>
        </label>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/60">
            {dictionary.price}
          </span>
          <input type="hidden" name="price" value={price} />
          <div className="mt-2">
            <CustomSelect
              value={price}
              onChange={setPrice}
              placeholder={dictionary.anyPrice}
              options={[
                { value: "", label: dictionary.anyPrice },
                ...priceBands
              ]}
              ariaLabel={dictionary.price}
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
