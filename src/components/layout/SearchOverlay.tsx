import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/formatPrice";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: products = [] } = useProducts();

  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      )
      .slice(0, 8);
  }, [q, products]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-sm flex flex-col">
      <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-4 md:px-8 md:py-6">
        <Search size={18} className="opacity-60" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="flex-1 bg-transparent outline-none text-base md:text-lg uppercase tracking-fashion placeholder:opacity-40"
        />
        <button
          onClick={onClose}
          aria-label="Close search"
          className="text-[10px] uppercase tracking-fashion flex items-center gap-1"
        >
          <X size={18} />
          <span className="hidden md:inline">Close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {q.trim() && results.length === 0 && (
          <p className="text-xs uppercase tracking-fashion opacity-60">
            No products match "{q}"
          </p>
        )}
        {results.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {results.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/product/${p.slug}`}
                  onClick={onClose}
                  className="block group"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-foreground/5">
                    {p.images?.[0] && (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-[10px] uppercase tracking-fashion font-semibold">
                    {p.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-fashion opacity-70">
                    {formatPrice(p.price)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
