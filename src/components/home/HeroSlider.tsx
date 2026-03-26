import { useState, useEffect, useCallback, useRef } from "react";
import { heroSlides, products } from "@/data/placeholder";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const next = useCallback(() => setCurrent((p) => (p + 1) % heroSlides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    timerRef.current = setInterval(next, 6000);
    return () => clearInterval(timerRef.current);
  }, [next, current]);

  const slide = heroSlides[current];
  const product = products.find((p) => p.id === slide.productId);

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-secondary"
      onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart === null) return;
        const diff = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        setTouchStart(null);
      }}
    >
      {/* Slide images */}
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={`Slide ${i + 1}`}
            className="w-full h-full object-cover object-center"
            style={{ transform: i === current ? "scale(1.02)" : "scale(1)", transition: "transform 6s ease-out" }}
          />
        </div>
      ))}

      {/* Bottom-right product card */}
      {product && (
        <div className="absolute bottom-12 right-0 z-10 hidden md:block">
          <Link to={`/product/${product.slug}`} className="block">
            <div className="bg-background/90 backdrop-blur-sm w-[180px]">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full aspect-[37/46] object-cover object-center"
              />
              <div className="flex items-center justify-center gap-2 py-2 border-t border-border">
                <span className="text-[9px] font-semibold uppercase tracking-fashion">
                  ↔ Buy Now ↔
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Nav arrows */}
      <div className="absolute bottom-6 right-4 z-10 hidden md:flex items-center gap-2">
        <button
          onClick={prev}
          className="w-10 h-10 border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-all bg-black/20 backdrop-blur-sm"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={next}
          className="w-10 h-10 border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-all bg-black/20 backdrop-blur-sm"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Diamond indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3 md:hidden">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rotate-45 border transition-colors ${
              i === current
                ? "bg-white border-white"
                : "bg-transparent border-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
