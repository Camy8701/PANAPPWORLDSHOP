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
      <main className="pt-28 px-6 text-center">
        <p className="text-sm uppercase tracking-fashion text-muted-foreground">Product not found</p>
      </main>
    );
  }

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="pt-28 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Images */}
        <div className="space-y-4">
          {product.images.map((img, i) => (
            <div key={i} className="bg-secondary" style={{ aspectRatio: "37/46" }}>
              <img src={img} alt={product.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6 md:sticky md:top-28 md:self-start">
          <h1 className="font-display text-4xl tracking-wide-fashion">{product.name}</h1>
          <p className="text-sm">${product.price}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Size selector */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-fashion font-semibold">Size</p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-xs uppercase tracking-fashion border transition-colors ${
                    selectedSize === size
                      ? "border-foreground bg-foreground text-background"
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
              if (selectedSize && product.in_stock) onAddToCart(product, selectedSize);
            }}
            disabled={!product.in_stock}
            className={`w-full py-3 text-xs font-semibold uppercase tracking-fashion transition-colors ${
              product.in_stock
                ? "bg-foreground text-background hover:bg-accent hover:text-accent-foreground"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {product.in_stock ? (selectedSize ? "Add to Cart" : "Select a Size") : "Sold Out"}
          </button>
        </div>
      </div>

      <ProductGrid products={related} title="YOU MAY ALSO LIKE" />
    </main>
  );
};

export default ProductDetail;
