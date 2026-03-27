import { useState, useEffect, useMemo } from "react";
import { formatPrice } from "@/lib/formatPrice";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCollections } from "@/hooks/useCollections";
import { toast } from "sonner";
import { Search } from "lucide-react";

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

const PAGE_SIZE = 10;

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: collections = [] } = useCollections();

  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Search & filter
  const [productSearch, setProductSearch] = useState("");
  const [productStockFilter, setProductStockFilter] = useState<"all" | "in_stock" | "out_of_stock">("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Pagination
  const [productPage, setProductPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);

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

  // Filtered & paginated products
  const filteredProducts = useMemo(() => {
    let list = products;
    if (productSearch) {
      const q = productSearch.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    }
    if (productStockFilter === "in_stock") list = list.filter((p) => p.in_stock);
    if (productStockFilter === "out_of_stock") list = list.filter((p) => !p.in_stock);
    return list;
  }, [products, productSearch, productStockFilter]);

  const productPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice((productPage - 1) * PAGE_SIZE, productPage * PAGE_SIZE);

  // Filtered & paginated orders
  const filteredOrders = useMemo(() => {
    let list = orders;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      list = list.filter((o) => o.full_name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q));
    }
    if (orderStatusFilter !== "all") list = list.filter((o) => o.status === orderStatusFilter);
    return list;
  }, [orders, orderSearch, orderStatusFilter]);

  const orderPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice((orderPage - 1) * PAGE_SIZE, orderPage * PAGE_SIZE);

  // Reset page when filters change
  useEffect(() => { setProductPage(1); }, [productSearch, productStockFilter]);
  useEffect(() => { setOrderPage(1); }, [orderSearch, orderStatusFilter]);

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

  const PaginationBar = ({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 text-[10px] uppercase tracking-fashion border border-border disabled:opacity-30 hover:bg-secondary transition-colors"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 text-[10px] uppercase tracking-fashion border transition-colors ${
              p === page ? "bg-foreground text-background border-foreground" : "border-border hover:bg-secondary"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 text-[10px] uppercase tracking-fashion border border-border disabled:opacity-30 hover:bg-secondary transition-colors"
        >
          Next
        </button>
      </div>
    );
  };

  const SearchInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 border border-border bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors"
      />
    </div>
  );

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
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={openNew}
              className="px-4 py-2 text-[10px] font-semibold uppercase tracking-fashion bg-foreground text-background hover:opacity-80 transition-opacity"
            >
              + Add Product
            </button>
            <button
              onClick={async () => {
                toast.info("Syncing products from Printify...");
                try {
                  const { data, error } = await supabase.functions.invoke("sync-printify");
                  if (error) throw error;
                  toast.success(`Synced ${data?.synced ?? 0} products from Printify`);
                  if (data?.errors?.length > 0) {
                    toast.warning(`${data.errors.length} products had issues`);
                  }
                  fetchProducts();
                } catch (e: any) {
                  toast.error(e.message || "Sync failed");
                }
              }}
              className="px-4 py-2 text-[10px] font-semibold uppercase tracking-fashion border border-border hover:bg-secondary transition-colors"
            >
              ↻ Sync from Printify
            </button>
          </div>

          {/* Search & filter bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex-1 min-w-[200px]">
              <SearchInput value={productSearch} onChange={setProductSearch} placeholder="Search products..." />
            </div>
            <select
              value={productStockFilter}
              onChange={(e) => setProductStockFilter(e.target.value as any)}
              className="text-[10px] uppercase tracking-fashion border border-border bg-transparent px-3 py-2"
            >
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <p className="text-[10px] text-muted-foreground uppercase tracking-fashion mb-3">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>

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
            {paginatedProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between border border-border px-4 py-3">
                <div>
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className="ml-3 text-[10px] text-muted-foreground uppercase tracking-fashion">
                    {formatPrice(p.price)} · {p.in_stock ? "In Stock" : "Out of Stock"}
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

          <PaginationBar page={productPage} totalPages={productPages} onPageChange={setProductPage} />
        </div>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div>
          {/* Search & filter bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex-1 min-w-[200px]">
              <SearchInput value={orderSearch} onChange={setOrderSearch} placeholder="Search by name or email..." />
            </div>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="text-[10px] uppercase tracking-fashion border border-border bg-transparent px-3 py-2"
            >
              <option value="all">All Statuses</option>
              {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <p className="text-[10px] text-muted-foreground uppercase tracking-fashion mb-3">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
          </p>

          <div className="space-y-2">
            {paginatedOrders.length === 0 && (
              <p className="text-[11px] text-muted-foreground uppercase tracking-fashion">No orders found</p>
            )}
            {paginatedOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between border border-border px-4 py-3">
                <div>
                  <span className="text-sm font-semibold">{o.full_name}</span>
                  <span className="ml-2 text-[10px] text-muted-foreground">{o.email}</span>
                  <span className="ml-3 text-[10px] text-muted-foreground uppercase tracking-fashion">
                    {formatPrice(o.total)} · {new Date(o.created_at).toLocaleDateString()}
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

          <PaginationBar page={orderPage} totalPages={orderPages} onPageChange={setOrderPage} />
        </div>
      )}
    </main>
  );
};

export default Admin;
