import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Collection } from "@/types";

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async (): Promise<Collection[]> => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description ?? "",
      }));
    },
  });
}
