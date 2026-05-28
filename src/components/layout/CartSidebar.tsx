import { X, Minus, Plus, Truck } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { CartItem } from "@/types";
import { Link } from "react-router-dom";

const FREE_SHIPPING_THRESHOLD = 100;

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
}

const CartSidebar = ({
  isOpen,
  onClose,
  items,
  total,
  onRemove,
  onUpdateQuantity,
}: CartSidebarProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[70]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-background z-[80] animate-slide-in-right flex flex-col border-l border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-[12px] font-bold uppercase tracking-fashion">
            Cart
          </h2>
          <button
            onClick={onClose}
            className="hover:opacity-60 transition-opacity"
          >
            <X size={18} />
          </button>
        </div>

        {items.length > 0 && (() => {
          const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
          const pct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
          const unlocked = remaining === 0;
          return (
            <div className="px-5 pt-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={12} />
                <p className="text-[10px] uppercase tracking-fashion font-semibold">
                  {unlocked
                    ? "Free EU shipping unlocked"
                    : `Add ${formatPrice(remaining)} for free shipping`}
                </p>
              </div>
              <div className="h-[3px] w-full bg-secondary overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: unlocked ? "#16a34a" : "#990000",
                  }}
                />
              </div>
            </div>
          );
        })()}

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {items.length === 0 && (
            <p className="text-[11px] text-muted-foreground uppercase tracking-fashion text-center py-16">
              Your cart is empty
            </p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-20 bg-secondary flex-shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-fashion">
                    {item.product.name}
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase">
                    Size: {item.size}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-[10px] w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                  <p className="text-[10px] font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="self-start hover:opacity-60 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-3">
            <div className="flex justify-between text-[11px] font-semibold uppercase tracking-fashion">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full py-3 text-center text-[10px] font-semibold uppercase tracking-fashion bg-foreground text-primary-foreground hover:opacity-80 transition-opacity"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
