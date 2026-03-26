import { useState, useEffect } from "react";
import { CartItem } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface CheckoutProps {
  items: CartItem[];
  total: number;
  onOrderPlaced: () => void;
}

const EUROPEAN_COUNTRIES = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Netherlands" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "GB", name: "United Kingdom" },
  { code: "NO", name: "Norway" },
  { code: "CH", name: "Switzerland" },
  { code: "IS", name: "Iceland" },
];

const NON_EU_COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
];

const ALL_COUNTRIES = [...NON_EU_COUNTRIES, ...EUROPEAN_COUNTRIES].sort((a, b) =>
  a.name.localeCompare(b.name)
);

const EU_CODES = new Set(EUROPEAN_COUNTRIES.map((c) => c.code));

const Checkout = ({ items, total, onOrderPlaced }: CheckoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [guestCheckout, setGuestCheckout] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: user?.email ?? "",
    address: "",
    city: "",
    postal_code: "",
    country: "US",
  });

  const isEuropean = EU_CODES.has(form.country);
  const postalLabel = isEuropean ? "Postal Code" : "ZIP Code";

  // Handle Stripe redirect
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Payment successful! Your order has been placed.");
      onOrderPlaced();
      navigate("/");
    }
    if (searchParams.get("canceled") === "true") {
      toast.info("Payment was canceled.");
    }
  }, [searchParams, onOrderPlaced, navigate]);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!user && !guestCheckout) {
      toast.error("Please sign in or continue as guest");
      return;
    }

    if (!form.email || !form.full_name) {
      toast.error("Please fill in your name and email");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        items: items.map((item) => ({
          product_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
        })),
        shippingInfo: form,
      };

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: payload,
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
      setSubmitting(false);
    }
  };

  const canCheckout = (user || guestCheckout) && items.length > 0;

  return (
    <main className="pt-44 px-6 max-w-3xl mx-auto pb-20">
      <h1 className="font-display text-4xl tracking-wide-fashion mb-12">CHECKOUT</h1>

      {!user && !guestCheckout && (
        <div className="mb-8 p-6 border border-border text-center space-y-3">
          <p className="text-[11px] uppercase tracking-fashion text-muted-foreground">
            Sign in to place your order
          </p>
          <Link
            to="/auth"
            className="text-[10px] font-semibold uppercase tracking-fashion underline block"
          >
            Sign In / Create Account
          </Link>
          <div className="border-t border-border pt-3 mt-3">
            <button
              onClick={() => setGuestCheckout(true)}
              className="text-[10px] font-semibold uppercase tracking-fashion text-muted-foreground hover:text-foreground transition-colors"
            >
              Or continue as guest
            </button>
          </div>
        </div>
      )}

      {guestCheckout && !user && (
        <div className="mb-6 px-4 py-2 border border-border/50 bg-muted/30 text-center">
          <p className="text-[9px] uppercase tracking-fashion text-muted-foreground">
            Checking out as guest •{" "}
            <button
              onClick={() => setGuestCheckout(false)}
              className="underline hover:text-foreground"
            >
              Sign in instead
            </button>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Shipping form */}
          <div className="space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-fashion">
              Shipping Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={handleChange("full_name")}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={handleChange("address")}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={handleChange("city")}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
                  {postalLabel}
                </label>
                <input
                  type="text"
                  required
                  value={form.postal_code}
                  onChange={handleChange("postal_code")}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
                  Country
                </label>
                <select
                  required
                  value={form.country}
                  onChange={handleChange("country")}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                >
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || !canCheckout}
              className="w-full py-3 text-xs font-semibold uppercase tracking-fashion bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Redirecting to Payment..." : "Proceed to Payment"}
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
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
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
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Checkout;
