import { useParams, useSearchParams } from "react-router-dom";
import { formatPrice } from "@/lib/formatPrice";
import { useState, useEffect, useRef, useMemo } from "react";
import { useProducts, useProduct } from "@/hooks/useProducts";
import { Product } from "@/types";
import ProductGrid from "@/components/home/ProductGrid";
import { malcolmXProduct } from "@/data/placeholder";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Truck, RotateCcw, ShieldCheck, Package, Star } from "lucide-react";

interface ProductDetailProps {
  onAddToCart: (product: Product, size: string) => void;
}

/* ---------- Brand types & helpers ---------- */
type Pillar = "past" | "present" | "future";

const PILLAR_META: Record<Pillar, { label: string; bg: string; fg: string }> = {
  past:    { label: "Know the Past",   bg: "hsl(var(--pa-red))",   fg: "hsl(0 0% 100%)" },
  present: { label: "Live the Present",bg: "hsl(var(--pa-gold))",  fg: "hsl(30 30% 12%)" },
  future:  { label: "Build the Future",bg: "hsl(var(--pa-green))", fg: "hsl(0 0% 100%)" },
};

// Heuristic to assign a pillar from product copy until DB has the field.
function pillarFor(p: Product): Pillar {
  const s = `${p.name} ${p.description}`.toLowerCase();
  if (/(future|build|tomorrow|rise|vision|liberation)/.test(s)) return "future";
  if (/(present|now|today|live|love|unity|culture)/.test(s)) return "present";
  return "past";
}

/* ---------- Sub-components ---------- */

const PillarTag = ({ pillar }: { pillar: Pillar }) => {
  const m = PILLAR_META[pillar];
  return (
    <span
      className="font-display inline-block px-2.5 py-1 text-[11px] uppercase"
      style={{ background: m.bg, color: m.fg, letterSpacing: "0.14em" }}
    >
      {m.label}
    </span>
  );
};

const Stars = ({ rating = 0 }: { rating?: number }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.round(rating) ? "fill-current" : ""}
        style={{ color: i < Math.round(rating) ? "hsl(var(--pa-gold-text))" : "hsl(var(--pa-muted))" }}
      />
    ))}
  </span>
);

const TrustRow = ({ threshold }: { threshold: string }) => (
  <ul className="grid grid-cols-2 gap-3 text-[11px] font-body" style={{ color: "hsl(var(--pa-muted))" }}>
    <li className="flex items-start gap-2"><Package size={14} className="mt-0.5 shrink-0" /><span>Made to order — printed in 3–5 days</span></li>
    <li className="flex items-start gap-2"><Truck size={14} className="mt-0.5 shrink-0" /><span>Free worldwide shipping over {threshold}</span></li>
    <li className="flex items-start gap-2"><RotateCcw size={14} className="mt-0.5 shrink-0" /><span>30-day returns &amp; exchanges</span></li>
    <li className="flex items-start gap-2"><ShieldCheck size={14} className="mt-0.5 shrink-0" /><span>Secure checkout</span></li>
  </ul>
);

const Accordion = ({
  label, defaultOpen = false, children,
}: { label: string; defaultOpen?: boolean; children: React.ReactNode }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t" style={{ borderColor: "hsl(var(--pa-hairline))" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left font-display text-[14px] uppercase"
        aria-expanded={open}
      >
        <span>{label}</span>
        <span className="text-lg leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="pb-5 text-[13px] leading-relaxed font-body" style={{ color: "hsl(var(--pa-muted))" }}>
          {children}
        </div>
      )}
    </div>
  );
};

/* ---------- Gallery ---------- */

const Gallery = ({ images, title }: { images: string[]; title: string }) => {
  const [idx, setIdx] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const safeImages = images.length ? images : ["/placeholder.svg"];

  const go = (next: number) => {
    const n = (next + safeImages.length) % safeImages.length;
    setIdx(n);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: el.clientWidth * n, behavior: "smooth" });
  };

  // Track scroll on mobile snap
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (w) setIdx(Math.round(el.scrollLeft / w));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(idx - 1);
      if (e.key === "ArrowRight") go(idx + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, safeImages.length]);

  return (
    <div className="lg:sticky lg:top-[var(--extra-height)]">
      <div className="flex gap-4">
        {/* Vertical thumbs (desktop) */}
        {safeImages.length > 1 && (
          <div className="hidden lg:flex flex-col gap-2 w-16 shrink-0">
            {safeImages.map((src, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`View image ${i + 1}`}
                className="block overflow-hidden border transition"
                style={{
                  aspectRatio: "3/4",
                  borderColor: i === idx ? "hsl(var(--pa-ink))" : "transparent",
                  opacity: i === idx ? 1 : 0.55,
                }}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Hero / swipeable */}
        <div className="relative flex-1 min-w-0">
          <div
            ref={scrollerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none", aspectRatio: "3/4", background: "hsl(var(--pa-surface))" }}
          >
            {safeImages.map((src, i) => (
              <div key={i} className="w-full shrink-0 snap-center">
                <img
                  src={src}
                  alt={`${title} — view ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* Arrows (desktop) */}
          {safeImages.length > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={() => go(idx - 1)}
                className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center bg-white/80 hover:bg-white"
              ><ChevronLeft size={16} /></button>
              <button
                aria-label="Next image"
                onClick={() => go(idx + 1)}
                className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center bg-white/80 hover:bg-white"
              ><ChevronRight size={16} /></button>
              {/* Mobile dots */}
              <div className="lg:hidden absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {safeImages.map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition"
                    style={{ background: i === idx ? "hsl(var(--pa-ink))" : "hsl(var(--pa-ink) / 0.25)" }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Size guide ---------- */

const SIZE_TABLE = [
  ["Size", "Chest (cm)", "Length (cm)"],
  ["XS", "96", "68"],
  ["S",  "101", "70"],
  ["M",  "106", "72"],
  ["L",  "111", "74"],
  ["XL", "116", "76"],
  ["2XL","121", "78"],
  ["3XL","126", "80"],
];

const SizeGuide = () => (
  <Dialog>
    <DialogTrigger asChild>
      <button className="text-[11px] uppercase font-body underline underline-offset-4" style={{ letterSpacing: "0.1em" }}>
        Size guide
      </button>
    </DialogTrigger>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="font-display text-xl uppercase">Size guide</DialogTitle>
      </DialogHeader>
      <table className="w-full text-[12px] font-body">
        <tbody>
          {SIZE_TABLE.map((row, i) => (
            <tr key={i} className={i === 0 ? "font-semibold" : ""} style={{ borderTop: i ? "1px solid hsl(var(--pa-hairline))" : "none" }}>
              {row.map((c, j) => <td key={j} className="py-2 px-1">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[11px] font-body" style={{ color: "hsl(var(--pa-muted))" }}>
        Measurements are flat-laid garment dimensions. If between sizes, size up for an oversized fit.
      </p>
    </DialogContent>
  </Dialog>
);

/* ---------- Main page ---------- */

const ProductDetail = ({ onAddToCart }: ProductDetailProps) => {
  const { slug } = useParams();
  const { data: dbProduct, isLoading } = useProduct(slug);
  const { data: allProducts = [] } = useProducts();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const inlineCtaRef = useRef<HTMLDivElement>(null);
  const sizeSelectorRef = useRef<HTMLDivElement>(null);
  const [sizePulse, setSizePulse] = useState(false);
  const [searchParams] = useSearchParams();

  const fallbackProduct = slug === malcolmXProduct.slug ? malcolmXProduct : null;
  const product = dbProduct ?? fallbackProduct;

  // honour ?action=add deeplink
  useEffect(() => {
    if (searchParams.get("action") === "add" && sizeSelectorRef.current) {
      setTimeout(() => {
        sizeSelectorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setSizePulse(true);
        setTimeout(() => setSizePulse(false), 1500);
      }, 400);
    }
  }, [searchParams, slug]);

  // sticky bar visibility (mobile)
  useEffect(() => {
    if (!inlineCtaRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => setShowStickyBar(!e.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" }
    );
    io.observe(inlineCtaRef.current);
    return () => io.disconnect();
  }, [product?.id]);

  // reset selection on slug change
  useEffect(() => {
    setSelectedSize("");
    setSelectedTier(1);
  }, [slug]);

  const pillar = useMemo<Pillar>(() => (product ? pillarFor(product) : "past"), [product]);
  const FREE_SHIPPING_THRESHOLD_LABEL = "€100";
  // Bundles are an opt-in merchandising lever. Off by default; flip per-product later via DB flag.
  const bundleEnabled = false;

  if (isLoading) return <main className="pt-40 px-6 text-center" />;
  if (!product) {
    return (
      <main className="pt-40 px-6 text-center">
        <p className="text-[11px] uppercase tracking-fashion text-muted-foreground">Product not found</p>
      </main>
    );
  }

  const sizes = product.sizes?.length ? product.sizes : ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const tryAdd = () => {
    if (!product.in_stock) return;
    if (!selectedSize) {
      sizeSelectorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setSizePulse(true);
      setTimeout(() => setSizePulse(false), 1500);
      return;
    }
    for (let i = 0; i < selectedTier; i++) onAddToCart(product, selectedSize);
  };

  const ctaLabel = !product.in_stock
    ? "Notify me when available"
    : selectedSize
      ? (selectedTier > 1 ? `Add ${selectedTier} to bag` : "Add to bag")
      : "Select a size";

  const bundles: { qty: 1 | 2 | 3; perk: string; best?: boolean }[] = [
    { qty: 1, perk: "" },
    { qty: 2, perk: "Free shipping" },
    { qty: 3, perk: "Free shipping + 15% off", best: true },
  ];

  const tierPrice = (qty: number) =>
    qty === 3 ? product.price * qty * 0.85 : product.price * qty;

  return (
    <main className="font-body" style={{ background: "hsl(var(--pa-surface))", color: "hsl(var(--pa-ink))" }}>
      {/* === TWO-COLUMN PDP === */}
      <section
        className="max-w-[1280px] mx-auto px-4 lg:px-8 pt-40 lg:pt-44 pb-16 lg:pb-24
                   grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-8 lg:gap-16"
      >
        {/* LEFT — Gallery */}
        <Gallery images={product.images} title={product.name} />

        {/* RIGHT — Buy panel */}
        <div className="flex flex-col gap-5 lg:max-w-md">
          <PillarTag pillar={pillar} />

          <h1 className="font-display uppercase leading-[0.9]" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3">
            <p className="text-lg font-medium">{formatPrice(product.price)}</p>
          </div>

          {/* Social proof — graceful empty */}
          <div className="flex items-center gap-3 text-[11px]" style={{ color: "hsl(var(--pa-muted))" }}>
            <Stars rating={0} />
            <span>No reviews yet</span>
          </div>

          {product.description && (
            <p className="text-[14px] leading-relaxed" style={{ color: "hsl(var(--pa-muted))" }}>
              {product.description.split(/\.\s/)[0]}.
            </p>
          )}

          {/* Size selector */}
          <div className="flex flex-col gap-3" ref={sizeSelectorRef}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-display tracking-[0.14em]">Size</span>
              <SizeGuide />
            </div>
            <div className={`flex flex-wrap gap-2 transition ${sizePulse ? "ring-2 ring-offset-4" : ""}`}
                 style={{ ["--tw-ring-color" as never]: "hsl(var(--pa-red))" }}>
              {sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="min-w-[44px] h-11 px-3 text-[12px] uppercase font-body transition"
                    style={{
                      border: `1px solid ${active ? "hsl(var(--pa-ink))" : "hsl(var(--pa-hairline))"}`,
                      background: active ? "hsl(var(--pa-ink))" : "transparent",
                      color: active ? "hsl(var(--pa-bone))" : "hsl(var(--pa-ink))",
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px]" style={{ color: "hsl(var(--pa-muted))" }}>
              Oversized fit — model is 183cm, wearing M.
            </p>
          </div>

          {/* Bundle tiers (opt-in) */}
          {bundleEnabled && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              {bundles.map((b) => {
                const active = selectedTier === b.qty;
                return (
                  <button
                    key={b.qty}
                    onClick={() => setSelectedTier(b.qty)}
                    className="relative text-left p-3 transition"
                    style={{
                      border: `1px solid ${active ? "hsl(var(--pa-ink))" : "hsl(var(--pa-hairline))"}`,
                      background: active ? "hsl(var(--pa-ink) / 0.04)" : "transparent",
                    }}
                  >
                    {b.best && (
                      <span
                        className="absolute -top-2 left-2 text-[9px] px-1.5 py-0.5 font-display uppercase"
                        style={{ background: "hsl(var(--pa-green))", color: "white", letterSpacing: "0.12em" }}
                      >
                        Best value
                      </span>
                    )}
                    <div className="font-display text-[18px] leading-none">Buy {b.qty}</div>
                    <div className="text-[11px] mt-1" style={{ color: "hsl(var(--pa-muted))" }}>{b.perk || "Single piece"}</div>
                    <div className="text-[12px] mt-1 font-medium">{formatPrice(tierPrice(b.qty))}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Primary CTA */}
          <div ref={inlineCtaRef} className="pt-1">
            <button
              onClick={tryAdd}
              disabled={!product.in_stock || !selectedSize}
              aria-disabled={!product.in_stock || !selectedSize}
              className="w-full h-12 font-display text-[14px] uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: "hsl(var(--pa-ink))", color: "hsl(var(--pa-bone))" }}
            >
              {ctaLabel}
            </button>
          </div>

          <TrustRow threshold={FREE_SHIPPING_THRESHOLD_LABEL} />

          {/* Accordions */}
          <div className="pt-2">
            <Accordion label="Description" defaultOpen>
              <p>{product.description || "A heritage piece in the PANAPP collection."}</p>
            </Accordion>
            <Accordion label="Fit">
              <p>Oversized, boxy fit. Model is 183cm and wears M. Size down for a closer fit.</p>
            </Accordion>
            <Accordion label="Materials &amp; care">
              <p>100% premium combed cotton (220 gsm). Machine wash cold inside out. Tumble dry low. Do not bleach.</p>
            </Accordion>
            <Accordion label="Shipping &amp; returns">
              <p>Printed to order in 3–5 business days, then shipped worldwide. Free shipping on orders over {FREE_SHIPPING_THRESHOLD_LABEL}. 30-day returns and exchanges on unworn items.</p>
            </Accordion>
          </div>
        </div>
      </section>

      {/* === STORY BLOCK === */}
      <section
        className="border-t"
        style={{ borderColor: "hsl(var(--pa-hairline))", background: "hsl(var(--pa-bone))" }}
      >
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
          <div>
            <p className="font-display text-[12px] uppercase tracking-[0.2em]" style={{ color: PILLAR_META[pillar].bg }}>
              {PILLAR_META[pillar].label}
            </p>
            <h2 className="font-display uppercase mt-3 leading-[0.95]" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              The story behind the design
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-[15px] leading-relaxed" style={{ color: "hsl(var(--pa-ink))" }}>
              Every PANAPP piece carries a thread of memory. This one is rooted in {PILLAR_META[pillar].label.toLowerCase()} —
              a reminder that heritage is not nostalgia, but a compass. We print to order so each garment leaves
              the studio with intent, not surplus.
            </p>
            <blockquote
              className="font-quote text-[22px] leading-snug border-l-2 pl-5"
              style={{ borderColor: PILLAR_META[pillar].bg, color: "hsl(var(--pa-ink))" }}
            >
              “Rooted in history. Driven by purpose.”
              <footer className="not-italic font-body text-[11px] uppercase tracking-[0.16em] mt-3" style={{ color: "hsl(var(--pa-muted))" }}>
                — PANAPP
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* === LOOKBOOK BAND === */}
      {product.images[1] && (
        <section className="w-full" style={{ background: "hsl(var(--pa-ink))" }}>
          <img
            src={product.images[1]}
            alt={`${product.name} — lookbook`}
            loading="lazy"
            className="w-full h-[60vh] lg:h-[80vh] object-cover"
          />
        </section>
      )}

      {/* === REVIEWS (empty state) === */}
      <section className="max-w-[1100px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display uppercase text-[clamp(1.5rem,3vw,2.25rem)] leading-none">Reviews</h2>
          <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "hsl(var(--pa-muted))" }}>0 reviews</span>
        </div>
        <div className="border p-10 text-center" style={{ borderColor: "hsl(var(--pa-hairline))" }}>
          <Stars rating={0} />
          <p className="mt-3 text-[14px]" style={{ color: "hsl(var(--pa-muted))" }}>
            Be the first to review this piece.
          </p>
        </div>
      </section>

      {/* === RELATED === */}
      {related.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 lg:px-8 pb-24">
          <h2 className="font-display uppercase text-[clamp(1.5rem,3vw,2.25rem)] leading-none mb-8">
            You may also like
          </h2>
          <ProductGrid products={related} />
        </section>
      )}

      {/* === STICKY MOBILE BAR === */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t transition-transform duration-300 ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}
        style={{
          background: "hsla(0, 0%, 97%, 0.96)",
          borderColor: "hsl(var(--pa-hairline))",
          backdropFilter: "blur(12px)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex items-stretch gap-3 px-4 py-3">
          <div className="flex flex-col justify-center min-w-0">
            <p className="text-[10px] uppercase font-display tracking-[0.14em] truncate">{product.name}</p>
            <p className="text-[13px] font-medium mt-0.5">{formatPrice(tierPrice(selectedTier))}</p>
          </div>
          <button
            onClick={tryAdd}
            disabled={!product.in_stock || !selectedSize}
            aria-disabled={!product.in_stock || !selectedSize}
            className="flex-1 font-display text-[13px] uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "hsl(var(--pa-ink))", color: "hsl(var(--pa-bone))" }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
