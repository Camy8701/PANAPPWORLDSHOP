import { useEffect, useRef, useState } from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setVisible((prev) => new Set(prev).add(idx));
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = gridRef.current?.querySelectorAll("[data-index]");
    items?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [products]);

  return (
    <section className="px-0">
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        style={{ gap: "1px" }}
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            data-index={i}
            className={`transition-all duration-700 ${
              visible.has(i)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
