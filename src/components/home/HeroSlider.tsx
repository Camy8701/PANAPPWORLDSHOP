import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides, products } from "@/data/placeholder";
import { Link } from "react-router-dom";

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % heroSlides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];
  const product = products.find((p) => p.id === slide.productId);

  // Gradient backgrounds for placeholder hero slides
  const gradients = [
    "linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 15%))",
    "linear-gradient(135deg, hsl(0 100% 10%), hsl(0 0% 5%))",
    "linear-gradient(135deg, hsl(0 0% 5%), hsl(0 0% 20%))",
    "linear-gradient(135deg, hsl(220 10% 10%), hsl(0 0% 5%))",
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{ background: gradients[current] }}
      />

      {/* Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        <h1 className="font-display text-7xl md:text-9xl tracking-wide-fashion leading-none">
          {slide.title}
        </h1>
        <p className="text-xs tracking-wide-fashion mt-4 text-white/60">{slide.subtitle}</p>
      </div>

      {/* Product thumbnail */}
      {product && (
        <div className="absolute bottom-8 right-8 z-10 bg-white/10 backdrop-blur-sm p-3 hidden md:block">
          <div className="w-24 h-28 bg-white/5 mb-2 flex items-center justify-center">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover opacity-60" />
          </div>
          <Link
            to={`/product/${product.slug}`}
            className="text-[10px] text-white uppercase tracking-fashion hover:text-accent transition-colors"
          >
            Buy Now →
          </Link>
        </div>
      )}

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-colors"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-colors"
      >
        <ChevronRight size={32} />
      </button>

      {/* Diamond indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rotate-45 border border-white/60 transition-colors ${
              i === current ? "bg-white" : "bg-transparent"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
