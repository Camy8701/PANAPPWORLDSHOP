import { useState } from "react";
import { CartItem } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

interface CheckoutProps {
  items: CartItem[];
  total: number;
  onOrderPlaced: () => void;
}

const Checkout = ({ items, total, onOrderPlaced }: CheckoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: user?.email ?? "",
    address: "",
    city: "",
    postal_code: "",
    country: "US",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return;
    }

    setSubmitting(true);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        email: form.email,
        full_name: form.full_name,
        address: form.address,
        city: form.city,
        postal_code: form.postal_code,
        country: form.country,
        total,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      toast.error(orderError?.message ?? "Failed to create order");
      setSubmitting(false);
      return;
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      size: item.size,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      toast.error(itemsError.message);
      setSubmitting(false);
      return;
    }

    toast.success("Order placed successfully!");
    onOrderPlaced();
    navigate("/");
    setSubmitting(false);
  };

  return (
    <main className="pt-28 px-6 max-w-3xl mx-auto pb-20">
      <h1 className="font-display text-4xl tracking-wide-fashion mb-12">CHECKOUT</h1>

      {!user && (
        <div className="mb-8 p-4 border border-border text-center">
          <p className="text-[11px] uppercase tracking-fashion text-muted-foreground mb-2">
            Sign in to place your order
          </p>
          <Link
            to="/auth"
            className="text-[10px] font-semibold uppercase tracking-fashion underline"
          >
            Sign In / Create Account
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Shipping form */}
          <div className="space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-fashion">Shipping Information</h2>
            <div className="space-y-4">
              {[
                { label: "Full Name", field: "full_name" },
                { label: "Email", field: "email" },
                { label: "Address", field: "address" },
                { label: "City", field: "city" },
                { label: "ZIP Code", field: "postal_code" },
                { label: "Country", field: "country" },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    required
                    value={form[field as keyof typeof form]}
                    onChange={handleChange(field)}
                    className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={submitting || items.length === 0 || !user}
              className="w-full py-3 text-xs font-semibold uppercase tracking-fashion bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Placing Order..." : "Place Order"}
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
              {items.length === 0 && (
                <p className="text-[11px] text-muted-foreground uppercase tracking-fashion">
                  Your cart is empty
                </p>
              )}
            </div>
            <div className="border-t border-border pt-4 flex justify-between font-semibold text-sm uppercase tracking-fashion">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Checkout;
