"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Brand } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

export function BrandSearchInput({ brands, initialQuery, placeholder, label, locale, onSelectBrand }: {
  brands: Brand[]; initialQuery?: string; placeholder: string; label: string; locale: Locale;
  onSelectBrand: (slug: string, form: HTMLFormElement | null) => void;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLUListElement>(null);
  const options = brands.filter(brand => query.trim() && brand.name.toLowerCase().startsWith(query.trim().toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));
  useEffect(() => { setQuery(initialQuery ?? ""); setOpen(false); setActive(-1); }, [initialQuery]);
  useEffect(() => { optionsRef.current?.children[active]?.scrollIntoView?.({ block: "nearest" }); }, [active]);
  function choose(index: number) {
    const brand = options[index];
    if (!brand) return;
    setQuery(""); setOpen(false); setActive(-1);
    onSelectBrand(brand.slug, ref.current?.form ?? null);
  }
  const expanded = open && Boolean(query.trim());
  return <div className="relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/60">{label}</label>
    <input ref={ref} id={id} type="search" role="combobox" aria-autocomplete="list" autoComplete="off" name="q"
      aria-expanded={expanded} aria-controls={expanded ? `${id}-options` : undefined}
      aria-activedescendant={expanded && active >= 0 && options[active] ? `${id}-option-${active}` : undefined}
      value={query} placeholder={placeholder} onFocus={() => setOpen(true)}
      onChange={e => { setQuery(e.target.value); setActive(-1); setOpen(true); }}
      onKeyDown={event => {
        if (event.key === "Escape") { event.preventDefault(); setOpen(false); setActive(-1); }
        else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault(); setOpen(true);
          if (options.length) setActive(current => event.key === "ArrowDown" ? (current + 1) % options.length : (current <= 0 ? options.length : current) - 1);
        } else if (event.key === "Enter" && expanded && active >= 0) { event.preventDefault(); choose(active); }
      }} className="mt-2 w-full border-ink/15 bg-paper text-sm focus:border-gold focus:ring-gold" />
    {expanded && <div className="absolute inset-x-0 top-full z-30 border border-ink/20 bg-paper shadow-lg">
      <ul ref={optionsRef} id={`${id}-options`} role="listbox" aria-label={locale === "id" ? "Saran merek" : "Brand suggestions"}
        className="max-h-56 overflow-y-auto overscroll-contain">
        {options.map((brand, index) => <li key={brand.id} id={`${id}-option-${index}`} role="option" aria-selected={active === index}
          onMouseDown={e => e.preventDefault()} onClick={() => choose(index)}
          className={`cursor-pointer px-3 py-3 text-sm hover:bg-warm ${active === index ? "bg-warm font-semibold" : ""}`}>
          {brand.name}
        </li>)}
      </ul>
      {!options.length && <p role="status" className="p-3 text-sm text-ink/60">{locale === "id" ? "Merek tidak ditemukan. Tekan Enter untuk mencari parfum." : "No matching brands. Press Enter to search perfumes."}</p>}
    </div>}
  </div>;
}
