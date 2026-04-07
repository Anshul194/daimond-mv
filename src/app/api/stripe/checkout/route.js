import dbConnect from "@/app/lib/mongodb";
import OrderSession from "@/app/models/OrderSession";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await dbConnect();
    const {
      cartItems,
      customerDetails,
      totalAmount,
      couponCode,
      couponDiscount,
      tax,
      tax_id,
      taxPercent,
      user_id,
    } = await req.json();

    console.log("Received data:", {
      cartItems,
      customerDetails,
      totalAmount,
      couponCode,
      couponDiscount,
      tax,
      tax_id,
      taxPercent,
      user_id,
    });

    // Defensive server-side tax computation: if `tax` is falsy or zero, compute from totalAmount and taxPercent
    const parsedTotal = Number(totalAmount) || 0;
    const parsedTax = Number(tax) || 0;
    const parsedTaxPercent = Number(taxPercent) || 0;
    const effectiveTaxAmount = parsedTax > 0 ? parsedTax : Math.round((parsedTotal * parsedTaxPercent) / 100 * 100) / 100;

    console.log('Computed tax values:', { parsedTotal, parsedTax, parsedTaxPercent, effectiveTaxAmount });

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.pid_name,
          id: item.pid_id,
        },
        unit_amount: Math.round(Number(item.pid_price) * 100), // ✅ FIXED
      },
      quantity: 1,
    }));

    if (!parsedTotal || parsedTotal <= 0) {
      console.warn("Invalid total amount for checkout:", parsedTotal);
      throw new Error("Order total must be greater than zero to proceed with payment.");
    }

    const orderSession = await OrderSession.create({
      cartItems,
      customerDetails,
      totalAmount,
      couponCode: couponCode || "N/A",
      couponDiscount: couponDiscount || 0,
      // Store the effective tax amount and percent computed server-side
      tax: effectiveTaxAmount,
      taxPercent: parsedTaxPercent,
      tax_id,
    });

    console.log("Order session created:", orderSession);

    console.log("Creating Stripe session...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Order Total",
            },
            unit_amount: Math.round(Number(totalAmount) * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Tax (${parsedTaxPercent}%)`,
            },
            unit_amount: Math.max(0, Math.round(Number(effectiveTaxAmount) * 100)),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      billing_address_collection: "required",
      customer_email: customerDetails.email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/cancel`,
      metadata: {
        order_id: orderSession._id.toString(),
        user_id: user_id || "N/A",
      },
    });

    if (!session || !session.id) {
      console.error("Stripe session created but ID is missing:", session);
      throw new Error("Failed to create Stripe session ID");
    }

    console.log("Stripe session created successfully. Session ID:", session.id);

    // Save Stripe session id back to orderSession for correlation
    try {
      await OrderSession.findByIdAndUpdate(orderSession._id, { sessionId: session.id });
      console.log("OrderSession updated with Stripe sessionId");
    } catch (e) {
      console.warn("Failed to save sessionId to OrderSession:", e.message);
    }

    return new Response(JSON.stringify({ id: session.id, success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DEBUG - Stripe checkout error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
