import Stripe from "https://esm.sh/stripe@18.5.0";
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
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Fallback: parse event directly (for testing without webhook signing)
      event = JSON.parse(body);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      // Create order in database
      const { data: order, error: orderError } = await supabaseClient
        .from("orders")
        .insert({
          user_id: metadata.user_id !== "guest" ? metadata.user_id : null,
          email: metadata.shipping_email || session.customer_email || "",
          full_name: metadata.shipping_name || "",
          address: metadata.shipping_address || "",
          city: metadata.shipping_city || "",
          postal_code: metadata.shipping_postal || "",
          country: metadata.shipping_country || "US",
          total: (session.amount_total || 0) / 100,
          status: "paid",
        })
        .select()
        .single();

      if (orderError) {
        console.error("Failed to create order:", orderError);
        throw orderError;
      }

      // Get line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      // Insert order items
      if (lineItems.data.length > 0) {
        const orderItems = lineItems.data.map((item) => ({
          order_id: order.id,
          product_id: order.id, // placeholder since Stripe doesn't have our product IDs
          product_name: item.description || "Unknown product",
          price: (item.amount_total || 0) / 100,
          quantity: item.quantity || 1,
          size: "", // size info is in product description
        }));

        const { error: itemsError } = await supabaseClient
          .from("order_items")
          .insert(orderItems);

        if (itemsError) {
          console.error("Failed to insert order items:", itemsError);
        }
      }

      console.log("Order created successfully:", order.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
