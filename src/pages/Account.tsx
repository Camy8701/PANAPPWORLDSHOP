import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/formatPrice";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

interface OrderItem {
  id: string;
  product_name: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  full_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  order_items: OrderItem[];
}

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });

  if (loading || !user) return null;

  return (
    <main className="pt-28 px-6 max-w-3xl mx-auto pb-20">
      <h1 className="font-display text-4xl tracking-wide-fashion mb-8">MY ACCOUNT</h1>

      <div className="flex items-center justify-between mb-12 border-b border-border pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-fashion text-muted-foreground">
            Signed in as
          </p>
          <p className="text-sm mt-1">{user.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="text-[10px] font-semibold uppercase tracking-fashion text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign Out
        </button>
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-fashion mb-6">Order History</h2>

      {isLoading ? (
        <p className="text-[11px] text-muted-foreground uppercase tracking-fashion">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[11px] text-muted-foreground uppercase tracking-fashion mb-4">
            No orders yet
          </p>
          <Link
            to="/collection"
            className="text-[10px] font-semibold uppercase tracking-fashion underline"
          >
            Browse Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-fashion text-muted-foreground">
                    Order placed
                  </p>
                  <p className="text-sm mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-fashion text-muted-foreground">
                    Status
                  </p>
                  <p className="text-sm mt-0.5 capitalize">{order.status}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-fashion text-muted-foreground">
                    Total
                  </p>
                  <p className="text-sm mt-0.5 font-semibold">{formatPrice(order.total)}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product_name} — {item.size} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 mt-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-fashion">
                  {order.address}, {order.city}, {order.postal_code}, {order.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Account;
