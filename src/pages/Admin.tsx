import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCollections } from "@/hooks/useCollections";
import { toast } from "sonner";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  collection_id: string | null;
  images: string[];
  sizes: string[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
}

interface OrderRow {
  id: string;
  email: string;
  full_name: string;
  status: string;
  total: number;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: collections = [] } = useCollections();

  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    collection_id: "",
    images: "",
    sizes: "S,M,L,XL",
    in_stock: true,
    featured: false,
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchOrders();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setProducts(data as ProductRow[]);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data as OrderRow[]);
  };

  const openEdit = (p: ProductRow) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description ?? "",
      price: String(p.price),
      collection_id: p.collection_id ?? "",
      images: (p.images ?? []).join(","),
      sizes: (p.sizes ?? []).join(","),
      in_stock: p.in_stock,
      featured: p.featured,
    });
    setShowForm(true);
  };

  const openNew = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      price: "",
      collection_id: "",
      images: "",
      sizes: "S,M,L,XL",
      in_stock: true,
      featured: false,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      price: Number(form.price),
      collection_id: form.collection_id || null,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      in_stock: form.in_stock,
      featured: form.featured,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingProduct.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Product updated");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Product created");
    }
    setShowForm(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Product deleted");
    fetchProducts();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Order updated");
    fetchOrders();
  };

  if (loading) return <main className="pt-28 px-6 text-center" />;
  if (!isAdmin) return null;

  return (
    <main className="pt-28 px-6 max-w-6xl mx-auto pb-20">
      <h1 className="font-display text-4xl tracking-wide-fashion mb-8">ADMIN</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {(["products", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-[10px] font-semibold uppercase tracking-fashion transition-opacity ${
              tab === t ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === "products" && (
        <div>
          <button
            onClick={openNew}
            className="mb-6 px-4 py-2 text-[10px] font-semibold uppercase tracking-fashion bg-foreground text-background hover:opacity-80 transition-opacity"
          >
            + Add Product
          </button>

          {showForm && (
            <div className="border border-border p-6 mb-6 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-fashion">
                {editingProduct ? "Edit Product" : "New Product"}
              </h3>
              {(["name", "slug", "description", "price", "images", "sizes"] as const).map((field) => (
                <div key={field}>
                  <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
                    {field} {field === "images" && "(comma-separated URLs)"} {field === "sizes" && "(comma-separated)"}
                  </label>
                  {field === "description" ? (
                    <textarea
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      rows={3}
                      className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  ) : (
                    <input
                      type={field === "price" ? "number" : "text"}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  )}
                </div>
              ))}

              <div>
                <label className="text-[10px] uppercase tracking-fashion text-muted-foreground block mb-1">
                  Collection
                </label>
                <select
                  value={form.collection_id}
                  onChange={(e) => setForm({ ...form, collection_id: e.target.value })}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                >
                  <option value="">None</option>
                  {collections.filter((c) => c.slug !== "all").map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-fashion">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                  />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-fashion">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  Featured
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-[10px] font-semibold uppercase tracking-fashion bg-foreground text-background hover:opacity-80 transition-opacity"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-[10px] font-semibold uppercase tracking-fashion border border-border hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between border border-border px-4 py-3">
                <div>
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className="ml-3 text-[10px] text-muted-foreground uppercase tracking-fashion">
                    ${p.price} · {p.in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-[10px] uppercase tracking-fashion text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-[10px] uppercase tracking-fashion text-destructive hover:opacity-70 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="space-y-2">
          {orders.length === 0 && (
            <p className="text-[11px] text-muted-foreground uppercase tracking-fashion">No orders yet</p>
          )}
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between border border-border px-4 py-3">
              <div>
                <span className="text-sm font-semibold">{o.full_name}</span>
                <span className="ml-2 text-[10px] text-muted-foreground">{o.email}</span>
                <span className="ml-3 text-[10px] text-muted-foreground uppercase tracking-fashion">
                  ${o.total} · {new Date(o.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                  className="text-[10px] uppercase tracking-fashion border border-border bg-transparent px-2 py-1"
                >
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Admin;
