import { Link } from "react-router-dom";
import { Product } from "@/types";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden bg-secondary"
        style={{ aspectRatio: "37/46" }}
      >
        {/* Primary image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-opacity duration-500"
          style={{ opacity: hovered && product.images[1] ? 0 : 1 }}
        />
        {/* Hover image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
            style={{ opacity: hovered ? 1 : 0 }}
          />
        )}

        {/* Sold out */}
        {!product.in_stock && (
          <div className="absolute top-3 left-3 text-[9px] font-semibold uppercase tracking-fashion text-destructive">
            Sold Out
          </div>
        )}

        {/* Buy Now overlay on hover */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-center justify-center py-3 bg-foreground/80 backdrop-blur-sm transition-all duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(100%)",
          }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-fashion text-primary-foreground">
            Buy Now
          </span>
        </div>
      </div>

      <div className="mt-2 space-y-0.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-fashion">
          {product.name}
        </h3>
        <p className="text-[11px]">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
