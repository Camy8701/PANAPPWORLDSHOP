import { useParams } from "react-router-dom";
import { formatPrice } from "@/lib/formatPrice";
import { useState, useEffect, useRef, useCallback } from "react";
import { useProducts, useProduct } from "@/hooks/useProducts";
import { Product } from "@/types";
import ProductGrid from "@/components/home/ProductGrid";

interface ProductDetailProps {
  onAddToCart: (product: Product, size: string) => void;
}

/* Accordion item */
const AccordionItem = ({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);

  useEffect(() => {
    if (open) {
      setHeight(contentRef.current?.scrollHeight || 0);
    } else {
      setHeight(0);
    }
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left uppercase tracking-fashion"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}
      >
        <span>{label}</span>
        <span style={{ marginTop: "-0.2rem", fontSize: "14px" }}>{open ? "\u2212" : "+"}</span>
      </button>
      <div
        style={{
          height: height !== undefined ? height : "auto",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "height 1s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s",
        }}
      >
        <div ref={contentRef} className="pt-4 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

/* Squared-line decorator */
const SquaredLine = () => (
  <span className="inline-flex items-center gap-0">
    <span style={{ width: "3px", height: "3px", border: "1px solid currentColor", display: "inline-block" }} />
    <span style={{ width: "1rem", height: "1px", background: "currentColor", display: "inline-block" }} />
    <span style={{ width: "3px", height: "3px", border: "1px solid currentColor", display: "inline-block" }} />
  </span>
);

/**
 * Custom wheel-driven image scroller.
 * Mimics the original: intercepts wheel on the page, applies translate3d
 * to image cards, toggles visibility. Left/right columns stay fixed.
 */
function useImageScroller(imageCount: number) {
  const scrollY = useRef(0);
  const targetY = useRef(0);
  const rafId = useRef<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerHeight = useRef(0);
  const maxScroll = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setContainerHeight = useCallback((h: number) => {
    containerHeight.current = h;
    maxScroll.current = containerHeight.current * (imageCount - 1);
  }, [imageCount]);

  // Smooth animation loop
  const animate = useCallback(() => {
    const diff = targetY.current - scrollY.current;
    // Ease toward target
    scrollY.current += diff * 0.12;

    // Snap if close enough
    if (Math.abs(diff) < 0.5) {
      scrollY.current = targetY.current;
    }

    const h = containerHeight.current;
    if (h === 0) {
      rafId.current = requestAnimationFrame(animate);
      return;
    }

    // Apply transforms to each card
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardTop = i * h;
      const offset = cardTop - scrollY.current;

      // Visible if within one viewport above or below current scroll
      if (offset > -h && offset < h) {
        card.style.visibility = "visible";
        card.style.transform = `translate3d(0px, ${-scrollY.current}px, 0px)`;
      } else {
        card.style.visibility = "hidden";
        if (offset <= -h) {
          card.style.transform = `translate3d(0px, ${-cardTop}px, 0px)`;
        }
      }
    });

    // Update current index for thumbnail highlight
    const idx = Math.round(scrollY.current / h);
    setCurrentIndex(Math.max(0, Math.min(idx, imageCount - 1)));

    rafId.current = requestAnimationFrame(animate);
  }, [imageCount]);

  useEffect(() => {
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [animate]);

  // Wheel handler — prevent page scroll only when hovering center column
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    targetY.current = Math.max(0, Math.min(maxScroll.current, targetY.current + delta));
  }, []);

  // Scroll to specific image index
  const scrollToIndex = useCallback((idx: number) => {
    targetY.current = idx * containerHeight.current;
  }, []);

  // Reset on mount
  const reset = useCallback(() => {
    scrollY.current = 0;
    targetY.current = 0;
    setCurrentIndex(0);
  }, []);

  return { currentIndex, cardRefs, onWheel, scrollToIndex, setContainerHeight, reset };
}

const ProductDetail = ({ onAddToCart }: ProductDetailProps) => {
  const { slug } = useParams();
  const { data: product, isLoading: productLoading } = useProduct(slug);
  const { data: allProducts = [] } = useProducts();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [loaded, setLoaded] = useState(false);
  const centerRef = useRef<HTMLDivElement>(null);

  const imageCount = product?.images.length || 0;
  const scroller = useImageScroller(imageCount);

  // Reset and measure on product change
  useEffect(() => {
    scroller.reset();
    setLoaded(false);
    setSelectedSize("");
    requestAnimationFrame(() => {
      if (centerRef.current) {
        scroller.setContainerHeight(centerRef.current.clientHeight);
      }
      setLoaded(true);
    });
  }, [slug]);

  // Resize handler
  useEffect(() => {
    const onResize = () => {
      if (centerRef.current) {
        scroller.setContainerHeight(centerRef.current.clientHeight);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scroller]);

  // Attach wheel listener to center column only (not whole page)
  useEffect(() => {
    const el = centerRef.current;
    if (!el) return;
    const handler = scroller.onWheel;
    const mq = window.matchMedia("(min-width: 1024px)");
    const attach = () => {
      if (mq.matches) {
        el.addEventListener("wheel", handler, { passive: false });
      } else {
        el.removeEventListener("wheel", handler);
      }
    };
    attach();
    mq.addEventListener("change", attach);
    return () => {
      el.removeEventListener("wheel", handler);
      mq.removeEventListener("change", attach);
    };
  }, [scroller.onWheel]);

  if (productLoading) {
    return <main className="pt-24 px-6 text-center" />;
  }

  if (!product) {
    return (
      <main className="pt-24 px-6 text-center">
        <p className="text-[11px] uppercase tracking-fashion text-muted-foreground">
          Product not found
        </p>
      </main>
    );
  }

  const allImages = product.images;
  const sizes = product.sizes?.length > 0 ? product.sizes : ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main
      style={{
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.5s cubic-bezier(0.39, 0.575, 0.565, 1)",
      }}
    >
      {/* === 3-COLUMN PRODUCT LAYOUT === */}
      <div className="product-layout">
        {/* LEFT COLUMN — Accordion Details */}
        <div className="product-layout__left">
          <div className="product-layout__left-inner">
            <div className="flex flex-col" style={{ rowGap: "1.8rem", maxWidth: "22rem" }}>
              <AccordionItem label="Description" defaultOpen={true}>
                <p style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.6, textTransform: "none" }}>
                  {product.description}
                </p>
              </AccordionItem>

              <AccordionItem label="Fit">
                <p style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.6, textTransform: "none" }}>
                  Relaxed, oversized fit. Model wears size M and is 6'1" / 185cm.
                </p>
              </AccordionItem>

              <AccordionItem label="Materials">
                <p style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.6, textTransform: "none" }}>
                  100% premium cotton. Custom jacquard artwork woven into the chest and sleeves.
                </p>
              </AccordionItem>

              <AccordionItem label="Shipping">
                <p style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.6, textTransform: "none" }}>
                  Free worldwide shipping on all orders. Delivery within 5-10 business days.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN — JS-driven transform image scroller */}
        <div className="product-layout__center" ref={centerRef}>
          <div
            className="product-image__wrapper"
            style={{
              position: "relative",
              height: `${allImages.length * 100}%`,
              touchAction: "pan-x",
              userSelect: "none",
            }}
          >
            {allImages.map((img, i) => (
              <div
                key={i}
                ref={(el) => { scroller.cardRefs.current[i] = el; }}
                className="product-image-card"
                style={{
                  position: "relative",
                  width: "100%",
                  height: `${100 / allImages.length}%`,
                  display: "flex",
                  alignItems: "center",
                  visibility: i === 0 ? "visible" : "hidden",
                }}
              >
                <div className="w-full h-full">
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover object-center"
                    style={{ display: "block" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Thumbnail strip — sticky at bottom */}
          {allImages.length > 1 && (
            <div className="product-scrollviewer">
              <div className="flex gap-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => scroller.scrollToIndex(i)}
                    className="relative overflow-hidden"
                    style={{
                      width: "3.5rem",
                      height: "4.5rem",
                      opacity: scroller.currentIndex === i ? 1 : 0.5,
                      border: scroller.currentIndex === i ? "1px solid #000" : "1px solid transparent",
                      transition: "opacity 0.2s, border-color 0.2s",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${i + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Purchase Details */}
        <div className="product-layout__right">
          <div className="product-layout__right-inner">
            <div className="product-info-box">
              <h1 className="text-[12px] font-bold uppercase tracking-fashion text-center">
                {product.name}
              </h1>
              <p className="text-[12px] mt-3 text-center">
                {formatPrice(product.price)}
              </p>

              {/* Size selector */}
              <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="relative text-[11px] uppercase tracking-fashion transition-colors"
                    style={{
                      color: selectedSize === size ? "#000" : "#888",
                      fontWeight: selectedSize === size ? 600 : 400,
                    }}
                  >
                    <span>{size}</span>
                    {selectedSize === size && (
                      <span className="absolute -bottom-1 left-0 right-0 flex justify-center">
                        <SquaredLine />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Add to Cart / Notify button */}
              <div className="mt-8">
                <button
                  onClick={() => {
                    if (selectedSize && product.in_stock)
                      onAddToCart(product, selectedSize);
                  }}
                  disabled={!product.in_stock}
                  className="w-full py-3.5 text-[10px] font-semibold uppercase tracking-fashion flex items-center justify-center gap-3 transition-all"
                  style={{
                    background: "linear-gradient(90deg, #222, #0d0c0c 50%, #222)",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#900"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(90deg, #222, #0d0c0c 50%, #222)"; }}
                >
                  <SquaredLine />
                  <span>
                    {product.in_stock
                      ? selectedSize
                        ? "Add to Cart"
                        : "Select a Size"
                      : "Notify Me When Available"}
                  </span>
                  <SquaredLine />
                </button>
              </div>
            </div>

            {/* Feature text / quotes at bottom */}
            <div className="feature-text-area">
              <div className="flex justify-center mb-4">
                <SquaredLine />
              </div>
              <p
                className="text-[11px] italic leading-relaxed"
                style={{ color: "#a5a5a5", textTransform: "none" }}
              >
                Do not conform to the pattern of this world, but be transformed
                by the renewing of your mind.
              </p>
              <p
                className="text-[11px] italic leading-relaxed text-right mt-3"
                style={{ color: "#a5a5a5", textTransform: "none" }}
              >
                And after my skin has been destroyed, yet in my flesh I will see
                God.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related products — only visible on mobile or when scrolling past images */}
      <div className="mt-16 hidden lg:hidden">
        <ProductGrid products={related} />
      </div>
    </main>
  );
};

export default ProductDetail;
