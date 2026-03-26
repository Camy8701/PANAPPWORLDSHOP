import { X, Minus, Plus } from "lucide-react";
import { CartItem } from "@/types";
import { Link } from "react-router-dom";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
}

const CartSidebar = ({ isOpen, onClose, items, total, onRemove, onUpdateQuantity }: CartSidebarProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[70]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-[80] animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-2xl tracking-fashion">CART</h2>
          <button onClick={onClose} className="hover:text-accent transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground uppercase tracking-fashion text-center py-12">
              Your cart is empty
            </p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-20 h-24 bg-secondary flex items-center justify-center">
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-fashion">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">Size: {item.size}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={12} />
                    </button>
                    <span className="text-xs w-6 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="text-xs font-semibold">${item.product.price * item.quantity}</p>
                </div>
              </div>
              <button onClick={() => onRemove(item.id)} className="self-start hover:text-accent transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex justify-between text-sm font-semibold uppercase tracking-fashion">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full py-3 text-center text-xs font-semibold uppercase tracking-fashion bg-foreground text-background hover:bg-accent hover:text-accent-foreground transition-colors"
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
