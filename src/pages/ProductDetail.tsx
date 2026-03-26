import { useParams } from "react-router-dom";
import { useState } from "react";
import { products } from "@/data/placeholder";
import ProductGrid from "@/components/home/ProductGrid";

interface ProductDetailProps {
  onAddToCart: (product: typeof products[0], size: string) => void;
}

const ProductDetail = ({ onAddToCart }: ProductDetailProps) => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (!product) {
    return (
      <main className="pt-24 px-6 text-center">
        <p className="text-[11px] uppercase tracking-fashion text-muted-foreground">
          Product not found
        </p>
      </main>
    );
  }

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main className="pt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-6xl mx-auto px-6 mb-16">
        {/* Images */}
        <div className="space-y-1">
          {product.images.map((img, i) => (
            <div key={i} className="bg-secondary" style={{ aspectRatio: "37/46" }}>
              <img
                src={img}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5 p-6 md:p-10 md:sticky md:top-24 md:self-start">
          <h1 className="text-[13px] font-bold uppercase tracking-fashion">
            {product.name}
          </h1>
          <p className="text-[12px]">${product.price.toFixed(2)}</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Size selector */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-fashion font-semibold">
              Size
            </p>
            <div className="flex gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-fashion border transition-all ${
                    selectedSize === size
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={() => {
              if (selectedSize && product.in_stock)
                onAddToCart(product, selectedSize);
            }}
            disabled={!product.in_stock}
            className={`w-full py-3 text-[10px] font-semibold uppercase tracking-fashion transition-all ${
              product.in_stock
                ? "bg-foreground text-primary-foreground hover:opacity-80"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {product.in_stock
              ? selectedSize
                ? "Add to Cart"
                : "Select a Size"
              : "Sold Out"}
          </button>
        </div>
      </div>

      {/* Related */}
      <ProductGrid products={related} />
    </main>
  );
};

export default ProductDetail;
