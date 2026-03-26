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

    // Auto-create collections from tags
    // We'll look for common category tags: Women, Men, Accessories, Unisex, Kids, etc.
    const CATEGORY_TAGS = ["women", "men", "accessories", "unisex", "kids", "t-shirts", "hoodies", "hats", "bags"];

    // Collect all unique tags from products
    const allTags = new Set<string>();
    for (const p of allProducts) {
      if (!p.visible) continue;
      for (const tag of p.tags ?? []) {
        allTags.add(tag.toLowerCase().trim());
      }
    }

    // Create collections for tags that match categories or any tag that appears on 3+ products
    const tagCounts = new Map<string, number>();
    for (const p of allProducts) {
      if (!p.visible) continue;
      for (const tag of p.tags ?? []) {
        const t = tag.toLowerCase().trim();
        tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
      }
    }

    // Create collections for category tags or popular tags (3+ products)
    const tagsToCreate = [...allTags].filter((tag) => {
      const slug = tag.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (collectionsMap.has(slug)) return false;
      return CATEGORY_TAGS.includes(tag) || (tagCounts.get(tag) ?? 0) >= 3;
    });

    for (const tag of tagsToCreate) {
      const slug = tag.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const name = tag.charAt(0).toUpperCase() + tag.slice(1);
      const { data: newCol, error: colErr } = await supabase
        .from("collections")
        .insert({ name, slug, description: `Products tagged "${tag}"` })
        .select("id")
        .single();
      if (!colErr && newCol) {
        collectionsMap.set(slug, newCol.id);
      }
    }

    // Track used slugs to handle duplicates
    const usedSlugs = new Set<string>();
    // Fetch existing slugs from DB
    const { data: existingSlugs } = await supabase
      .from("products")
      .select("slug, printify_id");
    const slugToPrintifyId = new Map<string, string>();
    for (const row of existingSlugs ?? []) {
      usedSlugs.add(row.slug);
      if (row.printify_id) slugToPrintifyId.set(row.printify_id, row.slug);
    }

    let synced = 0;
    let errors: string[] = [];
    let collectionsCreated = tagsToCreate.length;

    for (const p of allProducts) {
      try {
        if (!p.visible) continue;

        let slug = p.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        // If this product already exists by printify_id, reuse its slug
        const existingSlug = slugToPrintifyId.get(String(p.id));
        if (existingSlug) {
          slug = existingSlug;
        } else {
          // Handle duplicate slugs by appending suffix
          let finalSlug = slug;
          let suffix = 2;
          while (usedSlugs.has(finalSlug)) {
            finalSlug = `${slug}-${suffix}`;
            suffix++;
          }
          slug = finalSlug;
        }
        usedSlugs.add(slug);

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

        // Build variant mapping
        const variantMapping = (p.variants ?? [])
          .filter((v: any) => v.is_enabled)
          .map((v: any) => ({
            printify_variant_id: v.id,
            title: v.title,
            price: v.price / 100,
            sku: v.sku,
          }));

        // Price from first enabled variant
        const firstEnabledVariant = (p.variants ?? []).find((v: any) => v.is_enabled);
        const price = firstEnabledVariant ? firstEnabledVariant.price / 100 : 0;

        const inStock = (p.variants ?? []).some(
          (v: any) => v.is_enabled && v.is_available
        );

        // Map tags to collection — pick the first matching tag
        let collectionId: string | null = null;
        for (const tag of p.tags ?? []) {
          const tagSlug = tag
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          if (collectionsMap.has(tagSlug)) {
            collectionId = collectionsMap.get(tagSlug)!;
            break;
          }
        }

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
        collections_created: collectionsCreated,
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
