import { useState } from "react";
import ProductGrid from "@/components/home/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";

const Collection = () => {
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const { data: products = [] } = useProducts();
  const { data: collections = [] } = useCollections();

  const filtered = activeCollection
    ? products.filter((p) => p.collection_id === activeCollection)
    : products;

  return (
    <main style={{ paddingTop: "16.4rem" }}>
      {/* Filter tabs */}
      <div className="flex items-center justify-center gap-3 px-6 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCollection(null)}
          className={`text-[10px] font-semibold uppercase tracking-fashion transition-opacity ${
            !activeCollection ? "opacity-100" : "opacity-40 hover:opacity-70"
          }`}
          style={{ transition: "color 0.2s ease, opacity 0.2s ease" }}
        >
          All
        </button>
        {collections.filter(c => c.slug !== 'all').map((col) => (
          <span key={col.id} className="flex items-center gap-3">
            <span className="text-[6px] opacity-30">&#9670;</span>
            <button
              onClick={() => setActiveCollection(col.id)}
              className={`text-[10px] font-semibold uppercase tracking-fashion transition-opacity ${
                activeCollection === col.id ? "opacity-100" : "opacity-40 hover:opacity-70"
              }`}
              style={{ transition: "color 0.2s ease, opacity 0.2s ease" }}
            >
              {col.name}
            </button>
          </span>
        ))}
      </div>

      <ProductGrid products={filtered} />
    </main>
  );
};

export default Collection;
