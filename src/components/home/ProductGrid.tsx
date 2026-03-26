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
    <section className="product-grid-section">
      <div ref={gridRef} className="product-grid">
        {products.map((product, i) => (
          <div
            key={product.id}
            data-index={i}
            className="product-grid-item"
            style={{
              opacity: visible.has(i) ? 1 : 0,
              transform: visible.has(i) ? "translate3d(0, 0, 0)" : "translate3d(0, 80px, 0)",
              transition: `opacity 0.6s cubic-bezier(0.39, 0.575, 0.565, 1), transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)`,
              transitionDelay: `${i * 100}ms`,
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
