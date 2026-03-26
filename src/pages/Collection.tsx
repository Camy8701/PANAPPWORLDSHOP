import { useState, useMemo } from "react";
import ProductGrid from "@/components/home/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";

type SortOption = "newest" | "oldest" | "price-asc" | "price-desc" | "name-az" | "name-za";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  oldest: "Oldest",
  "price-asc": "Price: Low → High",
  "price-desc": "Price: High → Low",
  "name-az": "A → Z",
  "name-za": "Z → A",
};

const Collection = () => {
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const { data: products = [] } = useProducts();
  const { data: collections = [] } = useCollections();

  const result = useMemo(() => {
    let list = activeCollection
      ? products.filter((p) => p.collection_id === activeCollection)
      : [...products];

    if (inStockOnly) list = list.filter((p) => p.in_stock);

    list.sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-az":
          return a.name.localeCompare(b.name);
        case "name-za":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return list;
  }, [products, activeCollection, sort, inStockOnly]);

  return (
    <main style={{ paddingTop: "16.4rem" }}>
      {/* Collection filter tabs */}
      <div className="flex items-center justify-center gap-3 px-6 mb-4 flex-wrap">
        <button
          onClick={() => setActiveCollection(null)}
          className={`text-[10px] font-semibold uppercase tracking-fashion transition-opacity ${
            !activeCollection ? "opacity-100" : "opacity-40 hover:opacity-70"
          }`}
        >
          All
        </button>
        {collections
          .filter((c) => c.slug !== "all")
          .map((col) => (
            <span key={col.id} className="flex items-center gap-3">
              <span className="text-[6px] opacity-30">&#9670;</span>
              <button
                onClick={() => setActiveCollection(col.id)}
                className={`text-[10px] font-semibold uppercase tracking-fashion transition-opacity ${
                  activeCollection === col.id ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                {col.name}
              </button>
            </span>
          ))}
      </div>

      {/* Sort + Filter bar */}
      <div className="flex items-center justify-between px-6 mb-6">
        {/* In-stock toggle */}
        <button
          onClick={() => setInStockOnly(!inStockOnly)}
          className={`text-[9px] uppercase tracking-fashion transition-opacity ${
            inStockOnly
              ? "opacity-100 border-b border-foreground"
              : "opacity-40 hover:opacity-70"
          }`}
        >
          In Stock Only
        </button>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="text-[9px] uppercase tracking-fashion opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            Sort: {SORT_LABELS[sort]}
            <svg
              width="8"
              height="5"
              viewBox="0 0 8 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
            >
              <path d="M1 1l3 3 3-3" />
            </svg>
          </button>

          {sortOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-40 bg-background border border-border shadow-lg min-w-[160px]">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSort(key);
                      setSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-[9px] uppercase tracking-fashion transition-colors hover:bg-muted ${
                      sort === key ? "opacity-100 font-semibold" : "opacity-60"
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

      {/* Results count */}
      <div className="px-6 mb-4">
        <span className="text-[9px] uppercase tracking-fashion opacity-40">
          {result.length} {result.length === 1 ? "product" : "products"}
        </span>
      </div>

      <ProductGrid products={result} />
    </main>
  );
};

export default Collection;
