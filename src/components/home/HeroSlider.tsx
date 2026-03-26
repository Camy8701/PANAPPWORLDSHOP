import { useState, useEffect, useCallback, useRef } from "react";
import { heroSlides } from "@/data/placeholder";
import { Product } from "@/types";
import { Link } from "react-router-dom";

interface HeroSliderProps {
  products: Product[];
}

const HeroSlider = ({ products }: HeroSliderProps) => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const progressRef = useRef<ReturnType<typeof setInterval>>();

  const SLIDE_DURATION = 6000;

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % heroSlides.length);
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + heroSlides.length) % heroSlides.length);
    setProgress(0);
  }, []);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setProgress(0);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [next, current]);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / SLIDE_DURATION, 1));
    }, 30);
    return () => clearInterval(progressRef.current);
  }, [current]);

  const slide = heroSlides[current];
  const product = products.find((p) => p.id === slide.productId);

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "calc(100svh + var(--extra-height, 8.8rem))", touchAction: "pan-y" }}
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
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.7s cubic-bezier(0.39, 0.575, 0.565, 1)",
            visibility: i === current ? "visible" : "hidden",
          }}
        >
          <img
            src={s.image}
            alt={`Slide ${i + 1}`}
            className="w-full h-full object-cover"
            style={{
              transform: i === current ? "translateY(7%) scale(1.14)" : "translateY(7%) scale(1.08)",
              transition: "transform 6s ease-out",
              objectPosition: "50% 50%",
            }}
          />
        </div>
      ))}

      {/* ===== PRODUCT CARD + CONTROLS — bottom right ===== */}
      {product && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            bottom: "calc(var(--extra-height, 8.8rem) + 1rem)",
            right: "1rem",
          }}
        >
          <div className="pointer-events-auto hidden md:flex flex-col" style={{ width: "19.4rem", gap: "0.5rem" }}>
            {/* Product thumbnail */}
            <Link to={`/product/${product.slug}`} className="block">
              <div style={{ aspectRatio: "194/258" }} className="relative overflow-hidden bg-white/90">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            </Link>

            {/* BUY NOW button */}
            <Link to={`/product/${product.slug}`} className="block">
              <div
                className="w-full flex items-center justify-center gap-3 text-white"
                style={{
                  background: "linear-gradient(90deg, #222, #0d0c0c 50%, #222)",
                  padding: "0.9rem 0",
                }}
              >
                <span className="flex items-center gap-0.5">
                  <span style={{ width: "6px", height: "1px", background: "#fff", display: "inline-block" }} />
                  <span style={{ width: "6px", height: "1px", background: "#fff", display: "inline-block" }} />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-fashion">
                  Buy Now
                </span>
                <span className="flex items-center gap-0.5">
                  <span style={{ width: "6px", height: "1px", background: "#fff", display: "inline-block" }} />
                  <span style={{ width: "6px", height: "1px", background: "#fff", display: "inline-block" }} />
                </span>
              </div>
            </Link>

            {/* PREV / NEXT — two separate buttons side by side */}
            <div className="flex" style={{ gap: "0.5rem" }}>
              <button
                onClick={prev}
                className="flex-1 flex items-center justify-center text-white transition-colors"
                style={{
                  height: "3rem",
                  background: `linear-gradient(90deg, #900 ${progress * 100}%, #222 ${progress * 100}%)`,
                }}
              >
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M14 6H2M6 1L1 6l5 5" />
                </svg>
              </button>
              <button
                onClick={next}
                className="flex-1 flex items-center justify-center text-white transition-colors"
                style={{
                  height: "3rem",
                  background: "linear-gradient(90deg, #222, #0d0c0c 50%, #222)",
                }}
              >
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M2 6h12M10 1l5 5-5 5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile card */}
          <div className="pointer-events-auto md:hidden flex flex-col" style={{ width: "11.7rem", gap: "0.5rem" }}>
            <Link to={`/product/${product.slug}`} className="block">
              <div style={{ aspectRatio: "194/258" }} className="relative overflow-hidden bg-white/90">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            </Link>
            <Link to={`/product/${product.slug}`} className="block">
              <div
                className="w-full flex items-center justify-center text-white"
                style={{
                  background: "linear-gradient(90deg, #222, #0d0c0c 50%, #222)",
                  padding: "0.7rem 0",
                }}
              >
                <span className="text-[9px] font-semibold uppercase tracking-fashion">Buy Now</span>
              </div>
            </Link>
            <div className="flex" style={{ gap: "0.5rem" }}>
              <button
                onClick={prev}
                className="flex-1 flex items-center justify-center text-white"
                style={{
                  height: "2.5rem",
                  background: `linear-gradient(90deg, #900 ${progress * 100}%, #222 ${progress * 100}%)`,
                }}
              >
                <svg width="14" height="10" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M14 6H2M6 1L1 6l5 5" />
                </svg>
              </button>
              <button
                onClick={next}
                className="flex-1 flex items-center justify-center text-white"
                style={{
                  height: "2.5rem",
                  background: "linear-gradient(90deg, #222, #0d0c0c 50%, #222)",
                }}
              >
                <svg width="14" height="10" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M2 6h12M10 1l5 5-5 5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
