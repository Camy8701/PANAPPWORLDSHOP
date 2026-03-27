import { Skeleton } from "@/components/ui/skeleton";

const ProductGridSkeleton = () => {
  return (
    <section className="product-grid-section">
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="product-grid-item">
            <Skeleton className="w-full" style={{ aspectRatio: "37/46" }} />
            <div className="mt-2 space-y-1">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGridSkeleton;
