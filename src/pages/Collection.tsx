import { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import ProductGrid from "@/components/home/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";
import { formatPrice } from "@/lib/formatPrice";

type SortOption = "recommended" | "newest" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  recommended: "Recommended",
  newest: "Newest arrivals",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

const Collection = () => {
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const { data: products = [] } = useProducts();
  const { data: collections = [] } = useCollections();

  const { availableSizes, priceCeiling } = useMemo(() => {
    const sizeSet = new Set<string>();
    let max = 0;
    products.forEach((p) => {
      p.sizes?.forEach((s) => sizeSet.add(s));
      if (p.price > max) max = p.price;
    });
    return {
      availableSizes: Array.from(sizeSet),
      priceCeiling: Math.ceil(max) || 200,
    };
  }, [products]);

  const result = useMemo(() => {
    let list = activeCollection
      ? products.filter((p) => p.collection_id === activeCollection)
      : [...products];

    if (selectedSizes.length) {
      list = list.filter((p) => p.sizes?.some((s) => selectedSizes.includes(s)));
    }
    if (inStockOnly) list = list.filter((p) => p.in_stock);
    if (maxPrice != null) list = list.filter((p) => p.price <= maxPrice);

    list.sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "recommended":
        default:
          return 0;
      }
    });

    return list;
  }, [products, activeCollection, sort, selectedSizes, inStockOnly, maxPrice]);

  const activeLabel = activeCollection
    ? collections.find((c) => c.id === activeCollection)?.name ?? "All products"
    : "All products";

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const activeFilterCount =
    selectedSizes.length + (inStockOnly ? 1 : 0) + (maxPrice != null ? 1 : 0);

  const clearFilters = () => {
    setSelectedSizes([]);
    setInStockOnly(false);
    setMaxPrice(null);
  };

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <h3 className="text-[10px] uppercase tracking-fashion font-bold mb-3">
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((s) => {
            const active = selectedSizes.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={`min-w-[40px] px-3 py-2 text-[10px] uppercase tracking-fashion border transition-colors ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-foreground"
                }`}
              >
                {s}
              </button>
            );
          })}
          {!availableSizes.length && (
            <p className="text-[10px] text-muted-foreground uppercase">
              No sizes available
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] uppercase tracking-fashion font-bold mb-3">
          Price
        </h3>
        <input
          type="range"
          min={0}
          max={priceCeiling}
          step={5}
          value={maxPrice ?? priceCeiling}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-foreground"
        />
        <div className="flex justify-between text-[10px] uppercase tracking-fashion mt-2">
          <span>{formatPrice(0)}</span>
          <span>
            Up to {formatPrice(maxPrice ?? priceCeiling)}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-[10px] uppercase tracking-fashion font-bold mb-3">
          Availability
        </h3>
        <label className="flex items-center gap-2 cursor-pointer text-[11px] uppercase tracking-fashion">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-foreground"
          />
          In stock only
        </label>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="text-[10px] uppercase tracking-fashion underline underline-offset-4 hover:no-underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <main style={{ paddingTop: "6rem" }}>
      {/* Category tabs */}
      <div className="border-b border-border">
        <div className="flex items-center px-6 gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveCollection(null)}
            className={`py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
              !activeCollection
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All products
            {!activeCollection && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
            )}
          </button>
          {collections
            .filter((c) => c.slug !== "all")
            .map((col) => (
              <button
                key={col.id}
                onClick={() => setActiveCollection(col.id)}
                className={`py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeCollection === col.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {col.name}
                {activeCollection === col.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                )}
              </button>
            ))}
        </div>
      </div>

      {/* Title + count + sort */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{activeLabel}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {result.length} {result.length === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter trigger */}
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-border rounded px-3 py-1.5 text-sm"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="text-[10px] bg-foreground text-background rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <div className="relative flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-muted-foreground">
                Sort by:
              </span>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="text-sm font-medium text-foreground flex items-center gap-1 border border-border rounded px-3 py-1.5 min-w-[160px] justify-between"
              >
                {SORT_LABELS[sort]}
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                >
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </button>

              {sortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setSortOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-40 bg-background border border-border rounded shadow-lg min-w-[180px]">
                    {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSort(key);
                          setSortOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted ${
                          sort === key
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {SORT_LABELS[key]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout: sidebar filters (desktop) + grid */}
      <div className="px-6 pb-16 flex gap-10">
        <aside className="hidden lg:block w-56 shrink-0 sticky top-28 self-start">
          {FilterPanel}
        </aside>

        <div className="flex-1 min-w-0">
          <ProductGrid products={result} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-[70]"
            onClick={() => setFilterOpen(false)}
          />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 max-h-[85vh] bg-background z-[80] rounded-t-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-[12px] font-bold uppercase tracking-fashion">
                Filters
              </h2>
              <button onClick={() => setFilterOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{FilterPanel}</div>
            <div className="p-5 border-t border-border">
              <button
                onClick={() => setFilterOpen(false)}
                className="block w-full py-3 text-center text-[10px] font-semibold uppercase tracking-fashion bg-foreground text-background hover:opacity-80 transition-opacity"
              >
                Show {result.length} {result.length === 1 ? "item" : "items"}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Collection;
