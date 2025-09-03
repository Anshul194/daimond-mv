import OrderSession from "@/app/models/OrderSession";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return new Response(JSON.stringify({ error: "Missing session_id" }), {
      status: 400,
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"],
    });
    console.log("Stripe session fetched:", session);
    const orderData = await OrderSession.findById(session.metadata.order_id);
    
    return Response.json({ session, orderData });
  } catch (error) {
    console.error("Stripe session fetch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
