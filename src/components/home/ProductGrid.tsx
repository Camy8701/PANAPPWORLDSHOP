import { useEffect, useRef, useState } from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  title?: string;
}

const ProductGrid = ({ products, title }: ProductGridProps) => {
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
    <section className="px-6 py-20 max-w-6xl mx-auto">
      {title && (
        <h2 className="font-display text-4xl tracking-wide-fashion text-center mb-12">{title}</h2>
      )}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <div
            key={product.id}
            data-index={i}
            className={`transition-all duration-700 ${
              visible.has(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
