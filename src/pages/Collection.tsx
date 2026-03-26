import { useState, useMemo } from "react";
import ProductGrid from "@/components/home/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";

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
  const { data: products = [] } = useProducts();
  const { data: collections = [] } = useCollections();

  const result = useMemo(() => {
    let list = activeCollection
      ? products.filter((p) => p.collection_id === activeCollection)
      : [...products];

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
  }, [products, activeCollection, sort]);

  const activeLabel = activeCollection
    ? collections.find((c) => c.id === activeCollection)?.name ?? "All products"
    : "All products";

  return (
    <main style={{ paddingTop: "6rem" }}>
      {/* Category tabs - matching screenshot style */}
      <div className="border-b border-border">
        <div className="flex items-center px-6 gap-8">
          <button
            onClick={() => setActiveCollection(null)}
            className={`py-3 text-sm font-medium transition-colors relative ${
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

          {/* Cart icon spacer - pushes to the right like screenshot */}
          <div className="flex-1" />
        </div>
      </div>

      {/* Title + count + sort */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{activeLabel}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {result.length} {result.length === 1 ? "item" : "items"}
            </p>
          </div>

          {/* Sort dropdown */}
          <div className="relative flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
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
                <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-40 bg-background border border-border rounded shadow-lg min-w-[180px]">
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSort(key);
                        setSortOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted ${
                        sort === key ? "font-semibold text-foreground" : "text-muted-foreground"
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

      <ProductGrid products={result} />
    </main>
  );
};

export default Collection;
