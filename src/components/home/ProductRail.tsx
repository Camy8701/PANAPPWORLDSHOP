import { Link } from "react-router-dom";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductRailProps {
  eyebrow?: string;
  title: string;
  viewAllHref?: string;
  products: Product[];
  layout?: "grid" | "scroller";
}

const ProductRail = ({
  eyebrow,
  title,
  viewAllHref = "/shop",
  products,
  layout = "grid",
}: ProductRailProps) => {
  if (!products.length) return null;

  return (
    <section className="px-4 lg:px-6 py-16 lg:py-24">
      <div className="flex items-end justify-between mb-8 lg:mb-12">
        <div>
          {eyebrow && (
            <p
              className="text-[10px] uppercase tracking-fashion mb-2"
              style={{ color: "#990000" }}
            >
              {eyebrow}
            </p>
          )}
          <h2
            className="uppercase tracking-fashion"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              lineHeight: 1,
            }}
          >
            {title}
          </h2>
        </div>
        <Link
          to={viewAllHref}
          className="text-[10px] font-semibold uppercase tracking-fashion underline underline-offset-4 hover:no-underline"
        >
          View all
        </Link>
      </div>

      {layout === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10 lg:gap-x-4 lg:gap-y-14">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 lg:gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((p) => (
            <div
              key={p.id}
              className="snap-start shrink-0 w-[60vw] sm:w-[40vw] md:w-[28vw] lg:w-[22vw]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductRail;
