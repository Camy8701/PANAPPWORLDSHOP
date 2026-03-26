import { CartItem } from "@/types";

interface CheckoutProps {
  items: CartItem[];
  total: number;
}

const Checkout = ({ items, total }: CheckoutProps) => {
  return (
    <main className="pt-28 px-6 max-w-3xl mx-auto pb-20">
      <h1 className="font-display text-4xl tracking-wide-fashion mb-12">CHECKOUT</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Shipping form */}
        <div className="space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-fashion">Shipping Information</h2>
          <div className="space-y-4">
            {["Full Name", "Email", "Address", "City", "ZIP Code", "Country"].map((label) => (
              <div key={label}>
                <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            ))}
          </div>
          <button className="w-full py-3 text-xs font-semibold uppercase tracking-fashion bg-foreground text-background hover:bg-accent hover:text-accent-foreground transition-colors">
            Place Order
          </button>
        </div>

        {/* Order summary */}
        <div className="space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-fashion">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity} ({item.size})
                </span>
                <span>${item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 flex justify-between font-semibold text-sm uppercase tracking-fashion">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
