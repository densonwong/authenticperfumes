"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/storefront/product-card";
import { catalogQueryKey, catalogQueryParams } from "@/lib/catalog-pagination";
import type { CatalogCardProduct, CatalogPage, CatalogQuery } from "@/lib/catalog-pagination";
import type { Dictionary, Locale } from "@/lib/i18n";

type InfiniteProductGridProps = {
  initialPage: CatalogPage;
  query: CatalogQuery;
  dictionary: Pick<Dictionary, "status" | "product">;
  locale: Locale;
  gridClassName?: string;
};

class CatalogChangedError extends Error {}
type PageError = "retry" | "stale" | null;

function uniqueProducts(products: CatalogCardProduct[]) {
  const ids = new Set<string>();
  return products.filter((product) => {
    if (ids.has(product.id)) return false;
    ids.add(product.id);
    return true;
  });
}

// A real filter/collection change creates a fresh list. Scroll position and a
// new object containing the same query never discard already loaded cards.
export function InfiniteProductGrid(props: InfiniteProductGridProps) {
  return <ProductPages key={catalogQueryKey(props.query)} {...props} />;
}

function ProductPages({ initialPage, query, dictionary, locale, gridClassName }: InfiniteProductGridProps) {
  const [products, setProducts] = useState(() => uniqueProducts(initialPage.products));
  const [nextCursor, setNextCursor] = useState(initialPage.nextCursor);
  const [total, setTotal] = useState(initialPage.total);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PageError>(null);
  const [observerAvailable, setObserverAvailable] = useState(true);
  const sentinel = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const currentCursor = useRef(initialPage.nextCursor);
  const failed = useRef<PageError>(null);
  const mounted = useRef(true);
  const queryKey = catalogQueryKey(query);
  const isIndonesian = locale === "id";

  useEffect(() => {
    mounted.current = true;
    setObserverAvailable(typeof IntersectionObserver !== "undefined");
    return () => {
      mounted.current = false;
      request.current?.abort();
      request.current = null;
    };
  }, []);

  const loadMore = useCallback(async (retry = false) => {
    if (!mounted.current || !nextCursor || currentCursor.current !== nextCursor || request.current ||
        (failed.current && (!retry || failed.current === "stale"))) return;
    const controller = new AbortController();
    request.current = controller;
    failed.current = null;
    setLoading(true);
    setError(null);
    try {
      const params = catalogQueryParams(query);
      params.set("cursor", nextCursor);
      const response = await fetch(`/api/catalog-page?${params.toString()}`, {
        signal: controller.signal
      });
      if (!response.ok) {
        if (response.status === 409) {
          const body = await response.json().catch(() => null);
          if (body?.error?.code === "CATALOG_CURSOR_STALE") throw new CatalogChangedError();
        }
        throw new Error("Unable to load products");
      }
      const page: CatalogPage = await response.json();
      if (!Array.isArray(page.products) || !Number.isFinite(page.total) ||
        !(page.nextCursor === null || typeof page.nextCursor === "string") ||
        page.nextCursor === nextCursor) throw new Error("Invalid product page");
      if (controller.signal.aborted || request.current !== controller) return;
      setProducts((current) => uniqueProducts([...current, ...page.products]));
      setTotal(page.total);
      currentCursor.current = page.nextCursor;
      setNextCursor(page.nextCursor);
    } catch (cause) {
      if (!controller.signal.aborted && request.current === controller) {
        const failure = cause instanceof CatalogChangedError ? "stale" : "retry";
        failed.current = failure;
        setError(failure);
      }
    } finally {
      if (!controller.signal.aborted && request.current === controller) {
        request.current = null;
        setLoading(false);
      }
    }
    // The canonical key represents every query value, without re-observing on
    // ordinary parent renders that allocate a new query object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, nextCursor]);

  useEffect(() => {
    if (!nextCursor || loading || error || !sentinel.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadMore();
    }, { rootMargin: "600px 0px" });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [loadMore, nextCursor, loading, error]);

  return <>
    <div className={gridClassName ?? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"} aria-busy={loading}>
      {products.map((product, index) => <ProductCard key={product.id} product={product}
        priority={index < 4} dictionary={dictionary} locale={locale} />)}
    </div>
    <div ref={sentinel} className="h-px" aria-hidden="true" />
    <div className="py-6 text-center text-sm text-ink/60">
      <p role="status" aria-live="polite" aria-atomic="true">
        {loading ? (isIndonesian ? "Memuat produk berikutnya…" : "Loading more products…") :
          (isIndonesian ? `Menampilkan ${products.length} dari ${total} produk.` : `Showing ${products.length} of ${total} products.`)}
      </p>
      {error && <div>
        <p role="alert" className="mt-2">{error === "stale"
          ? (isIndonesian ? "Katalog telah diperbarui. Produk yang sudah tampil tetap tersedia. Muat ulang untuk melihat katalog terbaru." : "The catalog has changed. Products already shown remain available. Reload to see the latest catalog.")
          : (isIndonesian ? "Produk berikutnya belum dapat dimuat. Produk sebelumnya tetap tersedia." : "More products could not be loaded. Previous products are still available.")}</p>
        {error === "stale" ? <a href={window.location.href}
          className="mt-3 inline-block border border-ink/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink focus:outline-none focus:ring-2 focus:ring-gold/60">
          {isIndonesian ? "Muat ulang katalog" : "Reload catalog"}
        </a> : <button type="button" onClick={() => void loadMore(true)}
          className="mt-3 border border-ink/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink focus:outline-none focus:ring-2 focus:ring-gold/60">
          {isIndonesian ? "Coba lagi" : "Try again"}
        </button>}
      </div>}
      {nextCursor && !error && !observerAvailable && <button type="button" disabled={loading}
        onClick={() => void loadMore()} className="mt-3 border border-ink/25 px-4 py-2 text-ink disabled:opacity-50">
        {isIndonesian ? "Muat produk berikutnya" : "Load more products"}
      </button>}
    </div>
  </>;
}
