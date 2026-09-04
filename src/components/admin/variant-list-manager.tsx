"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CatalogActionControls } from "@/components/admin/catalog-action-controls";
import { productSizeKey } from "@/lib/catalog-management";
import { uniqueSortedProductSizes } from "@/lib/product-sizes";

export type VariantListItem = { id: string; productId: string; name: string; brandName: string; size: string; stock: number; status: string };
export function VariantListManager({ initialVariants }: { initialVariants: VariantListItem[] }) {
  const [variants, setVariants] = useState(initialVariants);
  const [query, setQuery] = useState("");
  const [size, setSize] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const allRef = useRef<HTMLInputElement>(null);
  const sizes = useMemo(() => [...new Map(uniqueSortedProductSizes(variants.map(v => v.size))
    .map(label => [productSizeKey(label), label])).entries()], [variants]);
  const filtered = variants.filter(v => (!size || productSizeKey(v.size) === size) &&
    `${v.name} ${v.brandName}`.toLowerCase().includes(query.trim().toLowerCase()));
  const allSelected = filtered.length > 0 && filtered.every(v => selected.has(v.id));
  useEffect(() => { if (allRef.current) allRef.current.indeterminate = !allSelected && filtered.some(v => selected.has(v.id)); }, [filtered, selected, allSelected]);
  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 space-y-3 border bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <label>Search
            <input type="search" aria-label="Search sizes by product or brand" value={query} disabled={busy}
              placeholder="Product or brand name" className="mt-2 w-full border-stone/30 text-sm"
              onChange={e => { setQuery(e.target.value); setSelected(new Set()); }} />
          </label>
          <label>Ukuran
            <select aria-label="Ukuran produk" value={size} disabled={busy} className="mt-2 w-full border-stone/30 text-sm"
              onChange={e => { setSize(e.target.value); setSelected(new Set()); }}>
              <option value="">Semua ukuran</option>
              {sizes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p>{filtered.length} ukuran ditemukan · {selected.size} dipilih</p>
          <button type="button" disabled={busy || !selected.size} onClick={() => setSelected(new Set())} className="underline disabled:opacity-40">Clear Selection</button>
        </div>
        <CatalogActionControls kind="variants" disabled={busy} onBusyChange={setBusy}
          targets={variants.filter(v => selected.has(v.id)).map(v => ({ id: v.id, name: `${v.brandName} — ${v.name} — ${v.size}` }))}
          onSuccess={(_, result) => {
            const ids = new Set(result.ids); setVariants(current => current.filter(v => !ids.has(v.id))); setSelected(new Set());
          }} />
      </div>
      <div className="max-h-[calc(100dvh-18rem)] min-h-80 overflow-auto border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-warm"><tr>
            <th className="p-3"><input ref={allRef} type="checkbox" aria-label="Select all matching sizes" disabled={busy || !filtered.length}
              checked={allSelected} onChange={() => setSelected(allSelected ? new Set() : new Set(filtered.map(v => v.id)))} /></th>
            {["Product", "Brand", "Ukuran", "Status", "Stock", "Action"].map(label => <th key={label} className="p-3">{label}</th>)}
          </tr></thead>
          <tbody>{filtered.map(v => <tr key={v.id} className="border-t align-top">
            <td className="p-3"><input type="checkbox" aria-label={`Select ${v.name} ${v.size}`} disabled={busy} checked={selected.has(v.id)}
              onChange={() => setSelected(current => { const next = new Set(current); if (next.has(v.id)) next.delete(v.id); else next.add(v.id); return next; })} /></td>
            <td className="p-3 font-semibold">{v.name}</td><td className="p-3">{v.brandName}</td>
            <td className="p-3">{v.size}</td><td className="p-3">{v.status.replaceAll("_", " ")}</td><td className="p-3">{v.stock}</td>
            <td className="p-3"><Link href={`/admin/products/${v.productId}`} className="underline">Edit</Link></td>
          </tr>)}</tbody>
        </table>
        {!filtered.length && <p className="p-6 text-center">Tidak ada ukuran yang cocok.</p>}
      </div>
    </div>
  );
}
