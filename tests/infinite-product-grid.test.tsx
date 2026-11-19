import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InfiniteProductGrid } from "../src/components/storefront/infinite-product-grid";
import type { CatalogCardProduct, CatalogPage, CatalogQuery } from "../src/lib/catalog-pagination";
import { getDictionary } from "../src/lib/i18n";
import { seedProducts } from "../src/lib/seed-data";

vi.mock("../src/components/storefront/product-card", () => ({
  ProductCard: ({ product }: { product: CatalogCardProduct }) => <a href={`/products/${product.slug}`}>{product.name}</a>
}));

const dictionary = getDictionary("id");
const query: CatalogQuery = { collection: "shop", readyStock: "true" };
const product = (id: string): CatalogCardProduct => ({ ...seedProducts[0], id, name: `Parfum ${id}`, slug: id });
const page = (ids: string[], nextCursor: string | null, total = 5): CatalogPage => ({ products: ids.map(product), total, nextCursor });
const response = (body: unknown, ok = true, status = ok ? 200 : 503) => ({ ok, status, json: async () => body }) as Response;
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

type Observer = { callback: IntersectionObserverCallback; observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> };
let observers: Observer[];
function intersect(observer = observers[observers.length - 1]) {
  observer.callback([{ isIntersecting: true } as IntersectionObserverEntry], observer as unknown as IntersectionObserver);
}

beforeEach(() => {
  observers = [];
  vi.stubGlobal("IntersectionObserver", class {
    observe = vi.fn();
    disconnect = vi.fn();
    constructor(public callback: IntersectionObserverCallback) { observers.push(this); }
  });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("automatic catalog scrolling", () => {
  it("loads near the bottom once, appends unique cards and retains their DOM when scrolling upward", async () => {
    const pending = deferred<Response>();
    const fetchMock = vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValueOnce(response(page(["d", "e"], null)));
    vi.stubGlobal("fetch", fetchMock);
    const { container, rerender } = render(<InfiniteProductGrid initialPage={page(["a", "b"], "cursor-2")} query={query} dictionary={dictionary} locale="id" gridClassName="original-grid" />);
    const firstCard = screen.getByRole("link", { name: "Parfum a" });
    expect(firstCard.parentElement?.className).toBe("original-grid");
    expect(screen.queryByRole("button")).toBeNull();
    const firstObserver = observers[observers.length - 1];
    act(() => { intersect(firstObserver); intersect(firstObserver); });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("collection=shop");
    expect(fetchMock.mock.calls[0][0]).toContain("readyStock=true");
    expect(fetchMock.mock.calls[0][0]).toContain("cursor=cursor-2");
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
    await act(async () => { pending.resolve(response(page(["b", "c"], "cursor-3"))); });
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Parfum a" })).toBe(firstCard);
    fireEvent.scroll(window, { target: { scrollY: 0 } });
    rerender(<InfiniteProductGrid initialPage={page(["replacement"], "cursor-2")} query={{ readyStock: "true", collection: "shop" }} dictionary={dictionary} locale="id" gridClassName="original-grid" />);
    expect(screen.getByRole("link", { name: "Parfum a" })).toBe(firstCard);
    expect(screen.queryByText("Parfum replacement")).toBeNull();
    await act(async () => { intersect(); });
    expect(screen.getAllByRole("link")).toHaveLength(5);
    expect(screen.getByRole("status").textContent).toContain("5 dari 5");
    act(() => intersect(firstObserver));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("resets only for a changed filter and ignores a late response even when fetch ignores abort", async () => {
    const old = deferred<Response>();
    const next = deferred<Response>();
    const fetchMock = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(next.promise);
    vi.stubGlobal("fetch", fetchMock);
    const { rerender } = render(<InfiniteProductGrid initialPage={page(["a"], "old-cursor")} query={query} dictionary={dictionary} locale="id" />);
    act(() => intersect());
    const signal = fetchMock.mock.calls[0][1].signal as AbortSignal;
    rerender(<InfiniteProductGrid initialPage={page(["new"], "new-cursor")} query={{ ...query, brand: "dior" }} dictionary={dictionary} locale="id" />);
    expect(signal.aborted).toBe(true);
    expect(screen.queryByText("Parfum a")).toBeNull();
    act(() => intersect());
    await act(async () => { old.resolve(response(page(["stale"], null))); });
    expect(screen.queryByText("Parfum stale")).toBeNull();
    await act(async () => { next.resolve(response(page(["latest"], null))); });
    expect(screen.getAllByRole("link").map(link => link.textContent)).toEqual(["Parfum new", "Parfum latest"]);
    expect(fetchMock.mock.calls[1][0]).toContain("brand=dior");
  });

  it("preserves cards on failure and offers an accessible retry without a request loop", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response({ error: { code: "CATALOG_UNAVAILABLE" } }, false))
      .mockResolvedValueOnce(response(page(["b"], null, 2)));
    vi.stubGlobal("fetch", fetchMock);
    render(<InfiniteProductGrid initialPage={page(["a"], "cursor-2", 2)} query={query} dictionary={dictionary} locale="id" />);
    const observer = observers[observers.length - 1];
    await act(async () => { intersect(observer); });
    expect(screen.getByRole("link", { name: "Parfum a" })).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toContain("tetap tersedia");
    act(() => intersect(observer));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Coba lagi" })); });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("does not request a completed list and supports older browsers without an observer", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const fetchMock = vi.fn().mockResolvedValue(response(page(["b"], null, 2)));
    vi.stubGlobal("fetch", fetchMock);
    const { rerender } = render(<InfiniteProductGrid initialPage={page(["a"], null, 1)} query={query} dictionary={dictionary} locale="en" />);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<InfiniteProductGrid initialPage={page(["a"], "cursor", 2)} query={{ collection: "new-arrivals" }} dictionary={dictionary} locale="en" />);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Load more products" })); });
    expect(screen.getByRole("status").textContent).toContain("2 of 2");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it.each([
    { locale: "id" as const, message: "Katalog telah diperbarui", action: "Muat ulang katalog" },
    { locale: "en" as const, message: "The catalog has changed", action: "Reload catalog" }
  ])("keeps loaded products and offers a deliberate reload for a changed catalog ($locale)", async ({ locale, message, action }) => {
    window.history.replaceState({}, "", `/${locale}/shop?brand=dior&size=50ml`);
    const fetchMock = vi.fn().mockResolvedValue(response({ error: { code: "CATALOG_CURSOR_STALE" } }, false, 409));
    vi.stubGlobal("fetch", fetchMock);
    render(<InfiniteProductGrid initialPage={page(["a"], "old-cursor", 2)} query={query} dictionary={dictionary} locale={locale} />);
    const firstCard = screen.getByRole("link", { name: "Parfum a" });
    const observer = observers[observers.length - 1];
    await act(async () => { intersect(observer); });
    expect(screen.getByRole("alert").textContent).toContain(message);
    expect(screen.getByRole("link", { name: "Parfum a" })).toBe(firstCard);
    expect(screen.queryByRole("button")).toBeNull();
    const reload = screen.getByRole("link", { name: action });
    // A native same-document URL navigates afresh, retaining the selected filters.
    expect(reload.getAttribute("href")).toBe(window.location.href);
    expect(reload.getAttribute("href")).toContain(`/${locale}/shop?brand=dior&size=50ml`);
    expect(reload.tagName).toBe("A");
    act(() => { intersect(observer); intersect(observer); });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "Parfum a" })).toBe(firstCard);
  });
});
