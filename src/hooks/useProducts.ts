import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description ?? "",
        price: Number(p.price),
        collection_id: p.collection_id ?? "",
        images: p.images ?? [],
        sizes: p.sizes ?? [],
        in_stock: p.in_stock,
        featured: p.featured,
        created_at: p.created_at,
      }));
    },
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    enabled: !!slug,
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        price: Number(data.price),
        collection_id: data.collection_id ?? "",
        images: data.images ?? [],
        sizes: data.sizes ?? [],
        in_stock: data.in_stock,
        featured: data.featured,
        created_at: data.created_at,
      };
    },
  });
}
