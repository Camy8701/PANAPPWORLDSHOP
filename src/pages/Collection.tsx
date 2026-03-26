import { useState } from "react";
import ProductGrid from "@/components/home/ProductGrid";
import { products, collections } from "@/data/placeholder";

const Collection = () => {
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  const filtered = activeCollection
    ? products.filter((p) => p.collection_id === activeCollection)
    : products;

  return (
    <main className="pt-28">
      {/* Filter tabs */}
      <div className="flex items-center justify-center gap-4 px-6 mb-8">
        <button
          onClick={() => setActiveCollection(null)}
          className={`text-xs font-semibold uppercase tracking-fashion transition-colors ${
            !activeCollection ? "text-accent" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {collections.map((col) => (
          <span key={col.id} className="flex items-center gap-4">
            <span className="text-muted-foreground text-[8px]">◆</span>
            <button
              onClick={() => setActiveCollection(col.id)}
              className={`text-xs font-semibold uppercase tracking-fashion transition-colors ${
                activeCollection === col.id ? "text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
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
