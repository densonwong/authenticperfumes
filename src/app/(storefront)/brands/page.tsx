import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getBrands } from "@/lib/repositories/catalog";

export const metadata: Metadata = {
  title: "Brands",
  description: "Explore Authentic Perfumes brand directory by fragrance house, country, and alphabet."
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function valueOf(searchParams: Awaited<SearchParams>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function BrandsPage({ searchParams }: { searchParams: SearchParams }) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const q = valueOf(await searchParams, "q")?.trim().toLowerCase() ?? "";
  const brands = await getBrands();
  const filteredBrands = brands.filter((brand) =>
    [brand.name, brand.country, brand.description].join(" ").toLowerCase().includes(q)
  );
  const grouped = filteredBrands.reduce<Record<string, typeof filteredBrands>>((groups, brand) => {
    const letter = brand.name[0]?.toUpperCase() ?? "#";
    groups[letter] = [...(groups[letter] ?? []), brand];
    return groups;
  }, {});
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <main className="bg-paper">
      <section className="border-b border-ink/10 px-4 py-8 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              {dictionary.home.brandUniverse}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">
              {locale === "id" ? "Rumah parfum A-Z" : "A-Z fragrance houses"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
              {locale === "id"
                ? "Direktori padat yang siap menampung ratusan brand, dengan logo dan navigasi alfabet yang mudah dipindai."
                : "A dense directory built to scale across hundreds of houses while keeping featured logos and quick alphabet jumps visible."}
            </p>
          </div>
          <form action="/brands" className="flex gap-2">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={locale === "id" ? "Cari brand" : "Search brands"}
              className="min-w-0 flex-1 border-ink/15 bg-paper text-sm focus:border-gold focus:ring-gold"
            />
            <button
              type="submit"
              className="border border-ink bg-ink px-4 text-xs font-semibold uppercase tracking-[0.14em] text-paper"
            >
              {dictionary.common.search}
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <nav className="flex flex-wrap gap-2 border-b border-ink/10 pb-6" aria-label="Alphabet">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#brand-${letter}`}
              className="flex h-8 w-8 items-center justify-center border border-ink/10 bg-warm/50 text-xs font-semibold text-ink transition hover:border-gold hover:text-gold"
            >
              {letter}
            </a>
          ))}
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden border border-ink/10 bg-warm/45 p-4 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
              {locale === "id" ? "Jumlah direktori" : "Directory count"}
            </p>
            <p className="mt-3 font-serif text-4xl text-ink">{filteredBrands.length}</p>
            <p className="mt-3 text-sm leading-6 text-ink/65">
              {locale === "id"
                ? "Baris ringkas menjaga katalog tetap mudah dipindai saat daftar brand melewati 300."
                : "Compact rows keep the list scannable as the catalog grows beyond 300 brands."}
            </p>
          </aside>

          <div className="space-y-10">
            {letters.map((letter) => {
              const group = grouped[letter] ?? [];

              return (
                <section key={letter} id={`brand-${letter}`} className="scroll-mt-36">
                  <div className="mb-3 flex items-center gap-3 border-b border-ink/10 pb-2">
                    <h2 className="font-serif text-2xl text-ink">{letter}</h2>
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
                      {group.length}
                    </span>
                  </div>
                  {group.length > 0 ? (
                    <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 xl:grid-cols-3">
                      {group.map((brand) => (
                        <Link
                          key={brand.id}
                          href={`/brands/${brand.slug}`}
                          className="grid grid-cols-[52px_1fr] gap-3 bg-paper p-3 transition hover:bg-white"
                        >
                          <div className="relative aspect-square overflow-hidden bg-warm">
                            <Image
                              src={brand.logoUrl}
                              alt=""
                              fill
                              sizes="52px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-ink">{brand.name}</h3>
                            <p className="mt-1 truncate text-xs text-ink/55">
                              {brand.country} / {brand.productCount} {dictionary.common.listed}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-ink/45">
                      {dictionary.common.noBrandsUnder} {letter} {dictionary.common.yet}.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
