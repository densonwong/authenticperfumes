"use client";

import { useEffect, useId, useRef, useState } from "react";
import { mutateCatalog, type CatalogAction, type CatalogMutationResult } from "@/lib/catalog-management";

const labels: Record<CatalogAction, string> = {
  delete_products: "Delete Selected", set_best_seller: "Set Best Seller",
  set_new_product: "Set New Product", delete_variants: "Delete Selected Sizes"
};
type Target = { id: string; name: string };
type Pending = { action: CatalogAction; targets: Target[]; preview: CatalogMutationResult };

function ConfirmationDialog({ pending, busy, onCancel, onConfirm }: {
  pending: Pending; busy: boolean; onCancel: () => void; onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const destructive = pending.action.startsWith("delete");
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    cancelRef.current?.focus();
    return () => dialog?.close();
  }, []);
  return (
    <dialog ref={ref} aria-labelledby={titleId} aria-describedby={descriptionId}
      onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}
      className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto border border-stone/30 bg-white p-6 text-ink shadow-xl backdrop:bg-black/50">
      <h2 id={titleId} className="text-xl font-semibold">{labels[pending.action]}?</h2>
      <p id={descriptionId} className="mt-3 text-sm">
        {pending.targets.length} {pending.action === "delete_variants" ? "ukuran" : "produk"} dipilih.
        {pending.action === "delete_products" ? " Seluruh ukuran produk ini juga akan dihapus." : ""}
        {destructive ? " Data yang dihapus tidak dapat dipulihkan melalui dashboard." : " Penanda produk terpilih akan diaktifkan."}
      </p>
      <ul className="my-4 max-h-40 list-disc overflow-y-auto border-y border-stone/20 py-3 pl-5 text-sm">
        {pending.targets.map(target => <li key={target.id}>{target.name}</li>)}
      </ul>
      {pending.preview.emptyProducts.length > 0 && (
        <div className="mb-4 border border-amber-300 bg-amber-50 p-3 text-sm">
          <p className="font-semibold">Ini adalah ukuran terakhir produk berikut. Yakin ingin menghapusnya?</p>
          <ul className="mt-2 max-h-32 list-disc overflow-y-auto pl-5">
            {pending.preview.emptyProducts.map(product => <li key={product.id}>{product.name}</li>)}
          </ul>
          <p className="mt-2">Produk tetap tersimpan di dashboard, tetapi disembunyikan dari katalog sampai ukuran baru ditambahkan.</p>
        </div>
      )}
      <div className="flex flex-wrap justify-end gap-3">
        <button ref={cancelRef} type="button" disabled={busy} onClick={onCancel} className="border px-4 py-2 disabled:opacity-40">Batal</button>
        <button type="button" disabled={busy} onClick={onConfirm}
          className={`px-4 py-2 text-white disabled:opacity-40 ${destructive ? "bg-red-700" : "bg-ink"}`}>
          {busy ? "Memproses…" : destructive ? "Ya, hapus" : "Ya, terapkan"}
        </button>
      </div>
    </dialog>
  );
}

export function CatalogActionControls({ kind, targets, disabled, onBusyChange, onSuccess }: {
  kind: "products" | "variants"; targets: Target[]; disabled: boolean;
  onBusyChange: (busy: boolean) => void;
  onSuccess: (action: CatalogAction, result: CatalogMutationResult) => void;
}) {
  const [pending, setPending] = useState<Pending | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ error: boolean; text: string } | null>(null);
  const actions: CatalogAction[] = kind === "products"
    ? ["set_best_seller", "set_new_product", "delete_products"] : ["delete_variants"];
  async function begin(action: CatalogAction) {
    if (!targets.length || targets.length > 2000 || busy) return;
    const snapshot = [...targets];
    setBusy(true); onBusyChange(true); setNotice(null);
    try {
      const preview = await mutateCatalog({ action, ids: snapshot.map(t => t.id), preview: true, confirmedEmptyProducts: [] });
      setPending({ action, targets: snapshot, preview });
    } catch (error) {
      setNotice({ error: true, text: error instanceof Error ? error.message : "Unable to load selection." });
      onBusyChange(false);
    } finally { setBusy(false); }
  }
  async function confirm() {
    if (!pending || busy) return;
    setBusy(true);
    try {
      const result = await mutateCatalog({ action: pending.action, ids: pending.targets.map(t => t.id),
        preview: false, confirmedEmptyProducts: pending.preview.emptyProducts.map(p => p.id) });
      onSuccess(pending.action, result);
      setNotice({ error: false, text: `${result.updatedCount} ${kind === "products" ? "produk" : "ukuran"} berhasil diproses.` });
    } catch (error) {
      setNotice({ error: true, text: error instanceof Error ? error.message : "Unable to update selection." });
    } finally { setBusy(false); setPending(null); onBusyChange(false); }
  }
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {actions.map(action => <button key={action} type="button"
          disabled={disabled || busy || !targets.length || targets.length > 2000} onClick={() => begin(action)}
          className={`min-h-10 border px-3 text-xs font-semibold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40 ${action.startsWith("delete") ? "border-red-700 text-red-700 hover:bg-red-50" : "border-ink hover:bg-warm"}`}>
          {labels[action]}
        </button>)}
      </div>
      {targets.length > 2000 && <p role="alert" className="text-sm text-red-700">Pilih maksimal 2.000 item per tindakan.</p>}
      {busy && !pending && <p role="status" className="text-sm">Memeriksa pilihan…</p>}
      {notice && <p role={notice.error ? "alert" : "status"} className={`text-sm ${notice.error ? "text-red-700" : "text-green-800"}`}>{notice.text}</p>}
      {pending && <ConfirmationDialog pending={pending} busy={busy} onConfirm={confirm}
        onCancel={() => { setPending(null); onBusyChange(false); }} />}
    </div>
  );
}
