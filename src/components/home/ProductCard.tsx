import { Link } from "react-router-dom";
import { Product } from "@/types";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/formatPrice";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [touchSwapped, setTouchSwapped] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Detect coarse pointer (touch)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(hover: none)");
    const update = () => setIsTouch(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // On touch: auto-swap to image 2 once card is in view, then back after a beat
  useEffect(() => {
    if (!isTouch || !product.images[1] || !wrapRef.current) return;
    let timeout1: number | undefined;
    let timeout2: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            timeout1 = window.setTimeout(() => setTouchSwapped(true), 600);
            timeout2 = window.setTimeout(() => setTouchSwapped(false), 2200);
            io.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(wrapRef.current);
    return () => {
      io.disconnect();
      if (timeout1) clearTimeout(timeout1);
      if (timeout2) clearTimeout(timeout2);
    };
  }, [isTouch, product.images]);

  const showSecond = isTouch ? touchSwapped : hovered;

  return (
    <div ref={wrapRef} className="group block">
      <Link
        to={`/product/${product.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block"
      >
        <div
          className="relative overflow-hidden bg-secondary"
          style={{ aspectRatio: "37/46" }}
        >
          {/* Primary image */}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 50vw, 33vw"
            className="w-full h-full object-cover object-center transition-opacity duration-500"
            style={{ opacity: showSecond && product.images[1] ? 0 : 1 }}
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
              style={{ opacity: showSecond ? 1 : 0 }}
            />
          )}

          {/* Sold out */}
          {!product.in_stock && (
            <div
              className="absolute top-3 left-3 text-[9px] font-semibold uppercase tracking-fashion"
              style={{ color: "#900" }}
            >
              Sold Out
            </div>
          )}

          {/* Quick-add icon (mobile only) */}
          <Link
            to={`/product/${product.slug}?action=add`}
            aria-label="Quick add"
            className="md:hidden absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-background/85 backdrop-blur-sm rounded-full text-[14px] leading-none active:scale-95 transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            +
          </Link>

          {/* Buy Now overlay on hover (desktop only) */}
          <div
            className="hidden md:flex absolute inset-x-0 bottom-0 items-center justify-center"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(100%)",
              transition:
                "opacity 0.3s cubic-bezier(0.39, 0.575, 0.565, 1), transform 0.3s cubic-bezier(0.39, 0.575, 0.565, 1)",
              background: "linear-gradient(90deg, #222, #0d0c0c 50%, #222)",
              padding: "0.9rem 0",
            }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-fashion text-white">
              Buy Now
            </span>
          </div>
        </div>

        <div className="mt-2 space-y-0.5" style={{ rowGap: "0.64rem" }}>
          <h3 className="text-[11px] font-semibold uppercase tracking-fashion">
            {product.name}
          </h3>
          <p className="text-[11px]" style={{ marginBottom: "-0.2rem" }}>
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>

      {/* Always-visible CTA on mobile */}
      <Link
        to={`/product/${product.slug}`}
        className="md:hidden mt-2 block w-full text-center text-[10px] font-semibold uppercase tracking-fashion py-2.5 border border-foreground/80 text-foreground active:bg-foreground active:text-background transition-colors"
      >
        {product.in_stock ? "Shop Now" : "View"}
      </Link>
    </div>
  );
};

export default ProductCard;
