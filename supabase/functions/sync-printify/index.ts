import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PRINTIFY_TOKEN = Deno.env.get("PRINTIFY_API_TOKEN");
    const SHOP_ID = Deno.env.get("PRINTIFY_SHOP_ID");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!PRINTIFY_TOKEN || !SHOP_ID || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Fetch all products from Printify (paginated)
    let page = 1;
    let allProducts: any[] = [];
    while (true) {
      const res = await fetch(
        `https://api.printify.com/v1/shops/${SHOP_ID}/products.json?page=${page}&limit=50`,
        { headers: { Authorization: `Bearer ${PRINTIFY_TOKEN}` } }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Printify API error: ${res.status} ${text}`);
      }
      const json = await res.json();
      const products = json.data ?? json;
      if (!Array.isArray(products) || products.length === 0) break;
      allProducts = allProducts.concat(products);
      if (products.length < 50) break;
      page++;
    }

    // Fetch existing collections
    const { data: existingCollections } = await supabase
      .from("collections")
      .select("id, name, slug");

    const collectionsMap = new Map(
      (existingCollections ?? []).map((c: any) => [c.slug, c.id])
    );

    let synced = 0;
    let errors: string[] = [];

    for (const p of allProducts) {
      try {
        // Only sync published products
        if (!p.visible) continue;

        const slug = p.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        // Extract images
        const images = (p.images ?? [])
          .filter((img: any) => img.is_default || img.is_selected_for_publishing)
          .map((img: any) => img.src)
          .slice(0, 6);

        if (images.length === 0 && p.images?.length > 0) {
          images.push(p.images[0].src);
        }

        // Extract sizes from variants
        const sizes = [
          ...new Set(
            (p.variants ?? [])
              .filter((v: any) => v.is_enabled)
              .map((v: any) => v.title?.split(" / ").pop())
              .filter(Boolean)
          ),
        ] as string[];

        // Build variant mapping for order forwarding
        const variantMapping = (p.variants ?? [])
          .filter((v: any) => v.is_enabled)
          .map((v: any) => ({
            printify_variant_id: v.id,
            title: v.title,
            price: v.price / 100,
            sku: v.sku,
          }));

        // Price from first enabled variant (Printify prices are in cents)
        const firstEnabledVariant = (p.variants ?? []).find((v: any) => v.is_enabled);
        const price = firstEnabledVariant ? firstEnabledVariant.price / 100 : 0;

        // Check stock
        const inStock = (p.variants ?? []).some(
          (v: any) => v.is_enabled && v.is_available
        );

        // Try to map tags to collections
        let collectionId: string | null = null;
        for (const tag of p.tags ?? []) {
          const tagSlug = tag
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          if (collectionsMap.has(tagSlug)) {
            collectionId = collectionsMap.get(tagSlug)!;
            break;
          }
        }

        // Strip HTML from description
        const description = (p.description ?? "")
          .replace(/<[^>]*>/g, "")
          .trim();

        const productData = {
          printify_id: String(p.id),
          name: p.title,
          slug,
          description,
          price,
          images,
          sizes,
          in_stock: inStock,
          featured: false,
          collection_id: collectionId,
          printify_variant_mapping: variantMapping,
        };

        // Upsert by printify_id
        const { error: upsertError } = await supabase
          .from("products")
          .upsert(productData, { onConflict: "printify_id" });

        if (upsertError) {
          errors.push(`${p.title}: ${upsertError.message}`);
        } else {
          synced++;
        }
      } catch (e) {
        errors.push(`${p.title}: ${e.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_fetched: allProducts.length,
        synced,
        errors,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: e.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
