import { Link } from "react-router-dom";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-secondary" style={{ aspectRatio: "37/46" }}>
        {/* Primary image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {/* Hover image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {/* Sold out label */}
        {!product.in_stock && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-fashion text-accent">
            Sold Out
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-xs font-semibold uppercase tracking-fashion">{product.name}</h3>
        <p className="text-xs text-muted-foreground">${product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
